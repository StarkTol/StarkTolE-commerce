import connectDB from "@/config/db";
import User from "@/models/User";

interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
  image_url: string;
  username?: string;
}

export async function syncUserWithDB(user: ClerkUser) {
  try {
    await connectDB();

    const { id, email_addresses, image_url, username } = user;
    const primaryEmail = email_addresses?.[0]?.email_address || "";

    // Using updateOne instead of updateById for simpler TypeScript compatibility
    await User.updateOne(
      { _id: id },
      {
        $set: {
          _id: id,
          email: primaryEmail,
          imageUrl: image_url,
          name: username || "New User",
        },
      },
      { upsert: true }
    );

    console.log(`User ${id} synced with DB`);
  } catch (error) {
    console.error("Error syncing user with DB:", error);
  }
}
