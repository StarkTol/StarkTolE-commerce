import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔗 Testing webhook endpoint simulation...");
    
    // Generate unique test user data that matches Clerk's webhook format
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
            status: "verified"
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
        web3_wallets: []
      },
      object: "event",
      created_at: timestamp
    };

    console.log("Generated webhook payload:", testWebhookPayload);

    // Create mock headers that Clerk would send
    const mockHeaders = {
      "Content-Type": "application/json",
      "svix-id": `msg_${timestamp}`,
      "svix-timestamp": Math.floor(Date.now() / 1000).toString(),
      "svix-signature": "v1,mock_signature_for_testing"
    };

    console.log("Mock webhook headers:", mockHeaders);

    // Call our own webhook endpoint
    const webhookUrl = "http://localhost:3000/api/webhook/clerk";
    console.log(`Calling webhook endpoint: ${webhookUrl}`);

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: mockHeaders,
        body: JSON.stringify(testWebhookPayload)
      });

      const webhookResult = await webhookResponse.text();
      console.log("Webhook response status:", webhookResponse.status);
      console.log("Webhook response body:", webhookResult);

      return NextResponse.json({
        success: true,
        message: "Webhook test completed",
        testData: {
          payload: testWebhookPayload,
          headers: mockHeaders,
          webhookResponse: {
            status: webhookResponse.status,
            body: webhookResult,
            ok: webhookResponse.ok
          }
        },
        note: "This test will likely fail signature verification, which is expected for testing",
        nextSteps: [
          "Check your Next.js console for webhook processing logs",
          "Look for any Inngest events triggered by this webhook",
          "Monitor the Inngest dashboard at http://127.0.0.1:8288",
          "For real testing, use the comprehensive registration test instead"
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
          headers: mockHeaders
        }
      });
    }

  } catch (error) {
    console.error("❌ Webhook test failed:", error);
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
    message: "Webhook Test Endpoint",
    description: "This endpoint simulates a Clerk webhook call to test the webhook processing flow",
    usage: "POST /api/test-webhook",
    note: "This will likely fail signature verification, which is expected for testing purposes",
    recommendation: "Use POST /api/test-user-registration for comprehensive testing instead"
  });
}
