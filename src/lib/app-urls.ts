/** Website paths (employee app on port 3000) */
export const APP_PATHS = {
  websiteLogin: "/auth/login",
  websiteRegister: "/auth/register",
  dashboard: "/dashboard",
  settings: "/settings",
} as const;

export function getWebsiteBaseUrl(): string {
  const url =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function getAdminBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    process.env.ADMIN_URL?.trim() ||
    "http://localhost:4000";
  return url.replace(/\/$/, "");
}

export function appUrl(path: string, baseUrl?: string): string {
  const base = (baseUrl ?? getWebsiteBaseUrl()).replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const APP_LINKS = {
  websiteLogin: (base?: string) => appUrl(APP_PATHS.websiteLogin, base),
  websiteRegister: (base?: string) => appUrl(APP_PATHS.websiteRegister, base),
  websiteDashboard: (base?: string) => appUrl(APP_PATHS.dashboard, base),
  adminLogin: () => `${getAdminBaseUrl()}/login`,
  adminUsers: () => `${getAdminBaseUrl()}/users`,
  adminDashboard: () => getAdminBaseUrl(),
} as const;
