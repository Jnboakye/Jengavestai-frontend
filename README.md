# JengaVest

A **build-your-own investment portfolio tracker** — a front-end portfolio project built
with Next.js and TypeScript. You sign in, search a catalogue of stocks, view a stock's
details, and add how much (in USD) you invested. Your positions, allocation, and daily
performance are calculated live and persist in your browser.

> **Note:** Auth is intentionally a demo (sign-up errors — use **Continue as Jeffrey**).
> Live market data and the AI analyst come from the JengaVest backend (FastAPI +
> yfinance + Claude). If the backend isn't running, the app falls back to a bundled
> catalogue and a local analyst so everything still works offline.

## How it works

1. **Sign in** — "Sign up with email" shows a demo error; **Continue as Jeffrey** enters the app.
2. **Empty dashboard** — a new user starts with no holdings and a prompt to add some.
3. **Markets** — search ~30 stocks by ticker or name, select one to view its live price,
   day change, sector, and a price chart with **1D / 1W / 1M / 1Y / 5Y** timeframes.
4. **Add a holding** — enter how much you bought in USD; the app records the cost basis
   and derived share count.
5. **Live totals** — the dashboard and sidebar show your total value, total invested,
   day gain, and allocation by sector, all computed from your holdings.
6. **Persistence** — holdings are saved in `localStorage`, so they survive a refresh.

## Features

- Email/guest **login gate** with a friendly demo error path.
- **Stock search + detail view** with sparkline (Recharts).
- **Add-to-portfolio modal** with a USD amount and estimated shares.
- **Data-driven dashboard**: value, day gain, invested, holdings count, sector allocation, holdings table.
- **Portfolio page** with per-position value, shares, cost basis, and remove.
- **AI Analyst** (mock) that answers questions using your *actual* holdings.
- **Responsive** — desktop sidebar collapses to a mobile bottom nav.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- [Recharts](https://recharts.org/) · [Tabler Icons](https://tabler.io/icons)
- React Context + `localStorage` for state

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other scripts: `npm run build`,
`npm run start`, `npm run lint`.

## Project structure

```
app/
  layout.tsx          # root layout + metadata
  page.tsx            # auth gate + PortfolioProvider + view router
  globals.css
components/
  LoginScreen.tsx     # sign-up (demo error) / Continue as Jeffrey
  Sidebar.tsx         # desktop nav + live total + logout
  BottomNav.tsx       # mobile nav
  Dashboard.tsx       # overview (empty state + live metrics)
  MarketsPage.tsx     # search, view, add stocks
  AddHoldingModal.tsx # USD amount → position
  PortfolioPage.tsx   # holdings table + remove
  ChatPanel.tsx       # AI analyst (portfolio-aware mock)
  MarketNewsPage.tsx  # news grid (demo data)
  UploadDocument.tsx  # PDF upload UI (demo)
  HistoryPage.tsx / SettingsPage.tsx
lib/
  stocks.ts           # stock "backend" seam (swap to real API here)
  portfolio.tsx       # localStorage-backed portfolio context + totals
  api.ts              # mock chat layer
types/
  index.ts            # shared TypeScript types
```

## Backend & live data

The app talks to the JengaVest backend (FastAPI) via `NEXT_PUBLIC_API_URL`:

- `GET /stocks` — tradable catalogue
- `GET /stocks/{ticker}/quote` — live quote (yfinance)
- `GET /stocks/{ticker}/history?range=1D|1W|1M|1Y|5Y` — price history (yfinance)
- `POST /chat` — Claude analyst; the frontend sends your holdings so it discusses only your portfolio

Run it locally:

```bash
# in the backend folder
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# set ANTHROPIC_API_KEY (chat) in .env
uvicorn main:app --reload --port 8000
```

Then point the frontend at it in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Every data call in `lib/stocks.ts` and the chat in `lib/api.ts` falls back to a bundled
catalogue / local analyst if the backend is unreachable, so the UI never breaks.
