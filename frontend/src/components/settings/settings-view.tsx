"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, User, Shield, Users, Wallet, ExternalLink } from "lucide-react";
import { PortalUrlBox } from "@/components/auth/portal-links";
import { APP_PATHS, APP_LINKS } from "@/lib/app-urls";
import { CompanyLogo } from "@/components/brand/company-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CurrencySelect } from "@/components/currency/currency-select";
import { useInputCurrency } from "@/components/currency/currency-provider";
import { CLP_TO_PKR } from "@/lib/currency";
import {
  FUEL_PRICES_LAST_UPDATED,
  CHILE_FUEL_PRICES,
  PAKISTAN_FUEL_PRICES,
  pakistanFuelPricePKR,
} from "@/lib/fuel-prices";

interface SettingsViewProps {
  user: { name: string; email: string; role: string };
  companyName: string;
  websiteLoginUrl: string;
  adminLoginUrl: string;
}

export function SettingsView({
  user,
  companyName,
  websiteLoginUrl,
  adminLoginUrl,
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const { inputCurrency, setInputCurrency } = useInputCurrency();

  return (
    <div className="grid w-full max-w-2xl gap-4 sm:gap-6">
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Company</CardTitle>
          <CardDescription>Organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CompanyLogo size="lg" subtitle="Expense Manager" />
          <div>
            <p className="text-sm text-muted-foreground">Company Name</p>
            <p className="font-semibold">{companyName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Application</p>
            <p className="font-semibold">Office Expense Management System</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">App Links</CardTitle>
          <CardDescription>Website and admin panel — separate login URLs</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <PortalUrlBox
            label="Website (employees)"
            url={websiteLoginUrl}
            description="Expenses, dashboard, reports"
            href={APP_PATHS.websiteLogin}
            variant="website"
          />
          <PortalUrlBox
            label="Admin panel"
            url={adminLoginUrl}
            description="Users, roles, passwords (port 4000)"
            href={APP_LINKS.adminLogin()}
            variant="admin"
          />
        </CardContent>
      </Card>

      {user.role === "ADMIN" && (
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              User Management
            </CardTitle>
            <CardDescription>
              Create users, set emails, passwords &amp; roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={APP_LINKS.adminLogin()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-500"
            >
              <Shield className="h-4 w-4" />
              Open Admin Site
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4" />
            Currency
          </CardTitle>
          <CardDescription>
            Enter expenses in PKR or Chilean Peso (CLP). Both amounts show everywhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CurrencySelect value={inputCurrency} onChange={setInputCurrency} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Chile (CLP/L) · Updated {FUEL_PRICES_LAST_UPDATED}</p>
            {Object.entries(CHILE_FUEL_PRICES).map(([key, entry]) => (
              <p key={`cl-${key}`}>
                {entry.label}: {entry.clpPerLiter.toLocaleString("en-US")} CLP
                {entry.usdPerLiter != null ? ` · $${entry.usdPerLiter} USD` : ""}
              </p>
            ))}
            <p className="font-medium text-foreground pt-1">Pakistan (Rs/L)</p>
            {Object.entries(PAKISTAN_FUEL_PRICES).map(([key, entry]) => (
              <p key={`pk-${key}`}>
                {entry.label}: Rs {entry.pkrPerLiter.toFixed(2)}
              </p>
            ))}
            <p className="text-[10px]">1 CLP = {CLP_TO_PKR} PKR (for conversion)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="min-h-10 flex-1 sm:flex-none"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-1.5 h-4 w-4 sm:mr-2" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="min-h-10 flex-1 sm:flex-none"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-1.5 h-4 w-4 sm:mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="min-h-10 flex-1 sm:flex-none"
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-1.5 h-4 w-4 sm:mr-2" />
              System
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="pwa">Install as App (PWA)</Label>
            <p className="text-xs text-muted-foreground">
              Use browser menu → &quot;Install app&quot; on mobile/desktop
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
