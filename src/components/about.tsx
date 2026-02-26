export function About() {
  return (
    <section id="about" className="border-y border-border bg-surface/30 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-2 font-mono text-sm text-accent-light">ABOUT</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            One person. Full-team output.
          </h2>
          <div className="mt-6 space-y-4 text-muted">
            <p>
              I&apos;m a software engineer who saw the shift early. AI didn&apos;t just
              change what I build — it changed how fast I can build it. What
              used to take a team of five now takes one person with the right
              tools and the right approach.
            </p>
            <p>
              I work with businesses that want to move fast and ship real AI
              features — not proof-of-concepts that sit in a slide deck. My
              clients get working software, deployed and delivering value.
            </p>
            <p>
              No agency overhead. No account managers. You talk directly to the
              person building your product. That&apos;s how things get done.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background/50 p-6">
            <h3 className="mb-4 font-mono text-sm text-accent-light">TECH I WORK WITH</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "OpenAI",
                "Anthropic",
                "LangChain",
                "PostgreSQL",
                "Redis",
                "AWS",
                "Vercel",
                "Docker",
                "REST",
                "GraphQL",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-6">
            <h3 className="mb-4 font-mono text-sm text-accent-light">HOW I&apos;M DIFFERENT</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="mt-0.5 text-accent-light">&#10005;</span>
                <span>No agency. No middlemen. Direct access to the builder.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-accent-light">&#10005;</span>
                <span>AI-native workflow. I deliver 5-10x faster than traditional development.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-accent-light">&#10005;</span>
                <span>You pay for results, not headcount.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
