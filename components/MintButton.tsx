import { Button } from "@/components/ui/button";
import frameSDK from "@farcaster/frame-sdk";

import {
  MINT_PRICE,
  TARGET_CHAIN,
  CONTRACT_ADDRESS,
  EXPLORER_URL,
  DEFAULT_FARCASTER,
} from "@/lib/constants";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import erc721Abi from "@/lib/abis/erc721.json";
import { ExternalLink } from "lucide-react";
import { InfoModal } from "./InfoModal";
import { useFrameSDK } from "./providers/frame-provider";
import CastButton from "./CastButton";

interface MintButtonProps {
  generatedImageUrl: string | null;
  username?: string;
}

export function MintButton({ generatedImageUrl, username }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, chain, address } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract tokenId from receipt when available
  useEffect(() => {
    if (receipt && !tokenId) {
      console.log("Transaction Receipt:", receipt);
      const newTokenId = receipt.logs[2].topics[3];
      if (newTokenId) {
        console.log("Extracted TokenId:", newTokenId);
        setTokenId(newTokenId);
      }
    }
  }, [receipt, tokenId]);

  useEffect(() => {
    if (writeError) {
      console.log("Write Contract Error:", writeError);
      setError("Failed to mint NFT");
      setIsMinting(false);
    }
  }, [writeError]);

  const handleMint = async () => {
    if (!generatedImageUrl) return;
    setIsMinting(true);
    setTokenId(null);
    setError(null);

    try {
      // 1. Upload to Pinata
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, `${address}_splosion.png`);

      const pinataResponse = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!pinataResponse.ok) {
        const errorData = await pinataResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload to Pinata");
      }

      const { cid } = await pinataResponse.json();
      console.log("Uploaded to Pinata, CID:", cid);
      setCid(cid);

      const name = username || DEFAULT_FARCASTER;
      console.log("minting to ", name);

      // 2. Mint NFT
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: erc721Abi,
        functionName: "mint",
        args: [cid, name],
        value: BigInt(MINT_PRICE),
      });
    } catch (err) {
      console.error("Minting error:", err);
      setError(err instanceof Error ? err.message : "Failed to mint NFT");
      setIsMinting(false);
    }
  };

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleSwitchChain = () => {
    switchChain({ chainId: TARGET_CHAIN.id });
  };

  if (!generatedImageUrl) return null;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleConnect}
          variant="default"
          size="lg"
          className="text-xl h-16 px-8 bg-raid-red hover:bg-raid-red/90"
        >
          Connect Wallet to Mint
        </Button>
      </div>
    );
  }

  if (chain?.id !== TARGET_CHAIN.id) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleSwitchChain}
          variant="default"
          size="lg"
          className="text-xl h-16 px-8 bg-raid-red hover:bg-raid-red/90"
        >
          Switch to {TARGET_CHAIN.name}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {!isSuccess ? (
        <div className="flex items-center gap-4">
          <Button
            onClick={handleMint}
            disabled={isMinting || isConfirming}
            variant="default"
            size="lg"
            className="text-xl h-16 px-8 bg-raid-red hover:bg-raid-red/90"
          >
            {isMinting
              ? "Minting..."
              : isConfirming
              ? "Confirming..."
              : `Mint (${formatEther(BigInt(MINT_PRICE))} ETH)`}
          </Button>
          {generatedImageUrl && <InfoModal />}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-raid-red font-bold">
            {tokenId
              ? `You have Splosion # ${parseInt(tokenId, 16).toString()}`
              : "Success"}
          </p>
          <div className="flex items-center gap-4">
            <CastButton
              routePath={
                tokenId ? `splosion/${parseInt(tokenId, 16).toString()}` : ""
              }
              buttonText="Cast Your Splosion"
              text={`I lit the fuse @${username}`}
            />
          </div>
          {tokenId && (
            <a
              href={`${EXPLORER_URL}?a=${
                tokenId ? parseInt(tokenId, 16).toString() : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View on Explorer <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive my-2 text-center">{error}</p>
      )}
    </div>
  );
}
