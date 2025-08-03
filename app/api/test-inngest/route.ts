// app/api/test-inngest/route.ts
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST() {
  try {
    // Send a test user.created event to Inngest
    const result = await inngest.send({
      name: "user.created",
      data: {
        id: "test_user_" + Date.now(),
        first_name: "Test",
        last_name: "User",
        email_addresses: [{ email_address: "test@example.com" }],
        image_url: "https://example.com/avatar.png",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Test event sent to Inngest",
      eventId: result.ids[0]
    });
  } catch (error) {
    console.error("Error sending test event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send test event" },
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
