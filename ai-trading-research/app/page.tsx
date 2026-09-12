"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");

  const handleAnalyze = () => {
    console.log("Question:", question);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <div className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            AI Trading Research
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Turn a market question into a structured experiment.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Ask a trading research question in natural language. The system
            will identify the important details and help turn it into a clear
            experiment.
          </p>
        </header>

        {/* Question Card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
          <label
            htmlFor="question"
            className="mb-3 block text-sm font-medium text-slate-200"
          >
            What do you want to investigate?
          </label>

          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Does buying NIFTY after a 1% fall work better during high-volatility periods?"
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
          />

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Describe your idea naturally. Missing details can be clarified
              later.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={!question.trim()}
              className="rounded-xl bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyze Question
            </button>
          </div>
        </section>

        {/* Example Questions */}
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium text-slate-400">
            Try an example
          </h2>

          <button
            onClick={() =>
              setQuestion(
                "Does buying NIFTY after a 1% fall work better during high-volatility periods?"
              )
            }
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-slate-600"
          >
            Does buying NIFTY after a 1% fall work better during
            high-volatility periods?
          </button>
        </section>
      </div>
    </main>
  );
}