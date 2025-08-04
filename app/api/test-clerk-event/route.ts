import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST() {
  try {
    console.log("🧪 Testing clerk/user.created event...");
    
    // Send a clerk/user.created event directly
    const testEvent = {
      name: "clerk/user.created",
      data: {
        id: `clerk_test_${Date.now()}`,
        email_addresses: [{ 
          email_address: `clerktest${Date.now()}@example.com`
        }],
        image_url: "https://images.clerk.dev/default-avatar.png",
        username: `clerktest${Date.now()}`,
        first_name: "Clerk",
        last_name: "Test",
        created_at: Date.now(),
        updated_at: Date.now()
      }
    };

    console.log("Sending clerk/user.created event:", testEvent);

    const result = await inngest.send(testEvent);
    
    console.log("✅ Clerk event sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "clerk/user.created event sent to Inngest",
      eventName: testEvent.name,
      eventId: result.ids?.[0],
      testData: testEvent,
      note: "This should trigger the sync-user-to-db function if it's listening for clerk/user.created"
    });

  } catch (error) {
    console.error("❌ Clerk event test failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: "Check your server console for detailed error logs"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Clerk Event Test Endpoint",
    description: "This endpoint tests sending clerk/user.created events",
    usage: "POST /api/test-clerk-event",
    note: "This will test if your functions are listening for the correct clerk/ prefixed event names"
  });
}
