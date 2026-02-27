import { NextResponse, after } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  let body: { visitor_id?: string };
  try {
    body = (await request.json()) as { visitor_id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const visitorId = body.visitor_id;
  if (!visitorId || typeof visitorId !== "string") {
    return NextResponse.json(
      { error: "visitor_id is required" },
      { status: 400 },
    );
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .upsert(
      { visitor_id: visitorId, updated_at: new Date().toISOString() },
      { onConflict: "visitor_id" },
    )
    .select("id")
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: sessionError?.message || "Failed to create session" },
      { status: 500 },
    );
  }

  const [messagesResult, briefResult] = await Promise.all([
    supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })
      .limit(50),
    supabase
      .from("project_briefs")
      .select(
        "summary, goals, features, target_audience, tech_preferences, timeline, budget_signals, industry, status, share_id",
      )
      .eq("session_id", session.id)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    session: { id: session.id },
    messages: messagesResult.data || [],
    brief: briefResult.data,
  });
}

async function sendNotification(
  visitorEmail: string,
  brief: {
    summary: string | null;
    goals: string[];
    features: string[];
    target_audience: string | null;
    industry: string | null;
    timeline: string | null;
    share_id: string | null;
  },
) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.NOTIFICATION_EMAIL;
  if (!resendKey || !notifyTo) return;

  const briefUrl = brief.share_id
    ? `https://kevinolson.ai/brief/${brief.share_id}`
    : null;

  const goalsList = brief.goals.length
    ? brief.goals.map((g) => `  - ${g}`).join("\n")
    : "  (none yet)";
  const featuresList = brief.features.length
    ? brief.features.map((f) => `  - ${f}`).join("\n")
    : "  (none yet)";

  const details = [
    brief.target_audience && `Audience: ${brief.target_audience}`,
    brief.industry && `Industry: ${brief.industry}`,
    brief.timeline && `Timeline: ${brief.timeline}`,
  ]
    .filter(Boolean)
    .join("\n");

  const text = [
    `New project plan shared on kevinolson.ai`,
    ``,
    `From: ${visitorEmail}`,
    briefUrl && `Brief: ${briefUrl}`,
    ``,
    `Summary: ${brief.summary || "(no summary yet)"}`,
    ``,
    `Goals:\n${goalsList}`,
    ``,
    `Features:\n${featuresList}`,
    details && `\n${details}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "AI Project Planner <planner@kevinolson.ai>",
        to: notifyTo,
        subject: `New Plan: ${brief.summary?.slice(0, 60) || "Untitled Project"}`,
        text,
      }),
    });
  } catch {
    // Notification is best-effort
  }
}

export async function PATCH(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  let body: { session_id?: string; email?: string; name?: string };
  try {
    body = (await request.json()) as {
      session_id?: string;
      email?: string;
      name?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.session_id) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    );
  }

  const updates: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };
  if (body.email) updates.email = body.email;
  if (body.name) updates.name = body.name;

  const [sessionResult] = await Promise.all([
    supabase.from("sessions").update(updates).eq("id", body.session_id),
    supabase
      .from("project_briefs")
      .update({ status: "shared", updated_at: new Date().toISOString() })
      .eq("session_id", body.session_id),
  ]);

  if (sessionResult.error) {
    return NextResponse.json(
      { error: sessionResult.error.message },
      { status: 500 },
    );
  }

  if (body.email) {
    const { data: briefData } = await supabase
      .from("project_briefs")
      .select("summary, goals, features, target_audience, industry, timeline, share_id")
      .eq("session_id", body.session_id)
      .maybeSingle();

    if (briefData) {
      after(async () => {
        await sendNotification(body.email!, briefData);
      });
    }
  }

  return NextResponse.json({ success: true });
}
