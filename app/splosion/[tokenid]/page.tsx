import { Metadata } from "next";
import TokenDetails from "@/components/TokenDetails";

const appUrl = process.env.NEXT_PUBLIC_URL;

type Props = {
  params: Promise<{ tokenid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tokenid } = await params;

  // const imageUrl = new URL(
  //   `${process.env.NEXT_PUBLIC_URL}/api/splosion/${tokenid}}`
  // );

  const frame = {
    version: "next",
    imageUrl: `${process.env.NEXT_PUBLIC_URL}/api/splosion/${tokenid}`,
    button: {
      title: "I blew something up",
      action: {
        type: "launch_frame",
        name: "Splosions",
        url: `${appUrl}/splosion/${tokenid}`,
        iconImageUrl: `${appUrl}/fire_lamp.svg`,
        splashImageUrl: `${appUrl}/swords.svg`,
        splashBackgroundColor: "#000000",
      },
    },
  };
  return {
    title: "Splosions",
    openGraph: {
      title: "Splosions",
      description: "I blew something up",
      images: [
        { url: `${process.env.NEXT_PUBLIC_URL}/api/splosion/${tokenid}` },
      ],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
      "fc:frame:image": `${`${process.env.NEXT_PUBLIC_URL}/api/splosion/${tokenid}`}`,
      "fc:frame:button:1": "Lite the fuse",
    },
  };
}

export default async function Page({ params }: Props) {
  const { tokenid } = await params;
  return <TokenDetails tokenid={tokenid} />;
}
