import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");

  if (!shareId || !/^[a-f0-9]{12}$/.test(shareId)) {
    return NextResponse.json(
      { error: "Invalid brief ID" },
      { status: 400 },
    );
  }

  const { data: brief } = await supabase
    .from("project_briefs")
    .select(
      "summary, goals, features, target_audience, tech_preferences, timeline, budget_signals, industry, status, created_at",
    )
    .eq("share_id", shareId)
    .maybeSingle();

  if (!brief) {
    return NextResponse.json(
      { error: "Brief not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ brief });
}
