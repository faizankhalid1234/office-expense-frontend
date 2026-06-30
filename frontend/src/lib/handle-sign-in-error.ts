import { NextResponse } from "next/server";
import { AuthError } from "next-auth";

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export function handleSignInError(error: unknown): NextResponse | null {
  if (isRedirectError(error)) {
    return NextResponse.json({ ok: true });
  }

  if (error instanceof AuthError) {
    if (error.type === "CredentialsSignin") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    if (error.type === "MissingSecret") {
      return NextResponse.json(
        { error: "Server configuration error. Contact support." },
        { status: 500 }
      );
    }
  }

  return null;
}
