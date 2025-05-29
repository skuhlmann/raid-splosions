"use client";

import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [fuseText, setFuseText] = useState("s.....");

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setFuseText((prev) => "s" + prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setGeneratedImageUrl(null);
    setImageDescription(null);
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setError(null);
    setFuseText("s.....");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

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
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate explosion effect"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setGeneratedImageUrl(null);
    setImageDescription(null);
    setError(null);
  };

  return (
    <main className="min-h-screen px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-8 uppercase text-raid-red">
          Splosions
        </h1>

        <div className="w-full max-w-2xl mx-auto">
          {!selectedFile ? (
            <ImageUpload onImageSelect={handleImageSelect} />
          ) : (
            <div className="space-y-6">
              <div className="relative border-2 border-dashed rounded-lg p-12">
                {generatedImageUrl ? (
                  <img
                    src={generatedImageUrl}
                    alt="Generated Explosion"
                    className="w-full h-full object-contain max-h-[400px]"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-full object-contain max-h-[400px]"
                  />
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}

              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  {!generatedImageUrl && (
                    <Button
                      onClick={handleConfirm}
                      disabled={isGenerating}
                      variant="outline"
                      size="lg"
                      className="text-3xl h-16 px-8"
                    >
                      🧨
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    size="lg"
                    className="h-16 px-8"
                    disabled={isGenerating}
                  >
                    <RotateCcw className="h-8 w-8" />
                  </Button>
                </div>
                {isGenerating && (
                  <span className="font-mono text-lg text-primary animate-pulse">
                    {fuseText}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
