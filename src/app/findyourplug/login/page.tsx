"use client";

import LoginForm from "@/components/Authentication/LoginForm";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") ?? undefined;
  const error = searchParams.get("error") ?? undefined;
  const registered = searchParams.get("registered") === "true";

  return (
    <LoginForm
      redirectUrl={redirectUrl}
      initialError={error}
      registered={registered}
    />
  );
};

export default LoginPage;
