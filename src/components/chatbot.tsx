"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  role: "assistant" | "user";
  text: string;
};

type ApiMessage = {
  role: "assistant" | "user";
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I can help you identify the highest-impact AI feature to build next. Share your goal, and I will suggest a practical MVP path in 2 minutes.",
    },
  ]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    setInput("");
    setIsLoading(true);
    const nextMessages: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(nextMessages);
    const contextMessages: ApiMessage[] = nextMessages.slice(-8).map((message) => ({
      role: message.role,
      text: message.text,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userText, messages: contextMessages }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        userMessage?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(
          data.userMessage || data.error || "No response from assistant.",
        );
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply! }]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected assistant error.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-xs text-muted">Ask about services, scope, and fit</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted transition hover:bg-background"
            >
              Close
            </button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
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
            {isLoading ? (
              <div className="max-w-[90%] rounded-xl bg-background px-3 py-2 text-sm text-muted">
                Thinking...
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question..."
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
