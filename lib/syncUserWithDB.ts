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

    // Find existing user first
    const existingUser = await User.findById(id);
    
    if (existingUser) {
      // Update existing user
      existingUser.email = primaryEmail;
      existingUser.imageUrl = image_url;
      existingUser.name = username || "New User";
      await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({
        _id: id,
        email: primaryEmail,
        imageUrl: image_url,
        name: username || "New User",
        cartItems: {},
      });
      await newUser.save();
    }

    console.log(`User ${id} synced with DB`);
  } catch (error) {
    console.error("Error syncing user with DB:", error);
  }
}
