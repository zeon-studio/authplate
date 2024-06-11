import { loginSchema, registerSchema } from "@/lib/validation";
import { z } from "zod";

  export type User<T> = {
    id: string;
    email: string;
    name: string;
    profession: string;
    country: string;
    verified: boolean;
    image?: string;
    variables: T;
  };

export type UserRegister = User<z.infer<typeof registerSchema>>;
export type UserLogin = User<z.infer<typeof loginSchema>>;
