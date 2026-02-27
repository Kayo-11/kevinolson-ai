import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ brief: null });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    );
  }

  const { data: brief } = await supabase
    .from("project_briefs")
    .select(
      "summary, goals, features, target_audience, tech_preferences, timeline, budget_signals, industry, status",
    )
    .eq("session_id", sessionId)
    .maybeSingle();

  return NextResponse.json({ brief });
}
