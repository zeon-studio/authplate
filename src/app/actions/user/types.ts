import { loginUserSchema, userSchema } from "@/lib/validation/user.schema";
import { z } from "zod";

export type User = z.infer<typeof userSchema>;
export type UserRegister = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof loginUserSchema>;
