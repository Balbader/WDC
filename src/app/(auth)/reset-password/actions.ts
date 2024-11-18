"use server";

import { rateLimitByIp } from "@/lib/limiter";
import { unauthenticatedAction } from "@/lib/safe-action";
import { changePasswordUseCase } from "@/use-cases/users";
import { z } from "zod"; // Import Zod for input validation

/**
 * Server action for changing user password during password reset flow
 * This action is specifically for unauthenticated users who have a reset token
 */
export const changePasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    // Validate input using Zod schema
    z.object({
      token: z.string(), // Reset token received via email
      password: z.string().min(8), // New password with minimum 8 characters
    })
  )
  .handler(async ({ input: { token, password } }) => {

    // Rate limit to 2 attempts per 30 seconds per IP address
    await rateLimitByIp({ key: "change-password", limit: 2, window: 30000 });

    // Process the password change using the provided token and new password
    await changePasswordUseCase(token, password);
  });
