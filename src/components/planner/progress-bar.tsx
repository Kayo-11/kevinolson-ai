"use client";

const STAGES = [
  { key: "exploring", label: "Exploring" },
  { key: "defining", label: "Defining" },
  { key: "scoped", label: "Scoped" },
  { key: "ready", label: "Ready" },
] as const;

type Stage = (typeof STAGES)[number]["key"];

function stageIndex(status: string): number {
  const idx = STAGES.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export function ProgressBar({ status }: { status: string }) {
  const current = stageIndex(status);

  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage, i) => {
        const isComplete = i < current;
        const isActive = i === current;

        return (
          <div key={stage.key} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <div
                className={`relative h-1.5 w-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? "bg-accent"
                    : isActive
                      ? "bg-accent/60"
                      : "bg-border"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 animate-pulse rounded-full bg-accent/40" />
                )}
              </div>
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                isComplete
                  ? "text-accent-light"
                  : isActive
                    ? "text-foreground"
                    : "text-muted/50"
              }`}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
