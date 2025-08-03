// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Dynamic import for cloudinary to avoid module resolution issues
    const { v2: cloudinary } = await import("cloudinary");
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
    
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<NextResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error || !result) {
            resolve(
              NextResponse.json(
                { error: error?.message || "Upload failed" },
                { status: 500 }
              )
            );
          } else {
            resolve(NextResponse.json({ url: result.secure_url }));
          }
        }
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary import error:", error);
    return NextResponse.json(
      { error: "Failed to load cloudinary module" },
      { status: 500 }
    );
  }
}
