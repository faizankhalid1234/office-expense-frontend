import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import "@/lib/auth-env";
import { APP_LINKS } from "@/lib/app-urls";

const WEBSITE_PUBLIC = ["/auth/login", "/auth/register"];
const OFFICE_ADMIN_ROUTES = ["/categories", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: request.nextUrl.protocol === "https:",
  });

  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  const isWebsitePublic = WEBSITE_PUBLIC.some((route) => pathname.startsWith(route));

  if (isWebsitePublic) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isOfficeAdminRoute = OFFICE_ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isOfficeAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/users")) {
    return NextResponse.redirect(APP_LINKS.adminUsers());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
