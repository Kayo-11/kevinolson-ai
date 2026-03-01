"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">
          Planner Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-muted transition hover:text-foreground"
          >
            Back to site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs text-muted transition hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
