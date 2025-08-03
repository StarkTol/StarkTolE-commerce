import { inngest } from "@/config/inngest";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export const userCreated = inngest.createFunction(
  { id: "sync-user-to-db" },
  { event: "clerk.user.created" },
  async ({ event, step }) => {
    await connectDB();

    const { id, email_addresses, image_url, username } = event.data;

    await User.updateOne(
      { _id: id },
      {
        $set: {
          _id: id,
          email: email_addresses?.[0]?.email_address,
          name: username,
          imageUrl: image_url,
        },
      },
      { upsert: true }
    );

    return { message: "User synced to MongoDB" };
  }
);
