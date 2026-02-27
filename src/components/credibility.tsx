const services = [
  "AI-powered development",
  "Workflow automation",
  "Custom LLM integrations",
  "Technical consulting",
];

const tech = [
  "TypeScript", "React", "Next.js", "Node.js", "Python",
  "OpenAI", "Anthropic", "PostgreSQL", "AWS", "Vercel",
];

export function Credibility() {
  return (
    <section id="about" className="border-t border-border px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent-light">
            What I Do
          </h3>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-accent-light">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <span
                key={t}
                className="rounded border border-border px-2 py-0.5 text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent-light">
            About
          </h3>
          <div className="space-y-3 text-sm text-muted">
            <p>
              Software engineer turned AI integration specialist. I help
              businesses move faster by building AI-powered features and
              automating workflows.
            </p>
            <p>
              No agency overhead &mdash; you work directly with the person
              building your product. AI-native workflow means I deliver at the
              speed of a full team.
            </p>
          </div>
        </div>

        <div id="contact">
          <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent-light">
            Let&apos;s Connect
          </h3>
          <div className="space-y-3">
            <a
              href="mailto:kevin@kevinolson.ai"
              className="flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              kevin@kevinolson.ai
            </a>
            <a
              href="https://linkedin.com/in/kevinolson"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Kayo-11"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C17.14 18.16 20 14.42 20 10A10 10 0 0010 0z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Typically respond within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
