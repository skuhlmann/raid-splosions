import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // First, analyze the image with GPT-4 Vision
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in one sentence. Focus on the visual features and scene content and highlight the main subject.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 100,
    });

    const imageDescription = visionResponse.choices[0].message.content;

    console.log("imagaDescription", imageDescription);

    // Generate contextual explosion prompt
    const explosionPrompt = `Create a really large and chaotic pixel art explosion that would dramatically impact this scene: ${imageDescription}.
    Requirements:
    - Replicate the described scene in 8-bit retro game style, except add an explosion coming from the main subject in the scene. He main subject is blowing up. 
    - Use only bright orange, red, and yellow colors in the pixel art explosion graphic
    - Dramatic effect that matches the scene's scale and content`;

    // Generate the explosion image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: explosionPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image URL received from OpenAI");
    }

    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error("Failed to fetch generated image");
    }

    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${imageBlob.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      description: imageDescription,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process image",
      },
      { status: 500 }
    );
  }
}
