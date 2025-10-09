import { signOut } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

export async function GET() {
  return signOut({
    redirect: true,
    callbackUrl: ROUTES.LOGIN,
  });
}
