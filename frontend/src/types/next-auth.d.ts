import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EMPLOYEE";
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    role: "ADMIN" | "EMPLOYEE";
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "EMPLOYEE";
    accessToken?: string;
  }
}
