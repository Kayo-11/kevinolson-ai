"use client";

import { useState } from "react";
import Link from "next/link";

type Brief = {
  summary: string | null;
  goals: string[];
  features: string[];
  target_audience: string | null;
  tech_preferences: string | null;
  timeline: string | null;
  budget_signals: string | null;
  industry: string | null;
  status: string;
  created_at: string;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-light">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/40 px-4 py-3">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function CopyButton({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/brief/${shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent-light print:hidden"
    >
      {copied ? (
        <>
          <CheckIcon />
          Copied!
        </>
      ) : (
        <>
          <LinkIcon />
          Copy Link
        </>
      )}
    </button>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
      <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-green-400">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function BriefDocument({
  brief,
  shareId,
}: {
  brief: Brief;
  shareId: string;
}) {
  const date = new Date(brief.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
              Project Brief
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {brief.summary || "Untitled Project"}
            </h1>
            <p className="mt-2 text-sm text-muted">{date}</p>
          </div>
          <CopyButton shareId={shareId} />
        </div>

        <div className="space-y-8">
          {/* Goals */}
          {brief.goals.length > 0 && (
            <Section title="Goals">
              <ul className="space-y-2.5">
                {brief.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent-light">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Features */}
          {brief.features.length > 0 && (
            <Section title="Planned Features">
              <div className="grid gap-2 sm:grid-cols-2">
                {brief.features.map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-surface/40 px-4 py-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 text-sm font-medium text-green-400">
                        +
                      </span>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Details grid */}
          {(brief.target_audience ||
            brief.industry ||
            brief.timeline ||
            brief.tech_preferences ||
            brief.budget_signals) && (
            <Section title="Details">
              <div className="grid gap-2 sm:grid-cols-2">
                {brief.target_audience && (
                  <InfoCard label="Target Audience" value={brief.target_audience} />
                )}
                {brief.industry && (
                  <InfoCard label="Industry" value={brief.industry} />
                )}
                {brief.timeline && (
                  <InfoCard label="Timeline" value={brief.timeline} />
                )}
                {brief.tech_preferences && (
                  <InfoCard label="Technology" value={brief.tech_preferences} />
                )}
                {brief.budget_signals && (
                  <InfoCard label="Budget" value={brief.budget_signals} />
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-surface/30 px-6 py-6 text-center print:hidden">
          <p className="mb-1 text-sm font-medium">
            Want to bring this project to life?
          </p>
          <p className="mb-4 text-xs text-muted">
            This brief was generated with the AI Project Planner on kevinolson.ai
          </p>
          <Link
            href="/#planner"
            className="inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
          >
            Try the AI Project Planner
          </Link>
        </div>

        {/* Print footer */}
        <div className="mt-8 hidden text-center text-xs text-muted print:block">
          Generated at kevinolson.ai/brief/{shareId}
        </div>
      </div>
    </div>
  );
}
