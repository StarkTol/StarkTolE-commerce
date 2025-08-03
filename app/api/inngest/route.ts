import { serve } from "inngest/next";
import { inngest } from "../../inngest";
import { userCreatedHandler } from "../../inngest/functions/userCreated";

console.log('Inngest route loaded:', {
  nodeEnv: process.env.NODE_ENV,
  hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
  clientId: inngest.id
});

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userCreatedHandler],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
