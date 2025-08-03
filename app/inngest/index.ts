// inngest/index.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "starktol-ecommerce-app",
  name: "StarkTol E-commerce App",
  isDev: process.env.NODE_ENV === "development",
  devServerURL: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8288" : undefined,
  fetch: globalThis.fetch,
});
