export function getBackendUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    "http://localhost:5000";
  return url.replace(/\/$/, "");
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
