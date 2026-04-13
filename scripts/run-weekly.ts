// WEEKLY CRON — schedule Monday mornings (or your cadence)
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const client = new Anthropic();

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─── Insert draft into Supabase ───────────────────────────────────────────────

async function insertDraftToSupabase(draft: {
  title: string;
  excerpt: string;
  body: string;
  suggested_tags: string[];
  sources_used: string[];
  sessionId: string;
  date: string;
}): Promise<{ review_token: string; id: string } | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn("Supabase env vars missing — skipping DB insert.");
    return null;
  }

  const slug = draft.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);

  const payload = {
    slug: `${slug}-${Date.now()}`,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.body,
    tags: draft.suggested_tags,
    sources_used: draft.sources_used,
    agent_session_id: draft.sessionId,
    is_published: false,
    review_status: "pending_review",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Supabase insert failed:", err);
    return null;
  }

  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  return { review_token: row.review_token, id: row.id };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runWeeklyDraft() {
  const { AGENT_ID, ENVIRONMENT_ID } = JSON.parse(
    readFileSync(".agent-config.json", "utf-8")
  );

  const today = new Date().toISOString().split("T")[0];
  console.log(`\n[${today}] TOREKULL content run starting`);

  const session = await client.beta.sessions.create({
    agent: AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: `TOREKULL draft — ${today}`,
  });
  console.log(`Session: ${session.id}\n`);

  // Open stream BEFORE sending kickoff
  const stream = await client.beta.sessions.events.stream(session.id);

  await client.beta.sessions.events.send(session.id, {
    events: [
      {
        type: "user.message",
        content: [
          {
            type: "text",
            text: `Research and draft this week's TOREKULL blog post.

Find what is actively being covered in commercial interior architecture right now — a restaurant or hotel opening getting design press, a material or spatial trend gaining traction, a technique worth an editorial close-up. Prioritize coverage from the past 2–4 weeks.

Use web_search to find sources, then web_fetch to read the strongest ones in full before you write. The post must be specific and grounded — name real projects, materials, studios, or spatial strategies. Apply the TOREKULL editorial voice throughout.

When done, write the JSON to /mnt/session/outputs/draft.json AND output the raw JSON as your final message — nothing else, no commentary, just the JSON object.

Today's date: ${today}`,
          },
        ],
      },
    ],
  });

  // Collect stream text
  let collectedText = "";

  for await (const event of stream) {
    if (event.type === "agent.message") {
      for (const block of event.content) {
        if (block.type === "text") {
          process.stdout.write(block.text);
          collectedText += block.text;
        }
      }
    } else if (event.type === "agent.tool_use") {
      const name = (event as any).tool_name ?? (event as any).name ?? "tool";
      console.log(`\n  → [${name}]`);
    } else if (event.type === "session.error") {
      console.error("\nSession error:", JSON.stringify(event));
    }

    if (event.type === "session.status_terminated") break;
    if (event.type === "session.status_idle") {
      const stopType = (event as any).stop_reason?.type;
      if (stopType === "requires_action") continue;
      break;
    }
  }

  console.log("\n\nRun complete. Parsing draft...");

  const outputDir = join("./drafts", today);
  mkdirSync(outputDir, { recursive: true });

  // Parse JSON — handle both raw JSON and ```json code blocks
  let draft: {
    title: string;
    excerpt: string;
    body: string;
    suggested_tags: string[];
    sources_used: string[];
  } | null = null;

  const codeBlock = collectedText.match(/```(?:json)?\n([\s\S]*?)\n```/);
  const jsonCandidate = codeBlock ? codeBlock[1] : collectedText;

  // Find outermost { } that contains "title" and "body"
  const startIdx = jsonCandidate.indexOf("{");
  const endIdx = jsonCandidate.lastIndexOf("}");
  if (startIdx !== -1 && endIdx > startIdx) {
    try {
      draft = JSON.parse(jsonCandidate.slice(startIdx, endIdx + 1));
    } catch {
      // If body contains unescaped quotes, save raw text for manual recovery
      console.warn("JSON parse failed — saving raw output for inspection.");
      writeFileSync(join(outputDir, "draft-raw.txt"), collectedText);
    }
  }

  if (!draft) {
    console.warn("Could not extract draft JSON. Raw output saved.");
    await client.beta.sessions.archive(session.id);
    return;
  }

  // Save JSON locally
  const localPath = join(outputDir, "draft.json");
  writeFileSync(localPath, JSON.stringify(draft, null, 2));
  console.log(`Local draft: ${localPath}`);

  // Insert into Supabase
  console.log("Inserting into Supabase...");
  const inserted = await insertDraftToSupabase({
    ...draft,
    sessionId: session.id,
    date: today,
  });

  if (inserted) {
    const reviewUrl = `${SITE_URL}/review/${inserted.review_token}`;
    console.log(`\n✓ Draft in Supabase (id: ${inserted.id})`);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  REVIEW URL (send to Maja-Li):`);
    console.log(`  ${reviewUrl}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    // Save review URL alongside draft
    writeFileSync(join(outputDir, "review-url.txt"), reviewUrl);
  } else {
    console.warn("Supabase insert skipped — draft is only saved locally.");
  }

  console.log("\n--- DRAFT PREVIEW ---");
  console.log(`Title:   ${draft.title}`);
  console.log(`Excerpt: ${draft.excerpt}`);
  console.log(`Tags:    ${draft.suggested_tags?.join(", ")}`);
  console.log(`Sources: ${draft.sources_used?.length} cited`);
  console.log("---------------------\n");

  await client.beta.sessions.archive(session.id);
  console.log("Session archived. Ready for Maja-Li's review.");
}

runWeeklyDraft().catch(console.error);
