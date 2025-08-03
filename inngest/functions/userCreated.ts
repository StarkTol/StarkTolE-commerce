// inngest/functions/userCreated.ts
import { inngest } from "../../config/inngest";
import { connectDB } from "../../lib/mongo";
import User from "../../models/User.js";

export const userCreatedHandler = inngest.createFunction(
  { id: "user-created-handler" },
  { event: "user.created" },
  async ({ event, step }) => {
    const { data } = event;
    
    return await step.run("sync-user-to-database", async () => {
      try {
        await connectDB();
        
        // Check if user already exists
        const existingUser = await User.findById(data.id);
        
        if (existingUser) {
          console.log(`User ${data.id} already exists, updating...`);
          
          // Update existing user
          const updatedUser = await User.findByIdAndUpdate(
            data.id,
            {
              name: data.first_name + " " + (data.last_name || ""),
              email: data.email_addresses[0]?.email_address || "",
              imageUrl: data.image_url || "",
            },
            { new: true }
          );
          
          return { message: "User updated successfully", user: updatedUser };
        } else {
          console.log(`Creating new user ${data.id}...`);
          
          // Create new user
          const newUser = await User.create({
            _id: data.id,
            name: data.first_name + " " + (data.last_name || ""),
            email: data.email_addresses[0]?.email_address || "",
            imageUrl: data.image_url || "",
            cartItems: {},
          });
          
          return { message: "User created successfully", user: newUser };
        }
      } catch (error) {
        console.error("Error syncing user:", error);
        throw error;
      }
    });
  }
);
