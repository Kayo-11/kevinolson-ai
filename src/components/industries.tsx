const industries = [
  {
    name: "Healthcare & Biotech",
    description:
      "Patient data processing, clinical workflow automation, compliance-aware AI integrations, and intelligent reporting systems.",
    examples: ["Medical document extraction", "Patient intake automation", "Clinical decision support"],
  },
  {
    name: "Finance & Fintech",
    description:
      "Risk analysis automation, document processing for compliance, intelligent reporting, and AI-powered customer experiences.",
    examples: ["Automated risk assessment", "KYC/AML document processing", "Financial report generation"],
  },
  {
    name: "Small & Medium Business",
    description:
      "Workflow automation that actually works. Customer support, content generation, data processing — the stuff eating your team's time.",
    examples: ["AI customer support agents", "Lead qualification automation", "Content generation pipelines"],
  },
];

export function Industries() {
  return (
    <section id="industries" className="border-y border-border bg-surface/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-2 font-mono text-sm text-accent-light">INDUSTRIES</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for your world
          </h2>
          <p className="mt-4 text-lg text-muted">
            AI isn&apos;t one-size-fits-all. I build solutions that understand the
            specific challenges, regulations, and workflows of your industry.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {industries.map((industry) => (
            <div key={industry.name} className="space-y-4">
              <h3 className="text-xl font-semibold">{industry.name}</h3>
              <p className="text-muted">{industry.description}</p>
              <div className="space-y-2">
                {industry.examples.map((example) => (
                  <div
                    key={example}
                    className="rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
