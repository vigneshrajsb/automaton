# AUTOMATON — AI Automation Forecast

A cyberpunk-themed dashboard that tracks estimated AI automation timelines for 20 white-collar professions. Updated nightly using the Perplexity Sonar Pro API.

## Live Site

Deployed on Vercel. Estimates are recalculated every night at 12:00 AM Pacific by scanning the latest frontier AI announcements.

## Stack

- **Frontend:** Vanilla HTML/CSS/JS (static site)
- **Nightly Recalculation:** Python script using Perplexity Sonar Pro API
- **CI/CD:** GitHub Actions cron → auto-commit → Vercel auto-deploy
- **Hosting:** Vercel (free tier works fine)

## Setup

### 1. Create a GitHub repo

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/automaton.git
git branch -M main
git push -u origin main
```

### 2. Get your Perplexity API key

1. Go to [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Navigate to the **API Keys** tab
3. Generate a new key
4. Note: Your Perplexity Max subscription gives you API credits — check your usage at the API portal

### 3. Add the API key to GitHub Secrets

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `PERPLEXITY_API_KEY`
4. Value: your API key from step 2

### 4. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New Project** → Import your GitHub repo
3. Framework preset: **Other**
4. Build command: leave empty
5. Output directory: `.`
6. Click **Deploy**

Vercel will auto-deploy on every push to `main`, so when GitHub Actions commits nightly updates, Vercel picks them up automatically.

### 5. Verify the nightly cron

- The GitHub Actions workflow runs at `0 8 * * *` UTC (midnight PST / 1am PDT)
- You can trigger it manually: repo → **Actions** → **AUTOMATON Nightly Recalculation** → **Run workflow**
- Check the Actions tab for run logs and summaries

## How It Works

```
┌─────────────────────────────────────────────────┐
│  GitHub Actions (cron: 0 8 * * * UTC)           │
│                                                  │
│  1. Run recalculate.py                           │
│     ├── Search Perplexity for latest AI news     │
│     │   (3 searches: labs, jobs, regulation)     │
│     ├── Read current estimates from app.js       │
│     ├── Ask Perplexity to analyze news vs data   │
│     │   (structured JSON output)                 │
│     ├── Apply conservative adjustments           │
│     └── Write updated app.js + index.html        │
│                                                  │
│  2. If changes: git commit + push                │
│     If no changes: exit silently                 │
│                                                  │
└──────────────────────┬──────────────────────────┘
                       │ push to main
                       ▼
┌─────────────────────────────────────────────────┐
│  Vercel                                          │
│  Auto-deploys on push → site updated             │
└─────────────────────────────────────────────────┘
```

## Cost

Each nightly run makes ~4 Perplexity API calls (3 searches + 1 analysis with structured output). Using `sonar-pro`:

- Input: ~$3/1M tokens → negligible
- Output: ~$15/1M tokens → ~$0.05/run
- Search: ~$6-14/1K requests → ~$0.03/run
- **Total: ~$0.08/night, roughly $2.40/month**

Your Perplexity Max plan includes API credits, so this should be well within your allocation.

## File Structure

```
automaton/
├── .github/
│   └── workflows/
│       └── recalculate.yml    ← GitHub Actions nightly cron
├── index.html                 ← Main page
├── base.css                   ← Design tokens & resets
├── style.css                  ← Cyberpunk component styles
├── app.js                     ← Job data + interactive logic
├── recalculate.py             ← Nightly recalculation script
├── vercel.json                ← Vercel config
└── README.md                  ← This file
```

## Adjustment Rules

The recalculation script follows strict guardrails:

| Parameter | Max Change Per Night |
|-----------|---------------------|
| `percent` (tasks automatable) | ±5 points |
| `range` (year range) | ±1 year |
| `risk` level | Only if percent crosses threshold |

Risk thresholds:
- **CRITICAL**: percent > 65
- **HIGH**: percent > 55
- **MODERATE**: percent > 35
- **LOW**: percent ≤ 35

On quiet news days, no changes are made and no commit is pushed.

## Sources

Estimates are grounded in research from:
- [McKinsey Global Institute](https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america) — Generative AI and the Future of Work
- [World Economic Forum](https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/) — Future of Jobs Report 2025
- [Goldman Sachs](https://www.forbes.com/sites/jackkelly/2025/04/25/the-jobs-that-will-fall-first-as-ai-takes-over-the-workplace/) — AI Job Displacement Estimates
- [Fortune](https://fortune.com/2026/02/13/when-will-ai-kill-white-collar-office-jobs-18-months-microsoft-mustafa-suleyman/) — Microsoft AI CEO Predictions
- [The Atlantic](https://www.theatlantic.com/magazine/2026/03/ai-economy-labor-market-transformation/685731/) — America Isn't Ready

## Credits

Original version built with [Perplexity Computer](https://www.perplexity.ai/hub/blog/introducing-perplexity-computer).

## License

MIT
