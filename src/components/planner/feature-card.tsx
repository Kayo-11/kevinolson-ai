"use client";

import { useEffect, useRef, useState } from "react";

export function FeatureCard({
  text,
  variant = "feature",
  index = 0,
}: {
  text: string;
  variant?: "goal" | "feature";
  index?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const accentColor =
    variant === "goal" ? "border-accent/40 hover:border-accent" : "border-green-500/30 hover:border-green-500/60";
  const iconColor = variant === "goal" ? "text-accent-light" : "text-green-400";
  const icon = variant === "goal" ? "\u2192" : "+";

  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-surface/50 px-3.5 py-2.5 transition-all duration-300 hover:bg-surface ${accentColor} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 shrink-0 text-sm font-medium ${iconColor}`}>
          {icon}
        </span>
        <span className="text-sm leading-relaxed">{text}</span>
      </div>
    </div>
  );
}
