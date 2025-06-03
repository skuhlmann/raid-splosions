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
    const pfpUrl = formData.get("pfp_url") as string;

    if (!imageFile && !pfpUrl) {
      return NextResponse.json(
        { error: "No image or profile picture URL provided" },
        { status: 400 }
      );
    }

    let base64Image: string;

    if (imageFile) {
      // Handle direct file upload
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = buffer.toString("base64");
    } else if (pfpUrl) {
      // Handle profile picture URL
      const imageResponse = await fetch(pfpUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch profile picture");
      }
      const imageBlob = await imageResponse.blob();
      const arrayBuffer = await imageBlob.arrayBuffer();
      base64Image = Buffer.from(arrayBuffer).toString("base64");
    } else {
      throw new Error("No valid image source provided");
    }

    const descriptionPrompt = `Please analyze the following image.

1. Describe what is depicted in the image in one or two sentences.
2. Describe the visual style of the image (e.g. realistic, cartoon, pixel art, painted, 3D rendered, etc.).
3. Summarize the color palette and lighting used in the image.

Be concise and specific. The description will be used to guide AI image generation that stylistically matches this image.
    `;

    // First, analyze the image with GPT-4 Vision
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: descriptionPrompt,
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

    console.log("imageDescription", imageDescription);

    // Generate contextual explosion prompt
    const explosionPrompt = `Create a new image that represents an explosion occurring within the scene described below. The new image should:

- Depict the original scene as if it has just been hit by a dramatic explosion
- Match the visual style, color palette, and lighting of the original image
- Include environmental destruction consistent with the scene (e.g. debris, fire, motion blur if appropriate)
- Maintain the same art direction — for example, if the original image is a cartoon, make the explosion cartoon-style; if it's photorealistic, make the explosion look realistic
- You do not need to preserve or copy the original composition exactly — reinterpret it as a version of that scene being destroyed in a vivid, cinematic moment
- Do not include any text or interface elements

Here is the original image context to guide you:

${imageDescription}
`;

    // - Destroy or break apart some of the main subject of the image so it looks like it's being blown into pieces

    // Generate the explosion image
    const response = await openai.images.generate({
      model: "dall-e-3",
      // model: "gpt-4.1-mini",
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
