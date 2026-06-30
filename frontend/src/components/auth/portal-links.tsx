"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { APP_PATHS, APP_LINKS } from "@/lib/app-urls";

interface PortalUrlBoxProps {
  label: string;
  url: string;
  description: string;
  href: string;
  variant?: "website" | "admin";
}

export function PortalUrlBox({
  label,
  url,
  description,
  href,
  variant = "website",
}: PortalUrlBoxProps) {
  return (
    <div
      className={
        variant === "admin"
          ? "rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2"
          : "rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-sm break-all">{url}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        Open
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

interface PortalLinksPanelProps {
  websiteLoginUrl: string;
  adminLoginUrl: string;
  currentPortal: "website" | "admin";
}

export function PortalLinksPanel({
  websiteLoginUrl,
  adminLoginUrl,
  currentPortal,
}: PortalLinksPanelProps) {
  const other =
    currentPortal === "website"
      ? {
          label: "Admin Panel Login",
          url: adminLoginUrl,
          href: APP_LINKS.adminLogin(),
          hint: "For admins — manage users, roles & passwords",
        }
      : {
          label: "Website Login",
          url: websiteLoginUrl,
          href: APP_PATHS.websiteLogin,
          hint: "For employees — track expenses & reports",
        };

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-border/50 bg-muted/40 p-3 text-[11px] space-y-2">
        <p className="font-semibold text-foreground">App links</p>
        <div className="space-y-1 font-mono text-[10px] sm:text-[11px]">
          <p>
            <span className="text-muted-foreground">Website: </span>
            <span className="text-primary">{websiteLoginUrl}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Admin: </span>
            <span className="text-primary">{adminLoginUrl}</span>
          </p>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {other.hint} —{" "}
        <Link href={other.href} className="font-semibold text-primary hover:underline">
          {other.label}
        </Link>
      </p>
    </div>
  );
}
