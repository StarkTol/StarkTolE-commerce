// config/inngest.ts
import { Inngest } from "inngest";

// Create and export a single Inngest client instance
export const inngest = new Inngest({
  id: "starktol-ecommerce-app",
  name: "StarkTol E-commerce",
  isDev: process.env.NODE_ENV !== "production",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  fetch: globalThis.fetch,
});
