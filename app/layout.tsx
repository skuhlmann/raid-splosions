import "./globals.css";
import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import Providers from "@/components/providers/providers";

const coreFont = Chivo({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Splosions",
  description: "Light the fuse",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={coreFont.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {children}
            <footer className="fixed bottom-0 left-0 w-full h-[50px] bg-raid-dark text-raid-red flex items-center justify-end pr-8">
              <div className="flex items-center gap-2 text-sm">
                <span>🖤</span>
                <span>from</span>
                <a
                  href="https://www.raidguild.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/swords.svg"
                    alt="Raid Guild"
                    width={16}
                    height={16}
                  />
                </a>
              </div>
            </footer>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
