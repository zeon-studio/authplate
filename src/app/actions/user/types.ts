import { loginUserSchema, userSchema } from "@/lib/validation/user.schema";
import { z } from "zod";

export type TUser = z.infer<typeof userSchema>;
export type TUserRegister = z.infer<typeof userSchema>;
export type TUserLogin = z.infer<typeof loginUserSchema>;
