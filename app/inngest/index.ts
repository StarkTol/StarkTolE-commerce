// inngest/index.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "starktol-ecommerce-app",
  name: "StarkTol E-commerce App",
  isDev: true,
  devServerURL: "http://127.0.0.1:8288",
  fetch: globalThis.fetch,
});
