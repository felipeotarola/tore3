# AGENTS.md — Torekull Website Agent Instructions

## Mission

You are working on the Torekull website.

The goal is to make the site feel premium, calm, editorial, architectural, and easy to scan.

Do not randomly redesign the site. Preserve the existing brand feeling, content, routes, imagery, and overall identity.

Improve the system behind the design so every page feels consistent.

---

## Product Context

Torekull is an interior architecture and design studio.

The website should feel:

- premium
- editorial
- Scandinavian
- calm
- confident
- visual
- architectural
- hospitality-focused
- high-end but not flashy

Avoid making the site feel like:

- a SaaS dashboard
- a generic template
- a startup landing page
- overly colorful
- overly animated
- too playful
- too minimal to the point of being hard to use

---

## Required Workflow

Before making changes:

1. Inspect the app structure.
2. Find all routes.
3. Find shared components.
4. Run the local dev server.
5. Visit the main pages.
6. Take screenshots at multiple viewport sizes.
7. Identify repeated layout problems.
8. Write a short audit.
9. Refactor shared components first.
10. Update pages after the shared system is improved.
11. Run lint/build.
12. Re-test the changed pages.

Do not only fix one visible page. This is a full-site design-system pass.

---

## Pages To Test

Test at minimum:

- Home
- Projects
- At least 2 project detail pages
- About
- Press
- Contact

Test at these widths:

- 390px mobile
- 768px tablet
- 1024px small laptop
- 1440px desktop

---

## Main Problems To Fix

The site currently has strong imagery but weaker scanability.

Fix:

- oversized hero typography
- inconsistent H1/H2/body sizing
- weak label/value hierarchy
- inconsistent spacing between sections
- inconsistent image ratios
- project cards that feel uneven
- metadata blocks that are hard to scan
- weak CTA visibility
- subtle navigation contrast over images
- confusing close/back pattern
- contact form layout that feels too spread out
- footer hierarchy
- inconsistent container widths
- lack of predictable section rhythm

---

## Scanability Rules

A user should understand each page in 2–3 seconds.

For every page, ask:

- What is this page?
- What is the main action?
- What content matters first?
- Can the user skim headings quickly?
- Can the user compare projects quickly?
- Is the layout predictable?
- Is the text readable?
- Are clickable elements obvious?

If the answer is unclear, improve hierarchy.

---

## Typography Rules

Use one clear type system.

Each page should have:

- one H1
- consistent H2s
- consistent body text
- consistent eyebrow labels
- consistent metadata labels
- readable line lengths

Avoid:

- huge headings with long text
- tiny body text
- all-caps labels that are too subtle
- paragraphs that stretch too wide
- inconsistent heading sizes across pages

---

## Layout Rules

Use shared layout primitives.

Prefer:

- shared page shell
- shared container
- shared section wrapper
- shared section header
- shared split layout
- shared card grid
- shared metadata grid

Avoid:

- random max-widths
- random padding
- random section gaps
- one-off card styles
- one-off hero layouts unless necessary

---

## Component Strategy

Create or consolidate shared components where useful.

Recommended components:

- PageShell
- Container
- Section
- PageHero
- SectionHeader
- Eyebrow
- Heading
- Lead
- TextBlock
- ProjectCard
- PressCard
- MetadataGrid
- MetadataItem
- ImageFrame
- Button
- TextLink
- Chip
- Footer
- Header

Do not over-engineer. Keep the component system practical.

---

## Visual Direction

Keep the aesthetic restrained.

Use:

- warm off-white backgrounds
- deep charcoal text
- soft warm gray muted text
- subtle borders
- quiet shadows only when useful
- architectural image crops
- controlled whitespace
- clear editorial rhythm

Avoid:

- bright colors
- heavy gradients
- strong shadows
- too many borders
- random animations
- decorative effects that hurt readability

---

## Images

Images are the strongest part of the site.

Improve consistency by using standard ratios:

- Hero images: 16:9 or 16:10
- Project cards: 4:3 or 3:2
- Press cards: 4:3
- Gallery images: consistent rows with controlled cropping

Rules:

- Use object-fit carefully.
- Avoid awkward crops of important details.
- Do not mix many random image heights.
- Use consistent radius.
- Use consistent overlay darkness when text is on images.
- Ensure text over images passes visual contrast.

---

## Navigation

Navigation must be readable on image backgrounds.

Improve:

- contrast
- active state
- hover state
- spacing
- mobile usability
- accessibility labels

The nav should feel premium but not hidden.

---

## Project Pages

Project pages need clearer structure.

Improve:

- title hierarchy
- hero image placement
- project metadata readability
- collaborator list formatting
- gallery rhythm
- back/close navigation clarity

Metadata should be easy to scan.

Use clear label/value pairs.

---

## Contact Page

The contact page should be easier to complete.

Improve:

- field grouping
- label readability
- spacing between inputs
- button position
- mobile layout
- clear success/error states if present

The send button should feel connected to the form.

---

## Accessibility

Keep accessibility in mind.

Use:

- semantic HTML
- visible focus states
- proper button/link labels
- readable contrast
- sensible heading order
- alt text for important images

The close/back icon must have an accessible label.

---

## Implementation Rules

- Preserve existing content.
- Preserve existing routes.
- Do not delete functionality.
- Prefer shared refactors over one-off patches.
- Do not introduce new dependencies unless necessary.
- Do not break the CMS/content editor.
- Do not remove the content editor button.
- Keep code simple and maintainable.
- Run lint/build before finishing.

---

## Definition Of Done

The work is complete when:

- all main pages use consistent typography
- all main pages use consistent spacing
- image/card ratios feel intentional
- project pages are easier to scan
- press cards are easier to compare
- contact form is easier to use
- navigation is readable
- mobile/tablet/desktop are tested
- no horizontal overflow exists
- lint/build passes
- screenshots show clear improvement