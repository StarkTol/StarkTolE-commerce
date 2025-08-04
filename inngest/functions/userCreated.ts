import { inngest } from "@/config/inngest";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export const userCreated = inngest.createFunction(
  { id: "sync-user-to-db" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    console.log("Processing user creation event:", event.data);
    
    await step.run("connect-to-db", async () => {
      return await connectDB();
    });

    const userData = event.data;
    const { id, email_addresses, image_url, username, first_name, last_name } = userData;

    const result = await step.run("save-user-to-db", async () => {
      const userName = username || `${first_name || ''} ${last_name || ''}`.trim() || 'User';
      const userEmail = email_addresses?.[0]?.email_address;
      
      if (!userEmail) {
        throw new Error('No email found in user data');
      }
      
      console.log('Saving user to database:', {
        id,
        email: userEmail,
        name: userName,
        imageUrl: image_url
      });
      
      const updateResult = await User.updateOne(
        { _id: id },
        {
          $set: {
            _id: id,
            email: userEmail,
            name: userName,
            imageUrl: image_url || '',
            cartItems: {},
          },
        },
        { upsert: true }
      );
      
      console.log('Database update result:', updateResult);
      return updateResult;
    });

    return { 
      message: "User synced to MongoDB",
      userId: id,
      result: result
    };
  }
);
