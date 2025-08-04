// config/inngest.ts
import { Inngest } from "inngest";

// Create and export a single Inngest client instance
export const inngest = new Inngest({
  id: "starktol-ecommerce",
  name: "StarkTol E-commerce App",
  // Simple development configuration
  isDev: process.env.NODE_ENV !== "production",
  // Only add production keys if they exist and we're in production
  eventKey: process.env.NODE_ENV === "production" ? process.env.INNGEST_EVENT_KEY : undefined,
  signingKey: process.env.NODE_ENV === "production" ? process.env.INNGEST_SIGNING_KEY : undefined,
});
