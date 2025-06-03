import { base, sepolia } from "viem/chains";

export const TARGET_CHAIN =
  process.env.NEXT_PUBLIC_TARGET_CHAIN === "base" ? base : sepolia;
export const CONTRACT_ADDRESS =
  TARGET_CHAIN.id === base.id
    ? "0xfFDC40E957307B3a61420f701376c8DE4F0514A4"
    : "0xfFDC40E957307B3a61420f701376c8DE4F0514A4";
export const MINT_PRICE = "420000000000000";

export const BASE_URL = "https://splosions.raidguild.org";

export const FARCASTER_SHARE_URL = `https://farcaster.xyz/~/compose?text=BOOOOOOOM!&embeds[]=${BASE_URL}`;

export const EXPLORER_URL = `https://basescan.org/token/${CONTRACT_ADDRESS}`;

export const DEFAULT_FARCASTER = "thefly";
