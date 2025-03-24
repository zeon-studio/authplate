import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string().refine((value) => String(value).length === 4, {
    message: "OTP must be exactly 4 digits.",
  }),
});
