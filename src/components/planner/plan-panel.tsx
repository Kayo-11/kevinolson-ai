"use client";

import { ProgressBar } from "./progress-bar";
import { CompletenessMeter } from "./completeness-meter";
import { FeatureCard } from "./feature-card";

export type ProjectBrief = {
  summary: string | null;
  goals: string[];
  features: string[];
  target_audience: string | null;
  tech_preferences: string | null;
  timeline: string | null;
  budget_signals: string | null;
  industry: string | null;
  status: string;
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/30 px-3.5 py-2.5">
      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

export function PlanPanel({
  brief,
  onShare,
  shared,
}: {
  brief: ProjectBrief | null;
  onShare: () => void;
  shared: boolean;
}) {
  const hasContent =
    brief &&
    (brief.summary ||
      brief.goals.length > 0 ||
      brief.features.length > 0 ||
      brief.target_audience ||
      brief.industry);

  if (!brief || !hasContent) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-muted">
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="mb-1 text-sm font-medium text-foreground">
          Your plan will appear here
        </p>
        <p className="max-w-[240px] text-xs text-muted">
          Start describing what you want to build — I'll extract goals,
          features, and a project plan as we go.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <ProgressBar status={brief.status} />

        <CompletenessMeter brief={brief} />

        {brief.summary && (
          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Summary
            </h4>
            <p className="text-sm leading-relaxed text-foreground/90">
              {brief.summary}
            </p>
          </div>
        )}

        {brief.goals.length > 0 && (
          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Goals
            </h4>
            <div className="space-y-2">
              {brief.goals.map((g, i) => (
                <FeatureCard key={`goal-${i}`} text={g} variant="goal" index={i} />
              ))}
            </div>
          </div>
        )}

        {brief.features.length > 0 && (
          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Features
            </h4>
            <div className="space-y-2">
              {brief.features.map((f, i) => (
                <FeatureCard key={`feat-${i}`} text={f} variant="feature" index={i} />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {brief.target_audience && (
            <InfoField label="Audience" value={brief.target_audience} />
          )}
          {brief.industry && (
            <InfoField label="Industry" value={brief.industry} />
          )}
          {brief.timeline && (
            <InfoField label="Timeline" value={brief.timeline} />
          )}
          {brief.tech_preferences && (
            <InfoField label="Tech" value={brief.tech_preferences} />
          )}
          {brief.budget_signals && (
            <InfoField label="Budget" value={brief.budget_signals} />
          )}
        </div>
      </div>

      <div className="border-t border-border p-4">
        {shared ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-center text-sm text-green-400">
            Plan shared — Kevin will be in touch
          </div>
        ) : (
          <button
            type="button"
            onClick={onShare}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
          >
            Share This Plan with Kevin
          </button>
        )}
      </div>
    </div>
  );
}
