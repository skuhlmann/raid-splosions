import { NextResponse } from "next/server";
import { neynarClient } from "@/lib/neynar";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "10";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const data = await neynarClient.searchUser({
      q: query,
      limit: parseInt(limit),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
