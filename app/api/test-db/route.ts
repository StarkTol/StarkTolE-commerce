// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test connection
    await connectDB();
    console.log("✅ Database connected successfully");
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in database`);
    
    // Get all users (limit to 10 for testing)
    const users = await User.find({}).limit(10).select('_id name email imageUrl createdAt updatedAt');
    console.log("Users found:", users);
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      users,
      databaseName: "starktol-ecommerce"
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectDB();
    
    // Create a test user
    const testUser = {
      _id: "test_user_" + Date.now(),
      name: "Test User",
      email: "test" + Date.now() + "@example.com",
      imageUrl: "https://example.com/avatar.png",
      cartItems: {}
    };
    
    const result = await User.create(testUser);
    console.log("Test user created:", result);
    
    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: result
    });
  } catch (error) {
    console.error("Failed to create test user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
