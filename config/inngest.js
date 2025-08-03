// config/inngest.js

import { Inngest } from "inngest";

// Create and export a single Inngest client instance
export const inngest = new Inngest({
  name: "StarkTol E-commerce",
  eventKey: process.env.INNGEST_EVENT_KEY, // make sure this is set in your .env
});
