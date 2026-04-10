# AGENTS.md - Torekull Project Guide for LLM Agents

This file explains how the project works and where to edit when implementing features.

## 1. Project Snapshot

- Framework: Next.js App Router (TypeScript) in `src/app`.
- UI: React + Tailwind + shadcn/ui components.
- Data source for projects: Supabase `public.projects` (read on server, edit in client sidebar).
- Landing-page copy CMS: Supabase `public.landing_copy` + localStorage fallback.
- Main landing page route: `src/app/page.tsx`.

Important: There is also a legacy React SPA in `src/main.jsx`, `src/App.jsx`, `src/components/EditorPanel.jsx`, `src/hooks/useCmsContent.js`. The current Next.js website uses `src/app/*` and `src/components/*` under the App Router.

## 2. Runtime Architecture

### 2.1 Home Page Composition

`src/app/page.tsx` wraps the landing sections with:

- `LandingCopyEditorProvider`

and renders:

- `Hero`
- `AboutIntro`
- `CaseStudies`
- `Services`
- `Logos`
- `PressPreview`

This means the CMS sidebar context is available to all home-page sections.

### 2.2 Copy Rendering

Editable copy is rendered through:

- `src/components/editing/editable-text.tsx`

`EditableText` currently only reads from context:

- `const text = copy[copyKey] ?? fallback`

There is no inline `contentEditable` editing now. Editing happens in the sidebar panel.

### 2.3 Server/Client Split for Projects

- `src/components/sections/case-studies.tsx` (server component) loads all projects via `getAllProjects()`.
- `src/components/sections/case-studies-client.tsx` (client component) applies selected-project ordering from landing copy state and renders cards.

Project data source:

- `src/lib/projects.ts`
- Fetches Supabase REST endpoint with `is_published=eq.true` and `order=sort_order.asc.nullslast,created_at.asc`.

## 3. CMS Sidebar (Landing Copy Editor)

Core file:

- `src/components/editing/landing-copy-editor-provider.tsx`

What it owns:

- Supabase auth session (email/password login).
- Home copy map (`copy`) and persistence to `landing_copy`.
- Selected-project list for homepage (`home.caseStudies.featuredSlugs`).
- Full project editor (metadata + image uploads + project reorder).
- Global sidebar UI and status messages.

### 3.1 Authentication

Uses browser Supabase client from:

- `src/lib/supabase-browser.ts`

Login method:

- `supabase.auth.signInWithPassword({ email, password })`

Logout method:

- `supabase.auth.signOut()`

### 3.2 Copy Persistence

Table:

- `public.landing_copy`
- Migration: `supabase/migrations/20260410_create_landing_copy.sql`

Data format:

- `key` (primary key)
- `value` (text)

Save behavior:

- Upsert rows (`onConflict: 'key'`).
- If table is missing, UI continues with local fallback and shows warning.

Local fallback cache:

- localStorage key: `landing_copy_local_cache_v1`

### 3.3 Selected Projects Persistence

Key used inside `landing_copy`:

- `home.caseStudies.featuredSlugs`

Value format:

- JSON stringified string array, example:
  - `"[\"kasai-stockholm\",\"moyagi-london\"]"`

Used by:

- Sidebar selected-project controls.
- `case-studies-client.tsx` to determine homepage featured order.

### 3.4 Project Editing in Sidebar

Current project editor can:

- Edit metadata: `title`, `location`, `completion`, `website`, `description`.
- Save metadata back to `public.projects` by `slug`.
- Reorder all projects and persist `sort_order`.
- Upload `cover` or `gallery` images to Supabase Storage, then write URLs into `projects`.

Expected `projects` columns used by editor:

- `id`
- `slug`
- `title`
- `location`
- `completion`
- `description`
- `website`
- `sort_order`
- `is_published`
- `cover_image`
- `gallery_images`

### 3.5 Navigation Lock While Editing

When logged in and sidebar is open, provider blocks navigation for links marked with:

- `data-editor-lock-nav="true"`

If you add new clickable links/cards that should not navigate during editing, add that attribute.

## 4. Environment Variables

Defined/used in browser and server fetches:

- `NEXT_PUBLIC_SUPABASE_URL`
- One of:
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional storage bucket override:
  - `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
  - defaults to `site-media`

If Supabase vars are missing, CMS login/edit will not work and project loader returns empty list.

## 5. How to Add New Editable Copy

1. Render text with `EditableText` in a section.
   - Provide `copyKey` and `fallback`.
2. Add that same `copyKey` to `COPY_FIELDS` in `landing-copy-editor-provider.tsx`.
3. Choose single-line `Input` or multiline `Textarea` via `multiline`.
4. Save in sidebar and verify row appears in `landing_copy`.

If step 2 is skipped, the text can display from copy map but will not be editable in the sidebar form.

## 6. Featured Projects Behavior

Logic lives in:

- `src/components/sections/case-studies-client.tsx`
- `src/components/editing/landing-copy-editor-provider.tsx`

Fallback source:

- `HOME_FEATURED_SLUGS` from `src/lib/torekull.ts`

Current behavior:

- If saved featured slugs exist in `landing_copy`, use them.
- If not, use fallback slugs filtered by available projects.
- Mobile rendering in cards currently shows first 2 cards (`index >= 2` hidden below `sm`).

## 7. Common Operations for Agents

### 7.1 Validate Changes

Run:

- `npm run lint -- <files>` for targeted lint
- `npm run build` for full app/type/static generation check

### 7.2 If `landing_copy` Errors Appear

Symptom:

- `Could not find the table 'public.landing_copy' in the schema cache`

Fix:

- Apply `supabase/migrations/20260410_create_landing_copy.sql` to the target project.

### 7.3 If Reorder Does Not Persist

Check:

- `reorderProjects` is writing `sort_order` to `public.projects`.
- User has authenticated session.
- RLS/policies on `projects` permit update for authenticated user.

## 8. Guardrails and Pitfalls

- Do not implement copy edits in random components; keep copy source centralized via `EditableText` + `COPY_FIELDS`.
- Keep selected-project persistence in `home.caseStudies.featuredSlugs` unless intentionally migrating schema.
- Do not break slug stability; many routes and references depend on `slug`.
- Image upload writes public URLs; ensure bucket permissions and URL policy match expected public access.
- Be careful with legacy SPA files (`src/App.jsx` path). They are not the current Next.js runtime path.

## 9. Useful File Map

- Home composition: `src/app/page.tsx`
- CMS provider/sidebar: `src/components/editing/landing-copy-editor-provider.tsx`
- Copy renderer: `src/components/editing/editable-text.tsx`
- Featured cards logic: `src/components/sections/case-studies-client.tsx`
- Projects data loader: `src/lib/projects.ts`
- Supabase browser client helper: `src/lib/supabase-browser.ts`
- Landing copy migration: `supabase/migrations/20260410_create_landing_copy.sql`

## 10. Recommended Change Pattern

When implementing CMS-related changes:

1. Update rendering component (where text/data appears).
2. Update sidebar/provider state and save logic.
3. Update persistence schema/query if needed.
4. Validate with lint/build.
5. Confirm behavior logged-in and logged-out.

This keeps UI, editor controls, and persistence in sync.
