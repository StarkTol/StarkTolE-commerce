import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export async function GET() {
  try {
    console.log("📋 Fetching recent test users from database...");
    
    await connectDB();
    
    // Find users that match our test patterns
    const testUsers = await User.find({
      $or: [
        { _id: { $regex: /^test_user_/ } },
        { _id: { $regex: /^debug_user_/ } },
        { email: { $regex: /testuser.*@example\.com/ } },
        { email: { $regex: /debug@example\.com/ } }
      ]
    })
    .sort({ createdAt: -1, _id: -1 })
    .limit(5)
    .select('_id name email imageUrl createdAt updatedAt');

    console.log(`Found ${testUsers.length} test users`);

    return NextResponse.json({
      success: true,
      message: `Found ${testUsers.length} recent test users`,
      users: testUsers,
      totalFound: testUsers.length,
      note: "These are test users created by the registration test endpoints"
    });

  } catch (error) {
    console.error("❌ Failed to fetch test users:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: "Check your server console and database connection"
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    console.log("🗑️ Cleaning up test users from database...");
    
    await connectDB();
    
    // Delete test users
    const deleteResult = await User.deleteMany({
      $or: [
        { _id: { $regex: /^test_user_/ } },
        { _id: { $regex: /^debug_user_/ } },
        { email: { $regex: /testuser.*@example\.com/ } },
        { email: { $regex: /debug@example\.com/ } }
      ]
    });

    console.log(`Deleted ${deleteResult.deletedCount} test users`);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} test users`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error("❌ Failed to clean up test users:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: "Check your server console and database connection"
      },
      { status: 500 }
    );
  }
}
