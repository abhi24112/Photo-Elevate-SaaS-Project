import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Debug what's being received
    const targetWidth = formData.get("target_width");
    const targetHeight = formData.get("target_height");

    console.log(
      `ClipDrop API request - Width: ${targetWidth}, Height: ${targetHeight}`
    );

    const response = await fetch(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.CLIP_DROP_KEY!,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ClipDrop API failed: ${errorText}` },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "x-remaining-credits":
          response.headers.get("x-remaining-credits") || "",
        "x-credits-consumed": response.headers.get("x-credits-consumed") || "",
      },
    });
  } catch (error) {
    console.error("ClipDrop API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
