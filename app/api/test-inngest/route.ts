// app/api/test-inngest/route.ts
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST() {
  try {
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Sending test event to Inngest...");
    
    // Send a test event to Inngest
    const result = await inngest.send({
      name: "test/event",
      data: {
        id: "test_user_" + Date.now(),
        first_name: "Test",
        last_name: "User",
        email_addresses: [{ email_address: "test@example.com" }],
        image_url: "https://example.com/avatar.png",
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Event sent successfully:", result);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test event sent to Inngest",
      eventId: result.ids?.[0],
      result: result
    });
  } catch (error) {
    console.error("Error sending test event:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send test event",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to send a test event to Inngest",
    endpoint: "/api/test-inngest",
    method: "POST"
  });
}
