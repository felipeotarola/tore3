import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

import { insertDraft } from '@/lib/blog-posts';

export const maxDuration = 300;

const AGENT_CONFIG_PATH = '.agent-config.json';

function loadAgentConfig(): { AGENT_ID: string; ENVIRONMENT_ID: string } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const raw = fs.readFileSync(AGENT_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractDraftJson(text: string) {
  // Handle ```json ... ``` code blocks or raw JSON
  const codeBlock = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
  const candidate = codeBlock ? codeBlock[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    if (parsed.title && parsed.body) return parsed;
  } catch {
    return null;
  }
  return null;
}

const enc = new TextEncoder();

function sse(data: object): Uint8Array {
  return enc.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json().catch(() => ({ message: '', sessionId: null }));

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'Message required' }), { status: 400 });
  }

  const config = loadAgentConfig();
  if (!config) {
    return new Response(JSON.stringify({ error: '.agent-config.json not found' }), { status: 500 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Create or reuse session
        let activeSessionId = sessionId as string | null;
        if (!activeSessionId) {
          const session = await client.beta.sessions.create({
            agent: config.AGENT_ID,
            environment_id: config.ENVIRONMENT_ID,
            title: `Chat — ${new Date().toISOString().split('T')[0]}`,
          });
          activeSessionId = session.id;
        }

        // Emit session ID so client can track it for multi-turn
        controller.enqueue(sse({ type: 'session', id: activeSessionId }));

        // Stream-first: open stream before sending message
        const agentStream = await client.beta.sessions.events.stream(activeSessionId);

        await client.beta.sessions.events.send(activeSessionId, {
          events: [
            {
              type: 'user.message',
              content: [{ type: 'text', text: message }],
            },
          ],
        });

        let collectedText = '';

        for await (const event of agentStream) {
          if (event.type === 'agent.message') {
            for (const block of event.content) {
              if (block.type === 'text') {
                collectedText += block.text;
                controller.enqueue(sse({ type: 'text', text: block.text }));
              }
            }
          } else if (event.type === 'agent.tool_use') {
            const name =
              (event as unknown as { tool_name?: string }).tool_name ?? 'tool';
            controller.enqueue(sse({ type: 'tool', name }));
          } else if (event.type === 'session.error') {
            controller.enqueue(sse({ type: 'error', message: JSON.stringify(event) }));
          }

          if (event.type === 'session.status_terminated') break;
          if (event.type === 'session.status_idle') {
            const stopType = (event as unknown as { stop_reason?: { type?: string } })
              .stop_reason?.type;
            if (stopType === 'requires_action') continue;
            break;
          }
        }

        // Detect and save draft
        const draft = extractDraftJson(collectedText);
        if (draft) {
          const inserted = await insertDraft({
            title: draft.title,
            excerpt: draft.excerpt ?? '',
            body: draft.body,
            tags: Array.isArray(draft.suggested_tags) ? draft.suggested_tags : [],
            sources_used: Array.isArray(draft.sources_used) ? draft.sources_used : [],
            agent_session_id: activeSessionId,
          });

          if (inserted) {
            const reviewUrl = `${siteUrl}/review/${inserted.review_token}`;
            controller.enqueue(
              sse({
                type: 'draft',
                id: inserted.id,
                token: inserted.review_token,
                title: inserted.title,
                reviewUrl,
              }),
            );
          }
        }

        controller.enqueue(sse({ type: 'done', sessionId: activeSessionId }));
      } catch (err) {
        controller.enqueue(
          sse({ type: 'error', message: err instanceof Error ? err.message : String(err) }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    },
  });
}
