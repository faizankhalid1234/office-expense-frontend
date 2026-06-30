"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard error]", error);
  }, [error]);

  const isBackend =
    error.message.includes("backend") ||
    error.message.includes("port 5000") ||
    error.message.includes("connect");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {isBackend
          ? "Backend API is not running. Open two terminals or run: npm run dev (from project root)."
          : error.message || "A server error occurred."}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/auth/login"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Sign in again
        </Link>
      </div>
      {isBackend && (
        <pre className="mt-4 rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
          cd office-expense
          npm run dev
        </pre>
      )}
    </div>
  );
}
