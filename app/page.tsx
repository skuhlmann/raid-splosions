import { Metadata } from "next";
import Splosion from "@/components/Splosion";

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata(): Promise<Metadata> {
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/splash.png`,
    button: {
      title: "Light the fuse",
      action: {
        type: "launch_frame",
        name: "Splosions",
        url: `${appUrl}`,
        iconImageUrl: `${appUrl}/fire_lamp.svg`,
        splashImageUrl: `${appUrl}/swords.svg`,
        splashBackgroundColor: "#000000",
      },
    },
  };
  return {
    title: "Splosions",
    manifest: "/site.webmanifest",
    description: "Light the fuse",
    openGraph: {
      title: "Splosions",
      description: "Light the fuse",
      images: `${appUrl}/swords.svg`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Page() {
  return <Splosion />;
}
