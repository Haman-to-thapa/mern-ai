# AI Trading Research — Option 1 Mini Prototype

> Turn a natural language trading question into a structured, testable experiment.

## Live Demo

Run locally — see setup below.

---

## What This Does

A researcher types a trading question like:

> *"Does buying NIFTY after a 1% fall work better during high-volatility periods?"*

The system:

1. **Understands** the question using Gemini AI (structured JSON output)
2. **Extracts** key experiment parameters:
   - Instrument, Timeframe, Entry Condition, Exit Condition, Holding Period, Filters, Objective
3. **Identifies missing information** — without inventing assumptions
4. **Presents** the structured experiment in a clean, readable interface

---

## Design Decisions

### Why not assume missing values?

A core principle of the system is **no silent assumptions**. If the user hasn't specified an exit condition, the system shows `Not specified` and lists it under *Missing Information* — rather than guessing `"sell after 5 days"`.

This matters because in trading research, an unintentional assumption (e.g., end-of-day exit vs. fixed-time exit) can completely change backtest results. The system surfaces ambiguity explicitly.

### Why structured output?

Gemini's `responseSchema` config forces the API to return a validated JSON object matching the `Experiment` schema. This means:
- No parsing errors from free-form text
- Consistent field names for future DB storage or backtesting pipeline integration
- Reliable `null` values for unspecified fields

### Why model fallback?

`gemini-3.8-flash` occasionally returns `503 UNAVAILABLE` during demand spikes. The API route automatically falls back to `gemini-3.6-flash` → `gemini-3.5-flash` to ensure the user always gets a response.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini via `@google/genai` |
| Deployment-ready | Vercel |

---

## Project Structure

```
app/
├── api/
│   └── analyze/
│       └── route.ts         # Gemini API call, model fallback, JSON schema
├── components/
│   └── ExperimentCard.tsx   # Structured experiment UI card
├── types/
│   └── experiment.ts        # Experiment interface + example questions
├── globals.css              # Design system, animations
├── layout.tsx               # Root layout + metadata
└── page.tsx                 # Main page — input, examples, state
```

---

## Setup

**1. Clone & install:**
```bash
git clone <repo-url>
cd ai-trading-research
npm install
```

**2. Create `.env.local`:**
```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at [Google AI Studio](https://aistudio.google.com/).

**3. Run:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Example Questions

- *Does buying NIFTY after a 1% fall work better during high-volatility periods?*
- *Does a golden cross (50/200 MA) on BANKNIFTY daily chart lead to sustained upside?*
- *Is NIFTY more likely to recover within 3 days after a 2% single-day drop?*

---

## AI Usage

This project uses **Google Gemini** for:
- Natural language understanding of trading research questions
- Structured JSON extraction via `responseSchema` (no free-form parsing)
- Missing information identification

All AI calls are server-side only. The API key is never exposed to the client.

---

## What's Not Included (By Design)

- **No backtesting engine** — This prototype focuses on structuring the question correctly. A backtesting pipeline can consume the structured `Experiment` JSON as input.
- **No database** — Experiments are not persisted. Adding PostgreSQL + Prisma would be the next step for a full product.
- **No financial advice** — The system structures research questions only. It makes no claims about strategy performance.
