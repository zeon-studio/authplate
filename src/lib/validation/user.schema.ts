import { z } from "zod";

// Base schema for user details
const baseUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long.")
    .max(30, "First name must not exceed 30 characters.")
    .regex(
      /^[A-Za-z\s]+$/,
      "First name can only contain alphabetic characters.",
    ),
  lastName: z
    .string()
    .max(30, "Last name must not exceed 30 characters.")
    .regex(
      /^[A-Za-z\s]+$/,
      "Last name can only contain alphabetic characters.",
    ),
  email: z.email(
    "Please provide a valid email address (e.g., user@example.com).",
  ),
  image: z
    .url("Please provide a valid URL for the image.")
    .or(z.literal(""))
    .optional(),
  isTermsAccepted: z
    .boolean({
      error: (issue) =>
        issue.input == undefined
          ? "You must accept the terms and conditions"
          : "Terms acceptance must be a boolean value",
    })
    .refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  provider: z
    .enum(["Credential", "Google", "Github"], {
      error: (issue) => {
        return issue.input == undefined
          ? "Provider is required"
          : "Invalid provider type";
      },
    })
    .default("Credential"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

// Password validation schema
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

// Complete user schema
export const userSchema = baseUserSchema.merge(passwordSchema);
export const registerUserSchema = userSchema
  .omit({
    provider: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    confirmPassword: passwordSchema.shape.password,
  })
  .refine(
    (data) =>
      data.password.length > 0 && data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

// Schema for updating user, omitting the email field
export const updateUserSchema = baseUserSchema.omit({
  email: true,
  isTermsAccepted: true,
  provider: true,
  createdAt: true,
  updatedAt: true,
});

// Login schema, only email and password are required
export const loginUserSchema = z.object({
  email: baseUserSchema.shape.email,
  password: passwordSchema.shape.password,
});

// forgot password
export const forgotPasswordSchema = z.object({
  email: baseUserSchema.shape.email,
});

// reset password
export const resetPasswordSchema = z.object({
  password: passwordSchema.shape.password,
  confirmPassword: passwordSchema.shape.password,
});

// update password

export const updatePasswordSchema = z
  .object({
    oldPassword: passwordSchema.shape.password,
    newPassword: passwordSchema.shape.password,
    confirmPassword: passwordSchema.shape.password,
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
