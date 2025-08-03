import { inngest } from "@/config/inngest";

export const testFunction = inngest.createFunction(
  { id: "test-function" },
  { event: "test/event" },
  async ({ event }) => {
    console.log("Test function executed", event);
    return { success: true };
  }
);
