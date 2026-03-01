import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";
import Link from "next/link";
import { DashboardHeader } from "./dashboard-header";

export const dynamic = "force-dynamic";

type SessionRow = {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};

type MessageRow = {
  role: string;
  content: string;
  created_at: string;
};

type BriefRow = {
  share_id: string;
  summary: string | null;
  status: string;
  created_at: string;
};

export default async function DashboardPage() {
  const ok = await isDashboardAuthenticated();
  if (!ok) redirect("/dashboard/login");

  const supabase = getSupabase();
  if (!supabase) {
    return (
      <div className="p-6 text-red-400">
        Database not configured.
      </div>
    );
  }

  const [
    { count: sessionsCount },
    { count: messagesCount },
    { count: briefsCount },
    { data: recentSessions },
    { data: recentMessages },
    { data: recentBriefs },
  ] = await Promise.all([
    supabase.from("sessions").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase.from("project_briefs").select("id", { count: "exact", head: true }),
    supabase
      .from("sessions")
      .select("id, email, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20),
    supabase
      .from("messages")
      .select("role, content, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase
      .from("project_briefs")
      .select("share_id, summary, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const leads = (recentSessions as SessionRow[] | null)?.filter(
    (s) => s.email,
  ) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-4xl space-y-8 p-4 pb-12">
        {/* Stats */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Overview
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
              <p className="text-2xl font-bold text-foreground">
                {sessionsCount ?? 0}
              </p>
              <p className="text-xs text-muted">Sessions</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
              <p className="text-2xl font-bold text-foreground">
                {messagesCount ?? 0}
              </p>
              <p className="text-xs text-muted">Messages</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
              <p className="text-2xl font-bold text-foreground">
                {briefsCount ?? 0}
              </p>
              <p className="text-xs text-muted">Briefs</p>
            </div>
          </div>
        </section>

        {/* Leads (sessions with email) */}
        {leads.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Leads (shared with Kevin)
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-4 py-2.5 font-medium text-muted">Email</th>
                    <th className="px-4 py-2.5 font-medium text-muted">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((s) => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="px-4 py-2.5 text-foreground">{s.email}</td>
                      <td className="px-4 py-2.5 text-muted">
                        {new Date(s.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Recent messages */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Recent messages
          </h2>
          <div className="space-y-2">
            {(recentMessages as MessageRow[] | null)?.length ? (
              (recentMessages as MessageRow[]).map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-surface/30 px-4 py-2.5"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase text-muted">
                      {m.role}
                    </span>
                    <span className="text-[10px] text-muted">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">
                    {m.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No messages yet.</p>
            )}
          </div>
        </section>

        {/* Recent briefs */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Recent briefs
          </h2>
          <div className="space-y-2">
            {(recentBriefs as BriefRow[] | null)?.length ? (
              (recentBriefs as BriefRow[]).map((b) => (
                <div
                  key={b.share_id}
                  className="rounded-lg border border-border bg-surface/30 px-4 py-2.5"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-accent-light">
                      {b.status}
                    </span>
                    <span className="text-[10px] text-muted">
                      {new Date(b.created_at).toLocaleString()}
                    </span>
                    <Link
                      href={`/brief/${b.share_id}`}
                      className="text-[10px] text-accent-light hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 line-clamp-2">
                    {b.summary || "No summary"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No briefs yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
