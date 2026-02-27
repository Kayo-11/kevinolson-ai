import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { BriefDocument } from "./brief-document";

type Brief = {
  summary: string | null;
  goals: string[];
  features: string[];
  target_audience: string | null;
  tech_preferences: string | null;
  timeline: string | null;
  budget_signals: string | null;
  industry: string | null;
  status: string;
  created_at: string;
};

async function getBrief(shareId: string): Promise<Brief | null> {
  if (!/^[a-f0-9]{12}$/.test(shareId)) return null;

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("project_briefs")
    .select(
      "summary, goals, features, target_audience, tech_preferences, timeline, budget_signals, industry, status, created_at",
    )
    .eq("share_id", shareId)
    .maybeSingle();

  return data;
}

type Props = { params: Promise<{ shareId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const brief = await getBrief(shareId);

  const title = brief?.summary
    ? `Project Brief: ${brief.summary.slice(0, 60)}`
    : "Project Brief";

  const description =
    brief?.summary || "A project brief generated with the AI Project Planner.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kevinolson.ai/brief/${shareId}`,
      siteName: "Kevin Olson | AI Project Planner",
      type: "article",
    },
  };
}

export default async function BriefPage({ params }: Props) {
  const { shareId } = await params;
  const brief = await getBrief(shareId);

  if (!brief) notFound();

  return <BriefDocument brief={brief} shareId={shareId} />;
}
