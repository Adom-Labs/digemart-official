"use client";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import QueryProvider from "./QueryProvider";

const Web3Provider = dynamic(() => import("./Web3Provider"), {
  ssr: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SessionProvider>
        <Web3Provider>{children}</Web3Provider>
      </SessionProvider>
    </QueryProvider>
  );
}
