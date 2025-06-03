"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { MintButton } from "@/components/MintButton";
import { RotateCcw, Search } from "lucide-react";
import { ConfettiExplosion } from "react-confetti-explosion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFrameSDK } from "./providers/frame-provider";

// Add keyframes for explosion animation
const explosionAnimation = `
  @keyframes shake {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(-5px, -5px) rotate(-2deg) scale(1.1); }
    50% { transform: translate(5px, 5px) rotate(2deg) scale(0.9); }
    75% { transform: translate(-5px, 5px) rotate(-2deg) scale(1.05); }
  }
`;

interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

export default function Splosion() {
  const { context, isMiniApp } = useFrameSDK();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [fuseText, setFuseText] = useState("s.....");
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FarcasterUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<FarcasterUser | null>(null);
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setFuseText((prev) => "s" + prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/username?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setSearchResults(data.result.users);
      } catch (err) {
        console.error("Error searching users:", err);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setGeneratedImageUrl(null);
    setImageDescription(null);
  };

  const handleUserSelect = (user: FarcasterUser) => {
    setSelectedUser(user);
    setSelectedFile(null);
    setError(null);
    setGeneratedImageUrl(null);
    setImageDescription(null);
  };

  const handleConfirm = async () => {
    if (!selectedFile && !selectedUser) return;

    setIsGenerating(true);
    setError(null);
    setFuseText("s.....");
    setShowConfetti(false);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (selectedUser) {
        console.log("selectedUser", selectedUser);
        formData.append("pfp_url", selectedUser.pfp_url);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageDescription(data.description);
      setGeneratedImageUrl(data.url);
      setShowConfetti(true);
    } catch (err) {
      console.error("Generation error:", err);
      setError("IT WAS A DUD! OpenAI doesn't want to blow this up :(.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedUser(null);
    setGeneratedImageUrl(null);
    setImageDescription(null);
    setError(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleBlowMeUp = () => {
    if (!context?.user?.pfpUrl) return;
    handleUserSelect({
      fid: context.user.fid!,
      username: context.user.username!,
      display_name: context.user.displayName!,
      pfp_url: context.user.pfpUrl,
    });
  };

  return (
    <main className="min-h-screen px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[3.5rem] font-bold text-center mb-4 uppercase text-raid-red">
          Splosions!
        </h1>

        <div className="w-full max-w-2xl mx-auto">
          {!selectedFile && !selectedUser ? (
            <div className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className={`grid w-full ${
                    !isMiniApp ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {!isMiniApp && (
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  )}
                  <TabsTrigger
                    value="search"
                    className={`${isMiniApp ? "hover:cursor-default" : ""}`}
                  >
                    Who should blow up?
                  </TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  {activeTab === "upload" ? (
                    <ImageUpload onImageSelect={handleImageSelect} />
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search Farcaster username..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {searchResults.map((user) => (
                            <button
                              key={user.fid}
                              onClick={() => handleUserSelect(user)}
                              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                              <img
                                src={user.pfp_url}
                                alt={user.username}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="text-left">
                                <p className="font-medium">
                                  {user.display_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  @{user.username}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : isMiniApp && context?.user?.pfpUrl ? (
                        <div className="flex flex-col items-center gap-4 mt-8">
                          <img
                            src={context.user.pfpUrl}
                            alt={context.user.username}
                            className="w-32"
                          />
                          <Button
                            onClick={handleBlowMeUp}
                            variant="default"
                            className="bg-raid-red hover:bg-raid-red/90"
                          >
                            Blow me up
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative p-8">
                {generatedImageUrl ? (
                  <div className="relative">
                    <style>{explosionAnimation}</style>
                    {showConfetti && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <ConfettiExplosion
                          force={0.8}
                          duration={3000}
                          particleCount={200}
                          particleSize={4}
                          colors={[
                            "#ff4500",
                            "#ff8c00",
                            "#ffd700",
                            "#808080",
                            "#a52a2a",
                            "#8b0000",
                          ]}
                          width={1600}
                          height={1600}
                        />
                      </div>
                    )}
                    <img
                      src={generatedImageUrl}
                      alt="Generated Explosion"
                      className="w-full h-full object-contain min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px] animate-[shake_1s_ease-in-out_1]"
                    />
                  </div>
                ) : selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-full object-contain min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px]"
                  />
                ) : (
                  selectedUser && (
                    <img
                      src={selectedUser.pfp_url}
                      alt={selectedUser.username}
                      className="w-full h-full object-contain min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px]"
                    />
                  )
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive mt-2 w-full">{error}</p>
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center gap-4">
                  {!generatedImageUrl && (
                    <>
                      <Button
                        onClick={handleConfirm}
                        disabled={isGenerating || Boolean(error)}
                        variant="outline"
                        size="lg"
                        className="text-3xl h-16 px-8 border-raid-dark"
                      >
                        🧨
                      </Button>
                      <Button
                        onClick={handleClear}
                        disabled={isGenerating}
                        variant="ghost"
                        size="lg"
                        className="h-16 px-4 text-raid-red border-raid-dark"
                      >
                        <RotateCcw className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                  {isGenerating && (
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-lg text-primary animate-pulse">
                      {fuseText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <MintButton
                    generatedImageUrl={generatedImageUrl}
                    username={selectedUser?.username}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
