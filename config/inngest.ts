// config/inngest.ts
import { Inngest } from "inngest";

// Create and export a single Inngest client instance
export const inngest = new Inngest({
  id: "starktol-ecommerce-app",
  name: "StarkTol E-commerce",
  isDev: process.env.NODE_ENV === "development",
  devServerURL: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8288" : undefined,
  fetch: globalThis.fetch,
});
