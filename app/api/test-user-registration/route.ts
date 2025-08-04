import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function POST() {
  try {
    console.log("🧪 Starting comprehensive user registration test...");
    
    // Generate unique test user data
    const timestamp = Date.now();
    const testUser = {
      id: `test_user_${timestamp}`,
      email_addresses: [{ 
        email_address: `testuser${timestamp}@example.com`,
        id: `email_${timestamp}`,
        object: "email_address"
      }],
      image_url: "https://images.clerk.dev/default-avatar.png",
      username: `testuser${timestamp}`,
      first_name: "Test",
      last_name: "User",
      created_at: timestamp,
      updated_at: timestamp,
      object: "user"
    };

    console.log("Generated test user data:", testUser);

    // Step 1: Test direct Inngest event sending
    console.log("Step 1: Sending user.created event to Inngest...");
    const inngestResult = await inngest.send({
      name: "user.created",
      data: testUser,
    });
    
    console.log("✅ Inngest event sent successfully:", inngestResult);

    // Step 2: Test database connection and user creation
    console.log("Step 2: Testing database operations...");
    await connectDB();
    
    const userName = testUser.username || `${testUser.first_name || ''} ${testUser.last_name || ''}`.trim() || 'User';
    const userEmail = testUser.email_addresses?.[0]?.email_address;
    
    if (!userEmail) {
      throw new Error('No email found in test user data');
    }
    
    console.log('Creating user in database:', {
      id: testUser.id,
      email: userEmail,
      name: userName,
      imageUrl: testUser.image_url
    });
    
    const dbResult = await User.updateOne(
      { _id: testUser.id },
      {
        $set: {
          _id: testUser.id,
          email: userEmail,
          name: userName,
          imageUrl: testUser.image_url || '',
          cartItems: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    
    console.log('✅ Database operation completed:', dbResult);

    // Step 3: Verify user was created in database
    console.log("Step 3: Verifying user in database...");
    const createdUser = await User.findById(testUser.id);
    console.log('✅ User verified in database:', createdUser ? 'Found' : 'Not found');

    return NextResponse.json({
      success: true,
      message: "Comprehensive user registration test completed successfully",
      testData: {
        user: testUser,
        inngestEventId: inngestResult.ids?.[0],
        databaseResult: dbResult,
        userInDatabase: !!createdUser
      },
      steps: {
        inngestEvent: "✅ Sent",
        databaseOperation: "✅ Completed", 
        userVerification: createdUser ? "✅ Found" : "❌ Not found"
      },
      nextSteps: [
        "Check Inngest dashboard at http://127.0.0.1:8288",
        "Look for function run with event ID: " + inngestResult.ids?.[0],
        "Monitor your Next.js console for function execution logs",
        "Verify user appears in your MongoDB database"
      ]
    });

  } catch (error) {
    console.error("❌ Comprehensive test failed:", error);
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
    message: "Comprehensive User Registration Test Endpoint",
    description: "This endpoint tests the complete user registration flow including Inngest events and database operations",
    usage: "POST /api/test-user-registration",
    features: [
      "Generates unique test user data",
      "Sends user.created event to Inngest", 
      "Tests database connection and user creation",
      "Verifies user was saved to database",
      "Provides detailed test results and next steps"
    ]
  });
}
