// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { buffer } from "micro";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // Required to get raw body
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("clerk-signature") || "";
  const secret = process.env.CLERK_WEBHOOK_SECRET || "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Example: handle user.created
  if (event.type === "user.created") {
    const user = event.data;
    console.log("🧑 New Clerk user created:", user);
    // You could save user to MongoDB here
  }

  return NextResponse.json({ received: true });
}
