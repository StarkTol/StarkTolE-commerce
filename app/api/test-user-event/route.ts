import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST() {
  try {
    console.log("Sending test user.created event...");
    
    // Send a test user.created event to Inngest
    const result = await inngest.send({
      name: "user.created",
      data: {
        id: "test_clerk_user_" + Date.now(),
        email_addresses: [{ email_address: "testuser@example.com" }],
        image_url: "https://example.com/avatar.png",
        username: "testuser",
        first_name: "Test",
        last_name: "User"
      },
    });

    console.log("User.created event sent successfully:", result);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test user.created event sent to Inngest",
      eventId: result.ids?.[0],
      result: result
    });
  } catch (error) {
    console.error("Error sending user.created event:", error);
    console.error("Error details:", error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send user.created event",
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to send a test user.created event to Inngest",
    endpoint: "/api/test-user-event",
    method: "POST"
  });
}
