# Design System

Editorial, calm and warm on public pages; quieter and data-first in the dashboard and admin. Both share one set of tokens, defined in `src/app/globals.css` (`@theme`).

## Color
| Token | Hex | Use |
| --- | --- | --- |
| `forest` | #173D32 | Primary buttons, links, active states, italic accents |
| `pine` | #102C25 | Headings, dark sections (trust band, footer) |
| `ivory` | #F7F7ED | Page background |
| `paper` | #FCFCF6 | Raised cards on ivory |
| `sage` / `sage-soft` | #A9BCA5 / #E4EBDF | Progress tracks, icon wells, success badges |
| `gold` / `gold-soft` | #C6A46A / #F1E7D2 | Kicker rules, step numbers, verified badge — accents only, never large fills |
| `charcoal` | #252A26 | Body text |
| `muted` | #5A625B | Secondary text (≥ 4.5:1 on ivory) |
| `line` / `line-strong` | #E2E3D5 / #CFD2C1 | Hairline borders (used instead of shadows) |

## Type
- **Instrument Serif** for headlines (`.t-display`, `.t-h1`, `.t-h2`, `.t-h3`). Italic emphasis is written as `*word*` in copy and rendered by `<Emphasis>`.
- **DM Sans** for everything else. Navigation 14px, body 16px, lead 18–19px, labels 13px.
- Line length kept under ~70 characters.

## Shape and spacing
- One radius: `--radius-ui: 12px` for buttons, inputs, cards and images. Badges and chips are pills.
- 8px spacing grid. Sections are 72px tall padding on mobile, 120px on desktop.
- Borders over shadows. The only shadow is on the account dropdown.

## Components
- **Buttons:** `.btn` + `.btn-primary | .btn-secondary | .btn-ivory | .btn-ghost-light | .btn-quiet | .btn-danger`, sizes `.btn-sm`, `.btn-lg`. Arrow icons nudge on hover (`svg.arrow`).
- **Surfaces:** `.card` (paper, public), `.panel` (white, app).
- **Badges:** `.badge` plus `-gold`, `-warn`, `-danger`, `-ivory` (over photos), `-line`.
- **Forms:** `.field`, `.field-label`, `.field-hint`, `.choice` (segmented amount/tip pickers), `.alert-*`.
- **Data:** `.table` inside `TablePanel`; `StatCard`, `SectionTitle`, `EmptyState`, `AppShell` in `components/app-ui.tsx`.
- **Icons:** Lucide only, stroke 1.5–1.7.

## Motion
- One orchestrated entrance per page (`.rise` stagger on the headline block, `.settle` on the hero photo) plus a short page fade (`template.tsx`).
- Hover: image zoom on photographic cards, arrow nudge on buttons. All motion is disabled under `prefers-reduced-motion`.

## Photography
Unsplash License photos vendored in `src/assets/photos`, catalogued with credits in `src/lib/photos.ts` and listed on About → Photography. Rules:
- Photos illustrate places and cause areas. They are never presented as a fundraiser's beneficiaries.
- A fundraiser without an uploaded photo falls back to a **landscape** (never a person).
- No invented stats or testimonials: the homepage stats come from live data, and stories come from real organizer updates. Clearly labelled placeholders show until those exist.
