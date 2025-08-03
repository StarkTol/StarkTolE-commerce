import { serve } from "inngest/next";
import { inngest } from "../../inngest";
import { userCreatedHandler } from "../../inngest/functions/userCreated";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userCreatedHandler],
});
