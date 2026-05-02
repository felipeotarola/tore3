# DESIGN.md — Torekull Design System

## Design Goal

Torekull should feel like a premium interior architecture portfolio.

The design should communicate:

- craft
- calm confidence
- editorial quality
- architectural precision
- hospitality experience
- high-end simplicity

The site should be beautiful, but also easy to scan.

---

## Core Principle

The current site is visually strong but structurally hard to scan.

This design pass must improve:

- hierarchy
- rhythm
- consistency
- contrast
- alignment
- readability
- reusable components

Do not remove the premium feeling. Make it more usable.

---

## Color Tokens

Use a restrained warm neutral palette.

Suggested tokens:

```css
:root {
  --color-bg: #f7f5f0;
  --color-surface: #ffffff;
  --color-surface-soft: #f1eee8;

  --color-text: #1f1f1d;
  --color-text-muted: #68645d;
  --color-text-soft: #8f8a82;

  --color-border: #ddd8ce;
  --color-border-strong: #c8c0b4;

  --color-inverse: #ffffff;
  --color-overlay: rgba(0, 0, 0, 0.42);
  --color-overlay-strong: rgba(0, 0, 0, 0.62);

  --color-accent: #9b8363;
  --color-accent-dark: #6f5b43;
}