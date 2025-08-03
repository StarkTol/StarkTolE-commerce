import { serve } from "inngest/next";
import { inngest, functions } from "../../../inngest/handler";

console.log('Inngest route loaded:', {
  nodeEnv: process.env.NODE_ENV,
  hasSigningKey: !!process.env.INNGEST_SIGNING_KEY,
  clientId: inngest.id,
  functionsCount: functions.length
});

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: functions,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
