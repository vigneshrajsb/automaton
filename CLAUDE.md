# AUTOMATON

A static website that tracks AI automation risk across white-collar professions. Data is updated nightly via a Python script that queries the Perplexity Sonar Pro API and commits changes back to the repo.

## Architecture

**Pure static site** — no build step, no framework, no package manager.

| File | Role |
|---|---|
| `index.html` | Shell: layout, header, footer, modal structure |
| `app.js` | All data (`JOBS`, `SOURCES`) + all interactive logic |
| `base.css` | Design tokens (CSS variables), resets, typography |
| `style.css` | Component styles (cards, modal, header, animations) |
| `recalculate.py` | Nightly cron script: fetches AI news → updates `app.js` + timestamps in `index.html` |
| `vercel.json` | Static deployment config; all routes rewrite to `index.html` |

## Data Model

All job data lives as a JS array literal in `app.js` (the `JOBS` const). Each entry:

```js
{
  title: string,      // Job name
  percent: number,    // % of tasks automatable (1–100)
  range: string,      // "YYYY–YYYY" estimated full-automation window
  risk: string,       // "CRITICAL" | "HIGH" | "MODERATE" | "LOW"
  driver: string,     // One-line automation driver
  detail: string      // Full paragraph shown in modal
}
```

Risk thresholds used by `recalculate.py` (and should be kept consistent in any manual edits):
- `> 65` → CRITICAL
- `> 55` → HIGH
- `> 35` → MODERATE
- `<= 35` → LOW

## Nightly Recalculation

`recalculate.py` is the automated update pipeline:

1. Calls Perplexity Sonar Pro with 3 search queries (AI news, job displacement news, regulation)
2. Reads the current `JOBS` array from `app.js` using a bracket-depth parser
3. Sends combined news + current data to Perplexity for analysis
4. If changes are warranted, rewrites the `JOBS` array in `app.js` in place
5. Updates "Last updated" / "Next scan" timestamps in `index.html`
6. Sets GitHub Actions outputs (`changes_made`, `summary`, `change_log`)

**Required env var:** `PERPLEXITY_API_KEY`

The script is conservative by design — adjusts percent by ≤5 points and year ranges by ≤1 year per run.

## Deployment

Deployed on Vercel as a static site. No CI build step — Vercel serves the directory directly (`outputDirectory: "."`).

## Conventions

- No npm, no bundler, no transpilation — vanilla HTML/CSS/JS only
- Lucide icons loaded from CDN (`unpkg.com/lucide`)
- Google Fonts loaded via `<link>` in `index.html`
- Cards are rendered entirely by `renderCards()` in `app.js` via `innerHTML`
- Modal uses native `<dialog>` element with `showModal()` / `close()`
- Scroll animations use CSS `animation-timeline: scroll()` with IntersectionObserver fallback
- Progress bar animation triggered by setting `data-animated="true"` after double `requestAnimationFrame`
- Search debounced at 200ms; sort state held in module-level `currentSort` variable
