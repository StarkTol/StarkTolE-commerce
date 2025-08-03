import { connectDB } from "@/lib/mongo";
import User from "@/models/User.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-cartItems'); // Don't expose cart items in list
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newUser = await User.create({
      _id: body.id || `user_${Date.now()}`,
      name: body.name || "Test User",
      email: body.email || "test@example.com",
      imageUrl: body.imageUrl || "https://example.com/avatar.png",
      cartItems: {},
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
