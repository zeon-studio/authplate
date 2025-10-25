import { z } from "zod";

// otp schema
export const otpSchema = z.object({
  otp: z
    .string({
      error: "Please enter a valid 6-digit OTP code",
    })
    .length(6, { error: "OTP must be exactly 6 characters long" })
    .regex(/^\d+$/, { error: "Please enter a valid 6-digit OTP code" }),
});
