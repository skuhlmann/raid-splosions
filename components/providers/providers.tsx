"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import farcasterFrame from "@farcaster/frame-wagmi-connector";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TARGET_CHAIN } from "@/lib/constants";
import { base, sepolia } from "viem/chains";
import { FrameSDKProvider } from "./frame-provider";

export const config = createConfig({
  chains: [TARGET_CHAIN],
  transports: {
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",
    }),
  ],
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FrameSDKProvider>
          <RainbowKitProvider
            modalSize="compact"
            theme={midnightTheme({
              accentColor: "#d25c41",
              borderRadius: "small",
              fontStack: "system",
            })}
          >
            {children}
          </RainbowKitProvider>
        </FrameSDKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
