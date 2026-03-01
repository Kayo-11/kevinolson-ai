import { NextResponse } from "next/server";
import { signSession, setDashboardCookie } from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  const secret = process.env.DASHBOARD_PASSWORD;
  if (!secret) {
    return NextResponse.json(
      { error: "Dashboard not configured" },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password || password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signSession(secret);
  await setDashboardCookie(token);

  return NextResponse.json({ ok: true }, { status: 200 });
}
