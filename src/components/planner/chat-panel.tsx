"use client";

import { FormEvent, useEffect, useRef } from "react";

export type Message = { role: "assistant" | "user"; text: string };

export function ChatPanel({
  messages,
  input,
  isLoading,
  isRestoring,
  canSend,
  onInputChange,
  onSubmit,
}: {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isRestoring: boolean;
  canSend: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {isRestoring && (
          <div className="py-2 text-center text-xs text-muted">
            Restoring your conversation...
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              message.role === "user"
                ? "ml-auto bg-accent text-white"
                : "bg-surface text-foreground"
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-[85%] rounded-xl bg-surface px-3.5 py-2.5 text-sm text-muted">
            <span className="inline-flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSubmit} className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted focus:border-accent"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
