import { inngest } from "@/config/inngest";
import { connectDB } from "@/lib/mongo";
import User from "@/models/User";

export const userDeleted = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "user.deleted" },
  async ({ event, step }) => {
    console.log("Processing user deletion event:", event.data);
    
    await step.run("connect-to-db", async () => {
      return await connectDB();
    });

    const userData = event.data;
    const { id } = userData;

    const result = await step.run("delete-user-from-db", async () => {
      console.log('Deleting user from database:', {
        id,
        operation: 'delete'
      });
      
      // Delete the user from the database
      const deleteResult = await User.deleteOne({ _id: id });
      
      console.log('Database deletion result:', deleteResult);
      
      if (deleteResult.deletedCount === 0) {
        console.warn(`User ${id} not found in database - may have been already deleted`);
        return {
          found: false,
          deleted: false,
          message: "User not found in database"
        };
      }
      
      return {
        found: true,
        deleted: true,
        deletedCount: deleteResult.deletedCount
      };
    });

    return { 
      message: "User deletion processed",
      userId: id,
      result: result
    };
  }
);
