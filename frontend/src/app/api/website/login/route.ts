import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { handleSignInError } from "@/lib/handle-sign-in-error";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse({
    email: String((body as { email?: string }).email ?? "").trim().toLowerCase(),
    password: (body as { password?: string }).password,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    if (typeof result === "string" && result.includes("error")) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const handled = handleSignInError(error);
    if (handled) return handled;

    console.error("[website/login] Session creation failed:", error);
    return NextResponse.json(
      { error: "Session could not be created. Try again." },
      { status: 500 }
    );
  }
}
