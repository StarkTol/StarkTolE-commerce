import { NextResponse } from "next/server";

export async function POST() {
  try {
    const syncPayload = {
      url: process.env.NODE_ENV === "production" 
        ? `${process.env.NEXT_PUBLIC_URL}/api/inngest`
        : "http://localhost:3000/api/inngest",
      event_key: process.env.INNGEST_EVENT_KEY,
      signing_key: process.env.INNGEST_SIGNING_KEY,
      app_name: "starktol-ecommerce-app"
    };

    console.log("Syncing with Inngest cloud:", syncPayload);

    // Use the Inngest SDK to register functions
    const response = await fetch("https://api.inngest.com/v1/apps/sync", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.INNGEST_EVENT_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: syncPayload.url,
        signing_key: process.env.INNGEST_SIGNING_KEY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Successfully synced with Inngest cloud",
      result: result
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Failed to sync with Inngest cloud"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to sync with Inngest cloud",
    endpoint: "/api/inngest-sync",
    method: "POST",
    env_vars_needed: ["INNGEST_EVENT_KEY", "INNGEST_SIGNING_KEY"]
  });
}
