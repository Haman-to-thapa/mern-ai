export interface Experiment {
  instrument: string | null;
  timeframe: string | null;
  entryCondition: string | null;
  exitCondition: string | null;
  holdingPeriod: string | null;
  filters: string[];
  objective: string | null;
  missingInformation: string[];
  question: string;
}

export const EXAMPLE_QUESTIONS = [
  "Does buying NIFTY after a 1% fall work better during high-volatility periods?",
  "Does a golden cross (50/200 MA) on BANKNIFTY daily chart lead to sustained upside?",
  "Is NIFTY more likely to recover within 3 days after a 2% single-day drop?",
];