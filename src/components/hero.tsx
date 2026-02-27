export function Hero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 pt-20 pb-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Free to use &middot; No sign-up needed
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          What do you want
          <br />
          <span className="bg-gradient-to-r from-accent-light to-purple-400 bg-clip-text text-transparent">
            to build?
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Describe your idea below. The AI will help shape it into a concrete
          plan with goals, features, and a roadmap &mdash; then we can build it together.
        </p>

        <a
          href="#planner"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-light transition hover:text-foreground"
        >
          Start planning
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 animate-bounce">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </section>
  );
}
