import { getSession } from "next-auth/react";
import { apiPath } from "./api-config";

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<{ data: T; ok: true } | { error: string; ok: false; status: number }> {
  const session = await getSession();
  const token = session?.accessToken;

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(apiPath(path), { ...init, headers });
  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: (payload as { error?: string })?.error ?? "Request failed",
    };
  }

  return { ok: true, data: payload as T };
}
