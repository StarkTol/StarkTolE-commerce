import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import { testFunction } from "@/inngest/functions/testFunction";
import { userCreated } from "@/inngest/functions/userCreated";
import { userDeleted } from "@/inngest/functions/userDeleted";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [testFunction, userCreated, userDeleted],
});
