import { z } from "zod";

// otp schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 characters long")
    .regex(/^\d+$/, "Please enter a valid 6-digit OTP code"),
});
