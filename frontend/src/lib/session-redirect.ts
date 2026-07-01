import { redirect } from "next/navigation";

/** Clear stale session and send user back to login (avoids redirect loops). */
export function redirectSessionExpired(loginPath: string): never {
  const callback = encodeURIComponent(`${loginPath}?error=session_expired`);
  redirect(`/api/auth/signout?callbackUrl=${callback}`);
}
