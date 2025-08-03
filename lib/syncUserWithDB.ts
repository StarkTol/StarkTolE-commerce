import connectDB from "@/config/db";
import User from "@/models/User";

export async function syncUserWithDB(clerkUser: any) {
  await connectDB();

  const { id, email_addresses, image_url, full_name } = clerkUser;

  const primaryEmail = email_addresses?.[0]?.email_address || "";

  await User.findOneAndUpdate(
    { _id: id },
    {
      _id: id,
      name: full_name || "",
      email: primaryEmail,
      imageUrl: image_url,
    },
    { upsert: true, new: true }
  );
}
