// config/inngest.ts
import { Inngest } from "inngest";

// Create and export a single Inngest client instance
export const inngest = new Inngest({
  id: "starktol-ecommerce-app",
  name: "StarkTol E-commerce",
  // Use environment-based configuration
  isDev: process.env.NODE_ENV === "development",
  // Production keys for deployed environment
  ...(process.env.NODE_ENV === "production" && {
    eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY,
  }),
  // Local dev server for development
  ...(process.env.NODE_ENV === "development" && {
    devServerURL: "http://127.0.0.1:8288",
  }),
  fetch: globalThis.fetch,
});
