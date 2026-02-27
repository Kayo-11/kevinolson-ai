"use client";

import { useMemo } from "react";

type Brief = {
  summary: string | null;
  goals: string[];
  features: string[];
  target_audience: string | null;
  tech_preferences: string | null;
  timeline: string | null;
  budget_signals: string | null;
  industry: string | null;
};

const FIELDS: { key: keyof Brief; weight: number; prompt: string }[] = [
  { key: "summary", weight: 15, prompt: "Describe your core idea" },
  { key: "goals", weight: 15, prompt: "What are your main goals?" },
  { key: "features", weight: 20, prompt: "What features do you need?" },
  { key: "target_audience", weight: 10, prompt: "Who is this for?" },
  { key: "timeline", weight: 10, prompt: "What's your timeline?" },
  { key: "budget_signals", weight: 10, prompt: "What's your budget range?" },
  { key: "tech_preferences", weight: 10, prompt: "Any tech preferences?" },
  { key: "industry", weight: 10, prompt: "What industry is this in?" },
];

function fieldFilled(brief: Brief, key: keyof Brief): boolean {
  const val = brief[key];
  if (val === null || val === undefined) return false;
  if (Array.isArray(val)) return val.length > 0;
  return typeof val === "string" && val.trim().length > 0;
}

export function CompletenessMeter({ brief }: { brief: Brief }) {
  const { score, nextHint } = useMemo(() => {
    let total = 0;
    let hint: string | null = null;

    for (const field of FIELDS) {
      if (fieldFilled(brief, field.key)) {
        total += field.weight;
      } else if (!hint) {
        hint = field.prompt;
      }
    }

    return { score: total, nextHint: hint };
  }, [brief]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold">{score}%</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted">Plan completeness</p>
        {nextHint && score < 100 && (
          <p className="mt-1 text-xs text-accent-light">
            Next: {nextHint}
          </p>
        )}
        {score === 100 && (
          <p className="mt-1 text-xs text-green-400">
            Your plan is fully fleshed out!
          </p>
        )}
      </div>
    </div>
  );
}
