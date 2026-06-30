import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session?.accessToken) {
    redirect("/auth/login");
  }
  return session.user;
}
