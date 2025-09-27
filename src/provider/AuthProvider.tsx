"use client";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const Web3Provider = dynamic(() => import("./Web3Provider"), {
  ssr: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Web3Provider>{children}</Web3Provider>
    </SessionProvider>
  );
}
