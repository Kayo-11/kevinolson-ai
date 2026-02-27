"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Message = { role: "assistant" | "user"; text: string };

type ProjectBrief = {
  summary: string | null;
  goals: string[];
  features: string[];
  target_audience: string | null;
  tech_preferences: string | null;
  timeline: string | null;
  budget_signals: string | null;
  industry: string | null;
  status: string;
};

type SessionPayload = {
  session: { id: string };
  messages: Array<{ role: string; content: string }>;
  brief: ProjectBrief | null;
};

const VISITOR_ID_KEY = "ko_visitor_id";

const WELCOME: Message = {
  role: "assistant",
  text: "I help turn rough ideas into concrete project plans. Tell me what you're thinking about building — I'll help shape it into something actionable.",
};

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

/* ---------- Plan sub-components ---------- */

function BriefField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </h4>
      {children}
    </section>
  );
}

const STATUS_COLORS: Record<string, string> = {
  exploring: "bg-yellow-400",
  defining: "bg-blue-400",
  scoped: "bg-green-400",
  shared: "bg-accent",
};

function PlanView({
  brief,
  onShare,
}: {
  brief: ProjectBrief;
  onShare: () => void;
}) {
  const hasContent =
    brief.summary ||
    brief.goals.length > 0 ||
    brief.features.length > 0 ||
    brief.target_audience ||
    brief.industry;

  if (!hasContent) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${STATUS_COLORS[brief.status] || "bg-muted"}`}
        />
        <span className="text-xs capitalize text-muted">{brief.status}</span>
      </div>

      {brief.summary && (
        <BriefField label="Summary">
          <p className="text-sm leading-relaxed">{brief.summary}</p>
        </BriefField>
      )}

      {brief.goals.length > 0 && (
        <BriefField label="Goals">
          <ul className="space-y-1">
            {brief.goals.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="shrink-0 text-accent">&bull;</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </BriefField>
      )}

      {brief.features.length > 0 && (
        <BriefField label="Features">
          <ul className="space-y-1">
            {brief.features.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="shrink-0 text-green-400">+</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </BriefField>
      )}

      {brief.target_audience && (
        <BriefField label="Target Audience">
          <p className="text-sm">{brief.target_audience}</p>
        </BriefField>
      )}

      {brief.industry && (
        <BriefField label="Industry">
          <p className="text-sm">{brief.industry}</p>
        </BriefField>
      )}

      {brief.timeline && (
        <BriefField label="Timeline">
          <p className="text-sm">{brief.timeline}</p>
        </BriefField>
      )}

      {brief.tech_preferences && (
        <BriefField label="Tech Preferences">
          <p className="text-sm">{brief.tech_preferences}</p>
        </BriefField>
      )}

      {brief.budget_signals && (
        <BriefField label="Budget">
          <p className="text-sm">{brief.budget_signals}</p>
        </BriefField>
      )}

      {brief.status !== "shared" && (
        <button
          type="button"
          onClick={onShare}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light"
        >
          Share This Plan with Kevin
        </button>
      )}

      {brief.status === "shared" && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-center text-sm text-green-400">
          Plan shared — Kevin will be in touch
        </div>
      )}
    </div>
  );
}

/* ---------- Main chatbot ---------- */

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "plan">("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [shareStatus, setShareStatus] = useState<
    "idle" | "sending" | "sent"
  >("idle");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  const hasPlan = useMemo(
    () =>
      brief !== null &&
      (brief.summary !== null ||
        brief.goals.length > 0 ||
        brief.features.length > 0),
    [brief],
  );

  /* -- Session init on first open -- */
  useEffect(() => {
    if (!isOpen || initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      setIsRestoring(true);
      try {
        const visitorId = getOrCreateVisitorId();
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ visitor_id: visitorId }),
        });
        if (!res.ok) return;

        const data: SessionPayload = await res.json();
        setSessionId(data.session.id);

        if (data.messages.length > 0) {
          setMessages([
            WELCOME,
            ...data.messages.map((m) => ({
              role: m.role as "user" | "assistant",
              text: m.content,
            })),
          ]);
        }

        if (data.brief) setBrief(data.brief);
      } catch {
        // Persistence unavailable — chat works stateless
      } finally {
        setIsRestoring(false);
      }
    })();
  }, [isOpen]);

  /* -- Auto-scroll chat -- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* -- Refresh brief after AI responds -- */
  const refreshBrief = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/brief?session_id=${sessionId}`);
      if (res.ok) {
        const data = (await res.json()) as { brief: ProjectBrief | null };
        if (data.brief) setBrief(data.brief);
      }
    } catch {
      /* best effort */
    }
  }, [sessionId]);

  /* -- Send message -- */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userText, session_id: sessionId }),
      });

      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        userMessage?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(
          data.userMessage || data.error || "No response.",
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply! },
      ]);

      setTimeout(refreshBrief, 3500);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Unexpected error.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: msg },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  /* -- New conversation -- */
  async function handleStartNew() {
    localStorage.removeItem(VISITOR_ID_KEY);
    initializedRef.current = false;
    setSessionId(null);
    setMessages([WELCOME]);
    setBrief(null);
    setActiveTab("chat");
    setEmailMode(false);
    setShareStatus("idle");

    try {
      const visitorId = getOrCreateVisitorId();
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitor_id: visitorId }),
      });
      if (res.ok) {
        const data: SessionPayload = await res.json();
        setSessionId(data.session.id);
      }
    } catch {
      /* continue without persistence */
    }
  }

  /* -- Share plan -- */
  async function handleSharePlan() {
    if (!sessionId || !email.trim()) return;
    setShareStatus("sending");
    try {
      const res = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          email: email.trim(),
        }),
      });
      if (res.ok) {
        setShareStatus("sent");
        setBrief((prev) =>
          prev ? { ...prev, status: "shared" } : prev,
        );
        setEmailMode(false);
      }
    } catch {
      setShareStatus("idle");
    }
  }

  /* ---------- Render ---------- */
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="flex w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  activeTab === "chat"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("plan")}
                className={`relative rounded-md px-3 py-1 text-xs font-medium transition ${
                  activeTab === "plan"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Your Plan
                {hasPlan && activeTab !== "plan" && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-400" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleStartNew}
                  className="rounded-md border border-border px-2 py-1 text-[10px] text-muted transition hover:bg-background"
                >
                  New
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-border px-2 py-1 text-[10px] text-muted transition hover:bg-background"
              >
                Close
              </button>
            </div>
          </div>

          {/* ---- Chat Tab ---- */}
          {activeTab === "chat" && (
            <>
              <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
                {isRestoring && (
                  <div className="py-2 text-center text-xs text-muted">
                    Restoring your conversation...
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-accent text-white"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="max-w-[90%] rounded-xl bg-background px-3 py-2 text-sm text-muted">
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-border p-3"
              >
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe what you want to build..."
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ---- Plan Tab ---- */}
          {activeTab === "plan" && (
            <div className="max-h-[28rem] overflow-y-auto px-4 py-4">
              {hasPlan && brief ? (
                <>
                  <PlanView
                    brief={brief}
                    onShare={() => setEmailMode(true)}
                  />

                  {emailMode && brief.status !== "shared" && (
                    <div className="mt-4 space-y-2 rounded-lg border border-border p-3">
                      <p className="text-xs text-muted">
                        Enter your email so Kevin can follow up on your
                        plan:
                      </p>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        type="email"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={handleSharePlan}
                        disabled={
                          !email.trim() ||
                          shareStatus === "sending"
                        }
                        className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-light disabled:opacity-60"
                      >
                        {shareStatus === "sending"
                          ? "Sending..."
                          : "Send to Kevin"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="mb-1 text-sm font-medium text-foreground">
                    No plan yet
                  </p>
                  <p className="text-xs text-muted">
                    Start chatting about your project idea — your plan
                    will build here automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-light"
                  >
                    Start Chatting
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-light"
        >
          Ask AI
        </button>
      )}
    </div>
  );
}
