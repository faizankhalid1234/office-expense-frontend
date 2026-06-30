import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Lightbulb,
  Wallet,
  Receipt,
  PieChart,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, description: "Summary & totals" },
  { href: "/dashboard/quick-add", label: "Quick Add", icon: Zap, description: "Add fuel expense" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, description: "Charts & trends" },
  { href: "/dashboard/insights", label: "Insights", icon: Lightbulb, description: "Key highlights" },
  { href: "/dashboard/budget", label: "Budget", icon: Wallet, description: "Monthly limit" },
  { href: "/dashboard/recent", label: "Recent", icon: Receipt, description: "Latest expenses" },
  { href: "/dashboard/categories", label: "Categories", icon: PieChart, description: "Spending split" },
];
