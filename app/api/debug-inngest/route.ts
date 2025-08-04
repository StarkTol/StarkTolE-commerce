import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function GET() {
  try {
    console.log("🔍 Debug: Inngest client configuration");
    console.log("- ID:", (inngest as any).id);
    console.log("- Name:", (inngest as any).name);
    console.log("- isDev:", (inngest as any).isDev);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- Has Event Key:", !!process.env.INNGEST_EVENT_KEY);
    console.log("- Has Signing Key:", !!process.env.INNGEST_SIGNING_KEY);

    return NextResponse.json({
      success: true,
      config: {
        id: (inngest as any).id,
        name: (inngest as any).name,
        isDev: (inngest as any).isDev,
        nodeEnv: process.env.NODE_ENV,
        hasEventKey: !!process.env.INNGEST_EVENT_KEY,
        hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
      },
      message: "Check your console for detailed configuration logs"
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    console.log("🧪 Sending debug user.created event...");
    
    const testEvent = {
      name: "user.created",
      data: {
        id: `debug_user_${Date.now()}`,
        email_addresses: [{ email_address: "debug@example.com" }],
        image_url: "https://example.com/debug-avatar.png",
        username: "debuguser",
        first_name: "Debug",
        last_name: "User"
      }
    };

    console.log("Event payload:", testEvent);

    const result = await inngest.send(testEvent);
    
    console.log("✅ Debug event sent successfully:", result);

    return NextResponse.json({
      success: true,
      message: "Debug event sent successfully",
      eventId: result.ids?.[0],
      event: testEvent,
      result: result
    });
  } catch (error) {
    console.error("❌ Debug event failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: "Check your server console for more details"
      },
      { status: 500 }
    );
  }
}
