// inngest/handler.ts
import { inngest } from "../config/inngest";
import { userCreated } from "./functions/userCreated";
import { testFunction } from "./functions/testFunction";

export const functions = [
  userCreated,
  testFunction,
  // Add more functions here as you create them
];

export { inngest };
