import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncUserCreation, syncUserUpdation, syncUserDeletion } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
    , // <-- This is where you'll always add all your functions
  ],
});