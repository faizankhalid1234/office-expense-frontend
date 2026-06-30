import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiPath } from "./api-config";

export async function serverApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/auth/login");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(apiPath(path), {
      ...init,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `API error ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error && error.message.includes("API error")) {
      throw error;
    }
    console.error("[serverApi] Backend unreachable:", apiPath(path), error);
    throw new Error(
      "Cannot connect to backend API. Start it with: npm run dev:backend (port 5000)"
    );
  }
}

export async function serverApiPublic<T>(path: string): Promise<T> {
  try {
    const res = await fetch(apiPath(path), { cache: "no-store" });
    if (!res.ok) throw new Error("API request failed");
    return res.json() as Promise<T>;
  } catch (error) {
    console.error("[serverApiPublic] Backend unreachable:", apiPath(path), error);
    throw new Error(
      "Cannot connect to backend API. Start it with: npm run dev:backend (port 5000)"
    );
  }
}
