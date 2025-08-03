// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Temporary mock response - cloudinary integration will be re-added once deployment is stable
    // For now, return a placeholder URL to allow the app to deploy successfully
    const mockUrl = `https://via.placeholder.com/400x400/cccccc/000000?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({ 
      url: mockUrl,
      message: "File upload temporarily disabled - using placeholder image"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
