import { ensureHttpsUrl } from "@/lib/auth-env";

export function getBackendUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    "http://localhost:5000";

  if (raw.includes("localhost") || raw.includes("127.0.0.1")) {
    return raw.replace(/\/$/, "");
  }

  return ensureHttpsUrl(raw) ?? raw.replace(/\/$/, "");
}

export function apiPath(path: string): string {
  const base = getBackendUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Prefix for receipt URLs stored as /uploads/... */
export function resolveUploadUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${getBackendUrl()}${url}`;
}
