import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Digemart",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '683e017bfc5a1d5c24a88589bf38316e',
  chains: [baseSepolia, base],
  ssr: true,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
});

const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [client] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
