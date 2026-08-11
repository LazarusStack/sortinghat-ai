# Sortinghat.ai — landing page

Marketing site for Sortinghat, an AI native ATS & CRM for staffing and
recruitment agencies. Next.js 16 (App Router) + Tailwind v4, statically
prerendered.

```bash
npm run dev
```

Warm white and cream, Newsreader for display, Inter for UI, one violet accent.

## Structure

| Path | What |
| --- | --- |
| `app/page.tsx` | The page: composes every section in order |
| `app/layout.tsx` | Fonts, metadata |
| `app/globals.css` | Design tokens, type utilities, keyframes |
| `components/` | Nav, sections, `ui.tsx` |
| `components/mocks/` | The hero window and the per-feature product films |
| `components/integrations/` | The branching integrations diagram |

The page runs: hero → clients → the four pillars on a black band → Features →
Talent Pool → Workflow → Revenue & Growth → Analytics → everything-else grid →
integrations → 4-week migration → closing CTA with the embedded scheduler →
footer.

Every feature is grouped under one of four headings — Talent Pool, Workflow,
Revenue & Growth, Analytics — and the hero window's tabs use the same four, so
the product story stays in one shape from top to bottom.

## Product visuals

Every screenshot is a live HTML/CSS mock of the Sortinghat UI, not an embedded
video, so they stay sharp at any size and cost nothing to load. Swap in real
recordings by replacing the `mock` prop in `app/page.tsx`.

Customer logos live in `public/logos/customers/` as full-colour transparent
PNGs. They render black via `brightness(0)` and return to colour on hover, so
the treatment is one class away from changing and the originals stay intact.

## Editing the essentials

- **Demo link** — `DEMO_URL` in `components/ui.tsx`. The page embeds the
  scheduler at `#book`, so the buttons scroll there rather than leaving.
- **Wordmark** — `Wordmark` in `components/ui.tsx`; `public/logo.svg` is the
  standalone asset.
- **Copy** — inline in the page files and section files.

Dense product mocks scroll sideways in their own gutter on small screens so the
UI stays legible rather than being squashed into noise.
