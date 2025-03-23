import { z } from "zod";

const baseUserSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address (e.g., user@example.com)."),
  image: z.string().url("Please provide a valid URL for the image.").nullish(),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long.")
    .max(30, "First name must not exceed 30 characters.")
    .regex(/^[a-zA-Z]+$/, "First name can only contain alphabetic characters."),
  lastName: z
    .string()
    .max(30, "Last name must not exceed 30 characters.")
    .regex(/^[a-zA-Z]+$/, "Last name can only contain alphabetic characters.")
    .nullish(),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password must not exceed 50 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one digit.")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character.",
    ),
});

export const userSchema = baseUserSchema.merge(passwordSchema);

export const updateUserSchema = baseUserSchema.omit({ email: true });

export const loginUserSchema = z.object({
  email: baseUserSchema.shape.email,
  password: passwordSchema.shape.password,
});
