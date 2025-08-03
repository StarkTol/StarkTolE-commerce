import connectDB from "@/config/db";
import User from "@/models/User";

export async function syncUserWithDB(clerkUser: any) {
  await connectDB();

  const { id, email_addresses, image_url, full_name } = clerkUser;

  const primaryEmail = email_addresses?.[0]?.email_address || "";

  try {
    // Use type assertion to bypass TypeScript union type issues
    const UserModel = User as any;
    
    await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          name: full_name || "",
          email: primaryEmail,
          imageUrl: image_url || "",
        },
        $setOnInsert: {
          cartItems: {},
        }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error syncing user with database:", error);
    throw error;
  }
}
