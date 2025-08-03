import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Received event data:", body);
    
    // Mock event object that matches Inngest's format
    const mockEvent = {
      name: body.name || "user.created",
      data: {
        userId: body.userId,
        email: body.email,
        ...body.data
      },
      id: `evt_${Date.now()}`,
      ts: Date.now()
    };
    
    // Simulate the function logic directly
    console.log("Clerk user created:", mockEvent.data);
    const result = { message: "Handled user.created event" };
    
    console.log("Function execution result:", result);

    return NextResponse.json({ 
      success: true, 
      message: "Event processed successfully",
      event: mockEvent,
      result: result
    });
  } catch (error) {
    console.error("Error processing event:", error);
    return NextResponse.json(
      { 
        error: "Failed to process event",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
