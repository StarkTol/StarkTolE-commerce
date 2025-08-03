// inngest/handler.ts
import { inngest } from "../config/inngest";
import { userCreatedHandler } from "./functions/userCreated";

export const functions = [
  userCreatedHandler,
  // Add more functions here as you create them
];

export { inngest };
