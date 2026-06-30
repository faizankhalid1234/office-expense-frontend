import "@/lib/auth-env";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicRoutes = ["/auth/login", "/auth/register"];
      const isPublic = publicRoutes.some((route) => nextUrl.pathname.startsWith(route));
      const isStatic =
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.startsWith("/icons") ||
        nextUrl.pathname === "/manifest.json" ||
        nextUrl.pathname === "/sw.js" ||
        nextUrl.pathname.startsWith("/uploads");

      // API routes handle their own auth — never redirect them to login HTML
      if (nextUrl.pathname.startsWith("/api/")) return true;

      if (isStatic) return true;
      if (isPublic) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }
      if (!isLoggedIn) return false;

      const adminRoutes = ["/categories", "/settings"];
      const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
      if (isAdminRoute && auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        if (user.accessToken) token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EMPLOYEE";
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
