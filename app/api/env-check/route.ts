import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      hasInngestEventKey: !!process.env.INNGEST_EVENT_KEY,
      hasInngestSigningKey: !!process.env.INNGEST_SIGNING_KEY,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
      // Show first few characters of keys for debugging (safely)
      inngestEventKey: process.env.INNGEST_EVENT_KEY ? 
        process.env.INNGEST_EVENT_KEY.substring(0, 10) + "..." : "NOT_SET",
      inngestSigningKey: process.env.INNGEST_SIGNING_KEY ? 
        process.env.INNGEST_SIGNING_KEY.substring(0, 15) + "..." : "NOT_SET",
    };

    return NextResponse.json({
      success: true,
      environment: envStatus,
      message: "Environment variables status check"
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
