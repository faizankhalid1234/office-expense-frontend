import { cn } from "@/lib/utils";
import { COMPANY_NAME } from "@/lib/constants";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, { box: string; icon: number; title: string; subtitle: string }> = {
  sm: { box: "h-9 w-9 rounded-xl", icon: 36, title: "text-base", subtitle: "text-xs" },
  md: { box: "h-11 w-11 rounded-2xl", icon: 44, title: "text-base", subtitle: "text-xs" },
  lg: { box: "h-14 w-14 rounded-2xl", icon: 56, title: "text-lg", subtitle: "text-sm" },
  xl: { box: "h-20 w-20 rounded-3xl", icon: 80, title: "text-3xl", subtitle: "text-base" },
};

function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hh-bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" />
          <stop offset="0.5" stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="hh-shine" x1="16" y1="8" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#hh-bg)" />
      <rect x="4" y="4" width="56" height="28" rx="16" fill="url(#hh-shine)" />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="-1"
      >
        HH
      </text>
      <path
        d="M18 46 H30 V50 H18 Z M34 42 H46 V46 H34 Z M34 50 H42 V54 H34 Z"
        fill="white"
        fillOpacity="0.85"
        rx="1"
      />
      <circle cx="50" cy="14" r="4" fill="#fbbf24" stroke="#4c1d95" strokeWidth="1.5" />
    </svg>
  );
}

interface CompanyLogoProps {
  size?: LogoSize;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  variant?: "default" | "light" | "dark";
  layout?: "horizontal" | "vertical";
}

const TEXT_VARIANTS = {
  default: { title: "text-foreground", subtitle: "text-muted-foreground" },
  light: { title: "text-white", subtitle: "text-white/70" },
  dark: { title: "text-foreground", subtitle: "text-muted-foreground" },
};

export function CompanyLogo({
  size = "md",
  showText = true,
  subtitle = "Expense Manager",
  className,
  variant = "default",
  layout = "horizontal",
}: CompanyLogoProps) {
  const s = SIZES[size];
  const colors = TEXT_VARIANTS[variant];

  return (
    <div
      className={cn(
        "flex items-center",
        layout === "vertical" ? "flex-col gap-2 text-center" : "gap-3",
        className
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden shadow-md shadow-primary/20 ring-1 ring-border/50",
          s.box
        )}
      >
        <LogoMark size={s.icon} />
      </div>
      {showText && (
        <div className={cn("min-w-0", layout === "vertical" && "space-y-0.5")}>
          <p className={cn("truncate font-bold leading-tight", s.title, colors.title)}>
            {COMPANY_NAME}
          </p>
          {subtitle && (
            <p className={cn("truncate font-medium", s.subtitle, colors.subtitle)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CompanyLogoMark({ size = "md", className }: { size?: LogoSize; className?: string }) {
  const s = SIZES[size];
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden shadow-md shadow-primary/20 ring-1 ring-border/50",
        s.box,
        className
      )}
    >
      <LogoMark size={s.icon} />
    </div>
  );
}
