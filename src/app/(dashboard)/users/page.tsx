import { redirect } from "next/navigation";
import { APP_LINKS } from "@/lib/app-urls";

export default function LegacyUsersRedirect() {
  redirect(APP_LINKS.adminUsers());
}
