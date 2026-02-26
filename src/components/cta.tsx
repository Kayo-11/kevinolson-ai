export function CTA() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s build something
          <span className="bg-gradient-to-r from-accent-light to-purple-400 bg-clip-text text-transparent">
            {" "}that matters.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Have a project in mind? Not sure where AI fits in your business?
          Either way, let&apos;s talk. No commitment, no pitch deck — just a
          conversation about what&apos;s possible.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:kevin@kevinolson.ai"
            className="rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
          >
            kevin@kevinolson.ai
          </a>
          <a
            href="https://linkedin.com/in/kevinolson"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-all hover:border-muted hover:bg-surface"
          >
            Connect on LinkedIn
          </a>
        </div>

        <p className="mt-6 text-sm text-muted">
          Typically respond within 24 hours.
        </p>
      </div>
    </section>
  );
}
