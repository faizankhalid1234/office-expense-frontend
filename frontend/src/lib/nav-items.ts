import {
  LayoutDashboard,
  Receipt,
  Tags,
  FileBarChart,
  Wallet,
  Settings,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  highlight?: boolean;
};

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/categories", label: "Categories", icon: Tags, adminOnly: true },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];
