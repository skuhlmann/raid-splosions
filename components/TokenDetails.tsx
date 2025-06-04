"use client";

import { createPublicClient, http } from "viem";
import { TARGET_CHAIN, FARCASTER_SHARE_URL } from "@/lib/constants";
import abi from "@/lib/abis/erc721.json";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import CastButton from "@/components/CastButton";

interface TokenDetailsProps {
  tokenid: string;
}

interface TokenData {
  name?: string;
  description?: string;
  image?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

export default function TokenDetails({ tokenid }: TokenDetailsProps) {
  const [tokenData, setTokenData] = useState<TokenData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string>(
    "https://daohaus.mypinata.cloud/ipfs/bafybeieauz7y6j7vpsvkgh4ggsbr6acmb76bxczfoomai3tvohh5diavoi"
  );

  useEffect(() => {
    const fetchTokenData = async () => {
      setIsLoading(true);
      try {
        const publicClient = createPublicClient({
          chain: TARGET_CHAIN,
          transport: http(),
        });

        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "tokenURI",
          args: [tokenid],
        });

        // Remove the "data:application/json;base64," prefix if it exists
        const base64Data = (data as string).replace(
          "data:application/json;base64,",
          ""
        );

        // Decode the base64 string to JSON
        const decodedData = JSON.parse(
          Buffer.from(base64Data, "base64").toString()
        );
        setTokenData(decodedData);

        if (decodedData && decodedData.image) {
          const hash = decodedData.image.split("//")[1];
          if (hash) {
            setImage(`https://daohaus.mypinata.cloud/ipfs/${hash}`);
          }
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, [tokenid]);

  console.log("tokenData", tokenData);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-raid-red"></div>
        <p className="mt-4 text-gray-600">Loading token data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="w-64 h-64 rounded-full overflow-hidden">
        <img
          src={image}
          alt={tokenData.name || "Token Image"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{tokenData.name}</h1>
        <p className="text-gray-600 mb-1">{tokenData.description}</p>
        {tokenData.attributes && (
          <p className="text-raid-red mb-4">@{tokenData.attributes[0].value}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center">
        <CastButton
          routePath={`/splosion/${tokenid}`}
          buttonText="Cast"
          text={
            tokenData.attributes &&
            `I blew something up @${tokenData.attributes[0].value}`
          }
        />
        <Link href="/" className="text-xs text-raid-red hover:underline">
          splode something
        </Link>
      </div>
    </div>
  );
}
