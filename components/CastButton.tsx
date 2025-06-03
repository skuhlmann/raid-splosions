"use client";

import frameSDK from "@farcaster/frame-sdk";
import Link from "next/link";
import { BASE_URL, FARCASTER_SHARE_URL } from "@/lib/constants";
import { useFrameSDK } from "./providers/frame-provider";

interface CastButtonProps {
  routePath: string;
  buttonText: string;
  text?: string;
}

export default function CastButton({
  routePath,
  buttonText,
  text,
}: CastButtonProps) {
  const { isMiniApp } = useFrameSDK();

  const handleCast = async () => {
    if (isMiniApp) {
      try {
        await frameSDK.actions.composeCast({
          text: text || "I lit the fuse",
          embeds: [`${BASE_URL}/${routePath}`],
        });
      } catch (error) {
        console.error("Error composing cast:", error);
      }
    }
  };

  if (isMiniApp) {
    return (
      <button
        onClick={handleCast}
        className="px-4 py-2 bg-raid-red text-white rounded hover:bg-raid-red/90 transition-colors"
      >
        {buttonText}
      </button>
    );
  }

  return (
    <Link
      href={`${FARCASTER_SHARE_URL}/${routePath}`}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 bg-raid-red text-white rounded hover:bg-raid-red/90 transition-colors"
    >
      {buttonText}
    </Link>
  );
}
