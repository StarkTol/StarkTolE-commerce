import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function POST() {
  try {
    console.log("🗑️ Testing user deletion event...");
    
    // Generate test user deletion data
    const timestamp = Date.now();
    const testUserDeletion = {
      id: `user_deleted_${timestamp}`,
      email_addresses: [{ 
        email_address: `deleted-user-${timestamp}@example.com`
      }],
      image_url: "https://images.clerk.dev/default-avatar.png",
      username: `deleteduser${timestamp}`,
      first_name: "Deleted",
      last_name: "User",
      deleted_at: timestamp
    };

    console.log("Generated user deletion data:", testUserDeletion);

    // Send user.deleted event to Inngest
    const inngestResult = await inngest.send({
      name: "user.deleted",
      data: testUserDeletion,
    });
    
    console.log("✅ User deletion event sent successfully:", inngestResult);

    return NextResponse.json({
      success: true,
      message: "User deletion event sent to Inngest",
      testData: {
        user: testUserDeletion,
        inngestEventId: inngestResult.ids?.[0]
      },
      nextSteps: [
        "Check Inngest dashboard at http://127.0.0.1:8288",
        "Look for the userDeleted function run",
        "The function will attempt to delete this user from the database",
        "Since this is a test user, it may not exist in the database"
      ]
    });

  } catch (error) {
    console.error("❌ User deletion test failed:", error);
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
    message: "User Deletion Test Endpoint",
    description: "This endpoint simulates a user.deleted event for testing",
    usage: "POST /api/test-user-deletion",
    note: "This will trigger the userDeleted Inngest function"
  });
}
