"use client";

import type { Experiment } from "@/app/types/experiment";

interface ExperimentCardProps {
  experiment: Experiment;
}

const FIELD_META: {
  key: keyof Omit<Experiment, "filters" | "missingInformation" | "question">;
  label: string;
  icon: string;
}[] = [
  { key: "instrument", label: "Instrument", icon: "📈" },
  { key: "timeframe", label: "Timeframe", icon: "🕐" },
  { key: "entryCondition", label: "Entry Condition", icon: "🟢" },
  { key: "exitCondition", label: "Exit Condition", icon: "🔴" },
  { key: "holdingPeriod", label: "Holding Period", icon: "⏱" },
  { key: "objective", label: "Objective", icon: "🎯" },
];

function Field({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null;
}) {
  const isSpecified = value !== null && value !== "";
  return (
    <div
      className={`group rounded-2xl border p-4 transition-all duration-200 ${
        isSpecified
          ? "border-slate-700/60 bg-slate-900/60 hover:border-slate-600"
          : "border-slate-800/40 bg-slate-900/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </p>
      </div>
      <p
        className={`text-sm leading-relaxed ${
          isSpecified ? "text-slate-200" : "italic text-slate-600"
        }`}
      >
        {isSpecified ? value : "Not specified"}
      </p>
    </div>
  );
}

function StatusBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 text-xs font-medium text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
        Complete
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 px-3 py-1 text-xs font-medium text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
      {count} detail{count > 1 ? "s" : ""} missing
    </span>
  );
}

export default function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <section className="animate-fade-in-up mt-10 rounded-3xl border border-slate-700/50 bg-slate-900/50 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800/60 px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
            Structured Experiment
          </p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Experiment Definition
          </h2>
        </div>
        <StatusBadge count={experiment.missingInformation.length} />
      </div>

      <div className="p-6 space-y-6">
        {/* Parameter Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {FIELD_META.map(({ key, label, icon }) => (
            <Field
              key={key}
              icon={icon}
              label={label}
              value={experiment[key] as string | null}
            />
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔍</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Filters / Variables
            </p>
          </div>
          {experiment.filters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {experiment.filters.map((filter, index) => (
                <span
                  key={`${filter}-${index}`}
                  className="inline-flex items-center rounded-full border border-indigo-800/50 bg-indigo-950/40 px-3.5 py-1.5 text-sm font-medium text-indigo-300"
                >
                  {filter}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-slate-600">No filters specified</p>
          )}
        </div>

        {/* Research Question */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">💬</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Research Question
            </p>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            "{experiment.question}"
          </p>
        </div>

        {/* Missing Information */}
        {experiment.missingInformation.length > 0 && (
          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚠️</span>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Missing Information
              </p>
            </div>
            <div className="space-y-2.5">
              {experiment.missingInformation.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border border-amber-800/60 bg-amber-950/60 flex items-center justify-center">
                    <span className="text-xs text-amber-400 font-bold">!</span>
                  </div>
                  <p className="text-sm text-amber-200/90 leading-snug">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-900/30 bg-amber-950/20 px-3 py-2.5">
              <span className="text-xs text-amber-500/80 leading-relaxed">
                These parameters should be clarified before the experiment can be meaningfully tested. The system does not assume values for missing details.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
