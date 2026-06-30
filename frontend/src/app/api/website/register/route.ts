import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { handleSignInError } from "@/lib/handle-sign-in-error";
import { registerSchema } from "@/lib/validations";
import { apiPath } from "@/lib/api-config";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(apiPath("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? "Registration failed" },
        { status: res.status }
      );
    }

    const result = await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    if (typeof result === "string" && result.includes("error")) {
      return NextResponse.json({ ok: true, needsLogin: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const handled = handleSignInError(error);
    if (handled) return handled;

    console.error("[website/register] Registration failed:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
