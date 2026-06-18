/** Normalize URLs that were saved without a protocol (common on Vercel). */
function ensureHttpsUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, "");
  return `https://${trimmed.replace(/\/$/, "")}`;
}

/** Vercel: trust forwarded host and normalize Auth.js env vars. */
if (typeof process !== "undefined") {
  if (!process.env.AUTH_TRUST_HOST) {
    process.env.AUTH_TRUST_HOST = "true";
  }

  const secret =
    process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (secret) {
    process.env.AUTH_SECRET = secret;
    process.env.NEXTAUTH_SECRET = secret;
  }

  // On Vercel, a stale AUTH_URL (e.g. gilt vs mu) breaks cookies and sign-in redirects.
  // trustHost uses the incoming request host — drop fixed URLs in production.
  const onVercel = process.env.VERCEL === "1";
  if (onVercel && process.env.AUTH_TRUST_HOST === "true") {
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
  } else {
    const authUrl = ensureHttpsUrl(process.env.AUTH_URL);
    const nextAuthUrl = ensureHttpsUrl(process.env.NEXTAUTH_URL);

    if (authUrl) process.env.AUTH_URL = authUrl;
    if (nextAuthUrl) process.env.NEXTAUTH_URL = nextAuthUrl;

    if (!process.env.AUTH_URL && process.env.NEXTAUTH_URL) {
      process.env.AUTH_URL = process.env.NEXTAUTH_URL;
    }
    if (!process.env.NEXTAUTH_URL && process.env.AUTH_URL) {
      process.env.NEXTAUTH_URL = process.env.AUTH_URL;
    }
  }
}

export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
}

export { ensureHttpsUrl };
