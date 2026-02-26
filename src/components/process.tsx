const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We talk about your business, your pain points, and where AI can make the biggest impact. No jargon, no fluff — just understanding your problem.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "I deliver a clear roadmap: what to build, what to automate, what the ROI looks like, and how fast we can move. You decide what to greenlight.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "I build fast. AI-assisted development means you get working software in days, not months. Iterative delivery — you see progress immediately.",
  },
  {
    number: "04",
    title: "Ship & Scale",
    description:
      "Deploy, measure, improve. I don't disappear after launch. Ongoing support and optimization to make sure the solution keeps delivering value.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <p className="mb-2 font-mono text-sm text-accent-light">PROCESS</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How we work together
          </h2>
          <p className="mt-4 text-lg text-muted">
            No six-month timelines. No bloated teams. A clear process that gets
            you from problem to production fast.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border-border bg-surface/50 p-8 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r"
            >
              <span className="font-mono text-3xl font-bold text-accent-light/30">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
