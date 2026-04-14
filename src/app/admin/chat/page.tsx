'use client';

import { ExternalLink, RotateCcw, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftCard = {
  id: string;
  token: string;
  title: string;
  reviewUrl: string;
};

type Message = {
  id: string;
  role: 'user' | 'agent';
  text: string;
  tools: string[];
  draft: DraftCard | null;
  streaming: boolean;
};

// ─── SSE parser ───────────────────────────────────────────────────────────────

function parseSSEChunk(chunk: string): object[] {
  return chunk
    .split('\n')
    .filter((l) => l.startsWith('data: '))
    .map((l) => {
      try {
        return JSON.parse(l.slice(6));
      } catch {
        return null;
      }
    })
    .filter(Boolean) as object[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function newConversation() {
    setMessages([]);
    setSessionId(null);
    textareaRef.current?.focus();
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      tools: [],
      draft: null,
      streaming: false,
    };

    const agentMsg: Message = {
      id: crypto.randomUUID(),
      role: 'agent',
      text: '',
      tools: [],
      draft: null,
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!res.ok || !res.body) {
        let detail = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          if (body?.error) detail = body.error;
        } catch { /* ignore */ }
        throw new Error(detail);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const events = parseSSEChunk(decoder.decode(value, { stream: true }));

        for (const event of events) {
          const e = event as Record<string, unknown>;

          if (e.type === 'session') {
            setSessionId(e.id as string);
          } else if (e.type === 'text') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsg.id ? { ...m, text: m.text + (e.text as string) } : m,
              ),
            );
          } else if (e.type === 'tool') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsg.id
                  ? { ...m, tools: [...m.tools, e.name as string] }
                  : m,
              ),
            );
          } else if (e.type === 'draft') {
            const draft: DraftCard = {
              id: e.id as string,
              token: e.token as string,
              title: e.title as string,
              reviewUrl: e.reviewUrl as string,
            };
            setMessages((prev) =>
              prev.map((m) => (m.id === agentMsg.id ? { ...m, draft } : m)),
            );
          } else if (e.type === 'done') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsg.id ? { ...m, streaming: false } : m,
              ),
            );
          } else if (e.type === 'error') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === agentMsg.id
                  ? { ...m, text: m.text + `\n\n[Fel: ${e.message}]`, streaming: false }
                  : m,
              ),
            );
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsg.id
            ? {
                ...m,
                text: `Kunde inte nå agenten: ${err instanceof Error ? err.message : String(err)}`,
                streaming: false,
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="bg-background text-foreground flex h-screen flex-col">
      {/* Header */}
      <header className="border-border flex items-center justify-between border-b px-4 py-3 md:px-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase opacity-50">TOREKULL</p>
          <h1 className="text-sm font-semibold">Content Agent</h1>
        </div>
        <div className="flex items-center gap-3">
          {sessionId && (
            <span className="text-muted-foreground font-mono text-[10px] opacity-60">
              {sessionId.slice(0, 20)}…
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={newConversation}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="size-3" />
            Ny konversation
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.length === 0 && (
            <div className="text-muted-foreground py-16 text-center text-sm">
              <p className="font-medium">Redo att skriva.</p>
              <p className="mt-1 text-xs opacity-70">
                Beskriv ett ämne, be om ett utkast, eller ställ en fråga.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  'Skriv ett inlägg om akustisk design i restauranger',
                  'Research och draft ett inlägg om senaste hoteloppeningar',
                  'Vad är trenden inom Scandinavian hospitality design just nu?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="border-border text-muted-foreground hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
              >
                {/* Tool use indicators */}
                {msg.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="text-muted-foreground font-mono text-[10px] opacity-60"
                      >
                        → [{tool}]
                      </span>
                    ))}
                  </div>
                )}

                {/* Message bubble */}
                {(msg.text || msg.streaming) && (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-foreground text-background rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    {msg.text || (msg.streaming ? <span className="animate-pulse opacity-40">●</span> : null)}
                  </div>
                )}

                {/* Draft card */}
                {msg.draft && (
                  <div className="border-border bg-card w-full rounded-xl border p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        Utkast sparat
                      </Badge>
                    </div>
                    <p className="text-foreground mb-3 text-sm font-medium leading-snug">
                      {msg.draft.title}
                    </p>
                    <a
                      href={msg.draft.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1.5 text-xs font-medium hover:underline underline-offset-4"
                    >
                      Öppna review-sida
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-border border-t px-4 py-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="border-border bg-background flex items-end gap-2 rounded-xl border px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ett meddelande… (Enter för att skicka, Shift+Enter för ny rad)"
              rows={1}
              className="min-h-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:outline-none"
              disabled={loading}
            />
            <Button
              size="sm"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="mb-0.5 shrink-0"
            >
              <Send className="size-4" />
              <span className="sr-only">Skicka</span>
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-[10px] opacity-50">
            Agenten kan söka på webben, skriva utkast och spara till Supabase.
          </p>
        </div>
      </div>
    </main>
  );
}
