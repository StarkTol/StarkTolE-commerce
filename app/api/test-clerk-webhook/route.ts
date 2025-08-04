import { NextResponse } from "next/server";
import { Webhook } from 'svix';

export async function POST() {
  try {
    console.log("🔗 Testing Clerk webhook simulation...");
    
    // Generate unique test user data that matches Clerk's webhook format exactly
    const timestamp = Date.now();
    const testWebhookPayload = {
      type: "user.created",
      data: {
        id: `user_${timestamp}`,
        email_addresses: [{ 
          email_address: `webhook-test-${timestamp}@example.com`,
          id: `idn_${timestamp}`,
          object: "email_address",
          verification: {
            status: "verified",
            strategy: "email_code"
          }
        }],
        image_url: "https://images.clerk.dev/default-avatar.png",
        username: `webhooktest${timestamp}`,
        first_name: "Webhook",
        last_name: "Test",
        created_at: timestamp,
        updated_at: timestamp,
        object: "user",
        external_accounts: [],
        phone_numbers: [],
        web3_wallets: [],
        profile_image_url: "https://images.clerk.dev/default-avatar.png",
        primary_email_address_id: `idn_${timestamp}`,
        primary_phone_number_id: null,
        primary_web3_wallet_id: null,
        last_sign_in_at: null,
        banned: false,
        locked: false,
        lockout_expires_in_seconds: null,
        verification_attempts_remaining: 3
      },
      object: "event",
      created_at: timestamp
    };

    console.log("Generated webhook payload:", testWebhookPayload);

    // Create proper webhook signature using the webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not configured");
    }

    const payload = JSON.stringify(testWebhookPayload);
    const wh = new Webhook(webhookSecret);
    
    // Generate proper webhook headers with valid signature
    const svixId = `msg_${timestamp}`;
    const svixTimestamp = Math.floor(Date.now() / 1000);
    
    // Create the signature manually using svix  
    const headers = wh.sign(svixId, new Date(svixTimestamp * 1000), payload);
    
    console.log("Generated webhook headers:", {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp.toString(),
      'svix-signature': headers['svix-signature']
    });

    // Call our webhook endpoint with proper headers
    const webhookUrl = "http://localhost:3000/api/webhook/clerk";
    console.log(`Calling webhook endpoint: ${webhookUrl}`);

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp.toString(),
          "svix-signature": headers['svix-signature']
        },
        body: payload
      });

      const webhookResult = await webhookResponse.json();
      console.log("Webhook response status:", webhookResponse.status);
      console.log("Webhook response body:", webhookResult);

      return NextResponse.json({
        success: true,
        message: "Clerk webhook test completed successfully",
        testData: {
          payload: testWebhookPayload,
          headers: {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp.toString(),
            'svix-signature': headers['svix-signature']
          },
          webhookResponse: {
            status: webhookResponse.status,
            body: webhookResult,
            ok: webhookResponse.ok
          }
        },
        results: {
          signatureValid: webhookResponse.ok,
          eventProcessed: webhookResult?.processed || false,
          inngestEventId: webhookResult?.inngestEventId,
          userId: testWebhookPayload.data.id
        },
        nextSteps: [
          "Check your Next.js console for detailed webhook processing logs",
          "Look for the Inngest event in the dashboard at http://127.0.0.1:8288",
          "Verify the user was created in your MongoDB database",
          "Check that the userCreated function was triggered"
        ]
      });

    } catch (fetchError) {
      console.error("Webhook call failed:", fetchError);
      return NextResponse.json({
        success: false,
        error: "Failed to call webhook endpoint",
        details: fetchError instanceof Error ? fetchError.message : String(fetchError),
        testData: {
          payload: testWebhookPayload,
          headers: {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp.toString(),
            'svix-signature': headers['svix-signature']
          }
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Clerk webhook test failed:", error);
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
    message: "Clerk Webhook Test Endpoint",
    description: "This endpoint simulates a real Clerk webhook call with proper signature validation",
    usage: "POST /api/test-clerk-webhook",
    features: [
      "Generates properly signed webhook payload",
      "Uses real Clerk webhook format",
      "Tests signature verification",
      "Triggers Inngest events",
      "Provides detailed test results"
    ],
    note: "This test uses the actual CLERK_WEBHOOK_SECRET for signature validation"
  });
}
