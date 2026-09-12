"use client";

import { useState } from "react";
import type { Experiment } from "./types/experiment";
import { EXAMPLE_QUESTIONS } from "./types/experiment";
import ExperimentCard from "@/app/components/ExperimentCard";

function LoadingState() {
  return (
    <div className="animate-fade-in-up mt-10 rounded-3xl border border-slate-800/50 bg-slate-900/40 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5">
          <span className="pulse-dot h-2 w-2 rounded-full bg-indigo-500 inline-block" />
          <span className="pulse-dot h-2 w-2 rounded-full bg-indigo-500 inline-block" />
          <span className="pulse-dot h-2 w-2 rounded-full bg-indigo-500 inline-block" />
        </div>
        <p className="text-sm text-slate-400">Analyzing your question with Gemini AI…</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-800/40 p-4 space-y-2">
            <div className="shimmer h-3 w-24 rounded-full" />
            <div className="shimmer h-4 w-40 rounded-full" />
          </div>
        ))}
      </div>
      <div className="mt-3 shimmer h-16 rounded-2xl" />
      <div className="mt-3 shimmer h-12 rounded-2xl" />
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setExperiment(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setExperiment(data.experiment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  return (
    <main className="min-h-screen bg-mesh text-white">
      <div className="mx-auto max-w-3xl px-6 py-20">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <span className="text-sm font-semibold text-slate-300">TradingResearch</span>
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-500">
            Powered by Gemini
          </div>
        </nav>

        {/* Hero */}
        <header className="mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-800/50 bg-indigo-950/40 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 inline-block animate-pulse" />
            <span className="text-xs font-medium text-indigo-300">Option 1 — Mini Prototype</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
            Turn a market question into
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              a structured experiment.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
            Ask a trading research question in natural language. The system extracts key parameters, structures it as a testable experiment, and clearly identifies what information is missing — without making assumptions.
          </p>
        </header>

        {/* Input Card */}
        <section
          id="question-input"
          className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm"
        >
          <label
            htmlFor="question"
            className="mb-3 block text-sm font-semibold text-slate-200"
          >
            What do you want to investigate?
          </label>

          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Does buying NIFTY after a 1% fall work better during high-volatility periods?"
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-700/60 bg-slate-950/80 px-5 py-4 text-sm text-white transition-all duration-200 placeholder:text-slate-600"
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Tip: Describe your idea naturally.{" "}
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-slate-400">
                ⌘↵
              </kbd>{" "}
              to analyze.
            </p>

            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || !question.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all duration-200 hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Question
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3">
              <span className="text-red-400 text-sm mt-0.5">✕</span>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </section>

        {/* Example Questions */}
        {!experiment && !loading && (
          <section id="examples" className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-600">
              Try an example
            </p>
            <div className="flex flex-col gap-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuestion(q)}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-3.5 text-left text-sm text-slate-400 transition-all duration-200 hover:border-indigo-800/60 hover:bg-indigo-950/20 hover:text-slate-200"
                >
                  <span className="mt-0.5 flex-shrink-0 text-indigo-600 group-hover:text-indigo-400 transition-colors">
                    →
                  </span>
                  <span className="leading-snug">{q}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Experiment Card */}
        {experiment && !loading && (
          <>
            <ExperimentCard experiment={experiment} />

            {/* Reset */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setExperiment(null);
                  setQuestion("");
                  document.getElementById("question")?.focus();
                }}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
              >
                ← Ask a different question
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-24 border-t border-slate-800/40 pt-8 text-center">
          <p className="text-xs text-slate-600">
            AI Trading Research · Option 1 Mini Prototype · Powered by Gemini AI
          </p>
          <p className="mt-1 text-xs text-slate-700">
            This tool structures research questions only. It does not provide financial advice.
          </p>
        </footer>
      </div>
    </main>
  );
}