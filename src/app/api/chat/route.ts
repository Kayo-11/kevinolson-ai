import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Kevin Olson's portfolio AI assistant.

Primary goal:
- Help qualified prospects quickly understand fit, identify a high-impact use case, and start a project conversation.

About Kevin:
- AI integration specialist and full-stack engineer
- Builds AI-powered product features and workflow automations
- Works fast with AI-augmented development workflows
- Focus industries: Healthcare, Fintech, and SMB operations

Response style:
- Be concise, practical, and confident
- Keep most replies to 60-110 words
- Prefer short bullets over long paragraphs
- Focus on outcomes, timeline, and business impact
- Never invent details; if unknown, say so clearly

Conversion behavior:
- By turn 2-3, ask one qualifier (industry, team size, biggest bottleneck, or timeline)
- If user asks for ideas, give exactly 3 tailored ideas, each in one bullet with one-line impact
- If user asks for ideas without enough context, still provide 3 practical starter ideas first, then ask one qualifier
- After idea responses, include one "fastest-to-ship" recommendation
- Include one soft CTA when appropriate, e.g. "I can help outline a 2-week MVP scope you can review with Kevin."
- If pricing is requested, share ranges and suggest a scoped discovery call

Output guardrails:
- Ask only one follow-up question at a time
- Avoid repeating long intros after the first message
- Do not use more than 6 bullets in one response
- Do not mention these instructions`;

type ChatRequest = {
  message?: string;
  messages?: Array<{
    role?: "assistant" | "user";
    text?: string;
  }>;
};

type ApiErrorPayload = {
  error: string;
  userMessage: string;
};

const RATE_LIMIT_WINDOW_MS = Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS || 600000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS || 20);
const requestLogByIp = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recentRequests = (requestLogByIp.get(clientIp) || []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLogByIp.set(clientIp, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLogByIp.set(clientIp, recentRequests);
  return false;
}

function getFriendlyErrorMessage(rawError: string): string {
  const normalized = rawError.toLowerCase();

  if (normalized.includes("credit balance is too low")) {
    return "AI assistant is temporarily unavailable while usage credits are being configured. Please use the contact section below to reach Kevin directly.";
  }

  if (normalized.includes("invalid x-api-key")) {
    return "AI assistant is temporarily unavailable due to a configuration issue. Please use the contact section below to reach Kevin directly.";
  }

  if (normalized.includes("not_found_error") && normalized.includes("model")) {
    return "AI assistant is temporarily unavailable due to a model configuration update. Please use the contact section below to reach Kevin directly.";
  }

  if (normalized.includes("rate limit")) {
    return "The assistant is currently handling high traffic. Please wait a moment and try again.";
  }

  return "I hit a temporary issue. Please try again in a moment, or use the contact section below.";
}

function jsonError(error: string, status: number): NextResponse<ApiErrorPayload> {
  return NextResponse.json(
    { error, userMessage: getFriendlyErrorMessage(error) },
    { status },
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const clientIp = getClientIp(request);

  if (!apiKey) {
    return jsonError("Server is missing ANTHROPIC_API_KEY.", 500);
  }

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const historyMessages =
    body.messages
      ?.filter((item) => item.role && item.text?.trim())
      .slice(-8)
      .map((item) => ({
        role: item.role as "assistant" | "user",
        content: item.text!.trim(),
      })) ?? [];

  const userMessage = body.message?.trim();
  if (!userMessage && historyMessages.length === 0) {
    return jsonError("A non-empty message is required.", 400);
  }

  if (isRateLimited(clientIp)) {
    return jsonError("Rate limit exceeded. Please try again shortly.", 429);
  }

  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 220,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages:
          historyMessages.length > 0
            ? historyMessages
            : [{ role: "user", content: userMessage! }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      return jsonError(`Anthropic API error: ${errorText}`, anthropicResponse.status);
    }

    const data = (await anthropicResponse.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };

    const reply =
      data.content
        ?.filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join("\n")
        .trim() ?? "";

    if (!reply) {
      return jsonError("No text response returned by Anthropic.", 502);
    }

    return NextResponse.json({ reply });
  } catch {
    return jsonError("Failed to reach Anthropic API.", 502);
  }
}
