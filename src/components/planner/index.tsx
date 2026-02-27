"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatPanel, type Message } from "./chat-panel";
import { PlanPanel, type ProjectBrief } from "./plan-panel";

type SessionPayload = {
  session: { id: string };
  messages: Array<{ role: string; content: string }>;
  brief: ProjectBrief | null;
};

const VISITOR_ID_KEY = "ko_visitor_id";

const WELCOME: Message = {
  role: "assistant",
  text: "I help turn rough ideas into concrete project plans. Tell me what you're thinking about building \u2014 I'll help shape it into something actionable.",
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

export function Planner() {
  const [mobileTab, setMobileTab] = useState<"chat" | "plan">("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [shareStatus, setShareStatus] = useState<"idle" | "sending" | "sent">("idle");

  const initializedRef = useRef(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  const hasPlan = useMemo(
    () =>
      brief !== null &&
      (brief.summary !== null || brief.goals.length > 0 || brief.features.length > 0),
    [brief],
  );

  useEffect(() => {
    if (initializedRef.current) return;
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
  }, []);

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
        throw new Error(data.userMessage || data.error || "No response.");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply! }]);
      setTimeout(refreshBrief, 3500);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unexpected error.";
      setMessages((prev) => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStartNew() {
    localStorage.removeItem(VISITOR_ID_KEY);
    initializedRef.current = false;
    setSessionId(null);
    setMessages([WELCOME]);
    setBrief(null);
    setMobileTab("chat");
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

  async function handleSharePlan() {
    if (!sessionId || !email.trim()) return;
    setShareStatus("sending");
    try {
      const res = await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email: email.trim() }),
      });
      if (res.ok) {
        setShareStatus("sent");
        setBrief((prev) => (prev ? { ...prev, status: "shared" } : prev));
        setEmailMode(false);
      }
    } catch {
      setShareStatus("idle");
    }
  }

  const shared = brief?.status === "shared";

  return (
    <section id="planner" className="px-4 pb-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-2xl shadow-accent/5">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex gap-1 md:hidden">
              <button
                type="button"
                onClick={() => setMobileTab("chat")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  mobileTab === "chat"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("plan")}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  mobileTab === "plan"
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Your Plan
                {hasPlan && mobileTab !== "plan" && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-green-400" />
                )}
              </button>
            </div>
            <span className="hidden text-xs font-medium text-muted md:block">
              AI Project Planner
            </span>
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleStartNew}
                className="rounded-md border border-border px-2.5 py-1 text-[10px] text-muted transition hover:bg-background hover:text-foreground"
              >
                New conversation
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row" style={{ height: "min(72vh, 600px)" }}>
            {/* Chat panel */}
            <div
              className={`md:w-[45%] md:flex md:flex-col md:border-r md:border-border ${
                mobileTab === "chat" ? "flex flex-1 flex-col" : "hidden md:flex"
              }`}
            >
              <ChatPanel
                messages={messages}
                input={input}
                isLoading={isLoading}
                isRestoring={isRestoring}
                canSend={canSend}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Plan panel */}
            <div
              className={`md:w-[55%] md:flex md:flex-col ${
                mobileTab === "plan" ? "flex flex-1 flex-col" : "hidden md:flex"
              }`}
            >
              <PlanPanel
                brief={brief}
                onShare={() => setEmailMode(true)}
                shared={shared}
              />

              {emailMode && !shared && (
                <div className="border-t border-border p-4">
                  <p className="mb-2 text-xs text-muted">
                    Enter your email so Kevin can follow up:
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      type="email"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={handleSharePlan}
                      disabled={!email.trim() || shareStatus === "sending"}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-light disabled:opacity-60"
                    >
                      {shareStatus === "sending" ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
