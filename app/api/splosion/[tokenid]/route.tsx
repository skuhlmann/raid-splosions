/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createPublicClient, http } from "viem";
import { base, sepolia } from "viem/chains";

import abi from "../../../../lib/abis/erc721.json";
import { CONTRACT_ADDRESS, TARGET_CHAIN } from "@/lib/constants";

// Force dynamic rendering to ensure fresh image generation on each request
export const dynamic = "force-dynamic";

// Define the dimensions for the generated OpenGraph image
const size = {
  // width: 600,
  // height: 400,
  width: 1200,
  height: 630,
};

/**
 * GET handler for generating dynamic OpenGraph images
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the ID
 * @returns ImageResponse - A dynamically generated image for OpenGraph
 */
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      tokenid: string;
    }>;
  }
) {
  const { tokenid } = await params;

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
  const decodedData = JSON.parse(Buffer.from(base64Data, "base64").toString());

  console.log("decoded data", decodedData);

  let image =
    "https://daohaus.mypinata.cloud/ipfs/bafybeieauz7y6j7vpsvkgh4ggsbr6acmb76bxczfoomai3tvohh5diavoi";

  if (decodedData && decodedData.image) {
    const hash = decodedData.image.split("//")[1];
    console.log("hash", hash);
    if (hash) {
      image = `https://daohaus.mypinata.cloud/ipfs/${hash}`;
    }
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#29100a",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
            color: "#a8452c", // Changed default text color
          }}
        >
          {/* Card-like container */}
          <div
            style={{
              background: "#29100a",
              height: "100%",
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              <img
                src={image}
                alt="splosion"
                style={{
                  width: "600",
                  height: "600",
                  borderRadius: "100%",
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    // Log and handle any errors during image generation
    console.log(`Failed to generate yeet image`, e);
    return new Response(`Failed to generate yeet image`, {
      status: 500,
    });
  }
}
