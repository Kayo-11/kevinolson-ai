export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Available for new projects
        </div>

        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          I build AI into
          <br />
          <span className="bg-gradient-to-r from-accent-light to-purple-400 bg-clip-text text-transparent">
            products that ship.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
          Software engineer turned AI integration specialist. I help businesses
          move faster by building AI-powered features, automating workflows, and
          delivering at the speed of a full team.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
          >
            Start a Project
          </a>
          <a
            href="#services"
            className="rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:border-muted hover:bg-surface"
          >
            See What I Do
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
          {[
            { value: "5-10x", label: "Faster delivery with AI" },
            { value: "Full-stack", label: "End to end" },
            { value: "AI-native", label: "Built for the new era" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs text-muted sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
