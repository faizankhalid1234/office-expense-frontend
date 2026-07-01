import { auth } from "@/auth";
import { apiPath } from "./api-config";
import { redirectSessionExpired } from "./session-redirect";

export async function serverApi<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const session = await auth();

  if (!session?.accessToken) {
    redirectSessionExpired("/auth/login");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(apiPath(path), {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    console.error("[serverApi] Backend unreachable:", apiPath(path), error);
    throw new Error(
      "Cannot connect to backend API. Start it with: cd backend office && npm run dev (port 5000)"
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { error?: string }).error ?? `API error ${res.status}`;

    if (res.status === 401 || res.status === 403) {
      redirectSessionExpired("/auth/login");
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function serverApiPublic<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiPath(path), { cache: "no-store" });
  } catch (error) {
    console.error("[serverApiPublic] Backend unreachable:", apiPath(path), error);
    throw new Error(
      "Cannot connect to backend API. Start it with: cd backend office && npm run dev (port 5000)"
    );
  }

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json() as Promise<T>;
}
