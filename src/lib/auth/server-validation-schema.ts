import z from "zod";
import { otpSchema } from "../validation/otp.schema";

export const otpVerifySchema = z
  .object({
    email: z.email({
      error: "Please provide a valid email address.",
    }),
  })
  .extend(otpSchema.shape);
