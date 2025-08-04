import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import { userCreated } from "@/inngest/functions/userCreated";
import { userDeleted } from "@/inngest/functions/userDeleted";
import { testFunction } from "@/inngest/functions/testFunction";

// Serve all functions with explicit imports to avoid circular dependencies
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userCreated, userDeleted, testFunction],
});
