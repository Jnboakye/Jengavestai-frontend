# JengaVest — Frontend

A **build-your-own investment portfolio tracker with an AI financial analyst** —
built with Next.js and TypeScript. You sign in, search the full universe of
stocks (and crypto), view a stock's live price and chart, and add how much (in
USD) you invested. Your positions, allocation, and daily performance are
computed live and persist in your browser — and an AI analyst discusses your
actual holdings.

> **Note:** Auth is intentionally a demo (sign-up errors — use **Continue as
> Jeffrey**). Live market data, news, and the AI analyst come from the JengaVest
> backend (FastAPI + Finnhub + Twelve Data + Claude). If the backend isn't
> running, the app falls back to a bundled catalogue, synthetic charts, and a
> local analyst so the UI still works.

## How it works

1. **Sign in** — "Sign up with email" shows a demo error; **Continue as Jeffrey** enters the app.
2. **Empty dashboard** — a new user starts with no holdings and a prompt to add some.
3. **Markets** — search any listed stock or crypto by ticker/name, select one to see its
   **live price**, day change, sector, and a price chart with **1D / 1W / 1M / 1Y / 5Y** timeframes.
4. **Add a holding** — enter how much you bought in USD; the app records the cost basis
   and derived share count. Works for any stock or coin, not just a preset list.
5. **Live totals** — the dashboard, sidebar, and portfolio page show total value, invested,
   day gain, and allocation by sector, all computed from live prices for your holdings.
6. **AI Analyst** — a streaming Claude-powered analyst that answers using *only* your
   current holdings, with live data, web search, and source citations.
7. **Market news** — real, portfolio-aware headlines for the stocks you hold.
8. **Persistence** — holdings and session are saved in `localStorage`, so they survive a refresh.

## Features

- **Login gate** (email demo error / Continue as Jeffrey) with a finance-themed split screen.
- **Full-universe search** — any listed stock or ETF via the backend, plus crypto.
- **Live quotes + timeframe charts** (1D/1W/1M/1Y/5Y) on a stock detail view.
- **Add-to-portfolio modal** with a USD amount and estimated shares; any ticker works.
- **Data-driven dashboard** — value, day gain, invested, holdings count, sector allocation,
  live holdings table, and clickable real news.
- **Portfolio page** — per-position price, shares, cost basis, value, day change, remove.
- **Streaming AI Analyst** — real Claude responses (SSE), constrained to your holdings, with citations.
- **Crypto support** — BTC, ETH, SOL, XRP, DOGE, ADA alongside equities.
- **Responsive** — desktop sidebar; mobile bottom nav with a "More" menu (news, documents,
  history, settings, log out).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- [Recharts](https://recharts.org/) · [Tabler Icons](https://tabler.io/icons)
- React Context + `localStorage` for state; `fetch` + SSE streaming to the backend

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other scripts: `npm run build`,
`npm run start`, `npm run lint`.

To connect the live backend, set its URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Without it (or if the backend is down), the app runs on bundled fallback data.

## Project structure

```
app/
  layout.tsx          # root layout + metadata
  icon.svg            # favicon (JengaVest mark)
  page.tsx            # auth gate + PortfolioProvider + view router
  globals.css
components/
  LoginScreen.tsx     # split-screen sign-up (demo error) / Continue as Jeffrey
  Sidebar.tsx         # desktop nav + live total + logout
  BottomNav.tsx       # mobile nav + "More" sheet (settings, logout, etc.)
  Dashboard.tsx       # overview: empty state, live metrics, allocation, holdings, real news
  MarketsPage.tsx     # full search, live quote, timeframe chart, add
  AddHoldingModal.tsx # USD amount → position (any ticker)
  PortfolioPage.tsx   # holdings table + remove
  ChatPanel.tsx       # streaming AI analyst (holdings-only), with mock fallback
  MarketNewsPage.tsx  # real portfolio-aware news (Finnhub)
  UploadDocument.tsx  # PDF upload UI (front-end demo — see note below)
  HistoryPage.tsx / SettingsPage.tsx
lib/
  stocks.ts           # market-data client → backend (quotes, history, search, news) + fallbacks
  portfolio.tsx       # localStorage-backed portfolio context + live totals
  api.ts              # chat client: streamChat (SSE) + non-streaming + mock fallback
types/
  index.ts            # shared TypeScript types
```

## Backend & live data

The app talks to the JengaVest backend (FastAPI, in `../backend`) via
`NEXT_PUBLIC_API_URL`. Endpoints it uses:

- `GET /stocks` — tradable catalogue
- `GET /stocks/quotes?symbols=…` — batch live quotes (Markets list)
- `GET /stocks/search?q=…` — full symbol-universe search
- `GET /stocks/{ticker}/quote` — live quote (Finnhub; crypto via Twelve Data)
- `GET /stocks/{ticker}/history?range=1D|1W|1M|1Y|5Y` — price history (Twelve Data)
- `GET /news?symbols=…` — portfolio-aware market news (Finnhub)
- `POST /chat` and `POST /chat/stream` — Claude analyst (frontend sends holdings so it
  discusses only your portfolio); `/chat/stream` streams tokens via SSE

Run the backend locally (see `../backend/README.md` for full detail):

```bash
cd ../backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# set ANTHROPIC_API_KEY, FINNHUB_API_KEY, TWELVE_DATA_API_KEY in .env
uvicorn main:app --reload --port 8000
```

Every data call in `lib/stocks.ts` and the chat in `lib/api.ts` falls back to a bundled
catalogue / synthetic chart / local analyst if the backend is unreachable, so the UI
never breaks.

## Notes & limitations

- **Auth / sessions:** demo only. There's no real login or server-side session — the
  "user" and portfolio live in `localStorage`, per browser. Add auth for multi-user.
- **Documents page:** the UI is a front-end demo (files stay in the browser). The backend
  *does* implement a real PDF → RAG pipeline; it's just not wired to this page yet.
- **Fallbacks:** when the backend is asleep/offline, prices come from a bundled snapshot,
  charts from a synthetic series, and the analyst from a local portfolio-aware mock.