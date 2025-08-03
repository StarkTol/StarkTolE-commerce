import { inngest } from "../index";

export const userCreatedHandler = inngest.createFunction(
  { id: "user-created-handler" },
  { event: "user.created" },
  async ({ event }) => {
    console.log("Clerk user created:", event.data);
    return { message: "Handled user.created event" };
  }
);
