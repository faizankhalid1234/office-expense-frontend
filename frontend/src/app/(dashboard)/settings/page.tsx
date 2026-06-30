import { auth } from "@/auth";
import { SettingsView } from "@/components/settings/settings-view";
import { APP_LINKS } from "@/lib/app-urls";
import { COMPANY_NAME } from "@/lib/constants";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Application and account settings
        </p>
      </div>
      <SettingsView
        user={{
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          role: session?.user?.role ?? "EMPLOYEE",
        }}
        companyName={COMPANY_NAME}
        websiteLoginUrl={APP_LINKS.websiteLogin()}
        adminLoginUrl={APP_LINKS.adminLogin()}
      />
    </div>
  );
}
