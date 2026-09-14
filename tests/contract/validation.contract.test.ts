import { otpVerifySchema } from "@/lib/auth/server-validation-schema";
import { otpSchema } from "@/lib/validation/otp.schema";
import {
  forgotPasswordSchema,
  loginUserSchema,
  passwordSchema,
  registerUserSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "@/lib/validation/user.schema";
import assert from "node:assert";
import { describe, it } from "vitest";

const validPassword = "Str0ng!Pass";

describe("Password schema — strength rules", () => {
  it("accepts a password meeting every rule", () => {
    const result = passwordSchema.safeParse({ password: validPassword });
    assert.strictEqual(result.success, true);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = passwordSchema.safeParse({ password: "Ab1!" });
    assert.strictEqual(result.success, false);
  });

  it("rejects passwords missing an uppercase letter", () => {
    const result = passwordSchema.safeParse({ password: "str0ng!pass" });
    assert.strictEqual(result.success, false);
  });

  it("rejects passwords missing a lowercase letter", () => {
    const result = passwordSchema.safeParse({ password: "STR0NG!PASS" });
    assert.strictEqual(result.success, false);
  });

  it("rejects passwords missing a digit", () => {
    const result = passwordSchema.safeParse({ password: "Strong!Pass" });
    assert.strictEqual(result.success, false);
  });

  it("rejects passwords missing a special character", () => {
    const result = passwordSchema.safeParse({ password: "Str0ngPass" });
    assert.strictEqual(result.success, false);
  });
});

describe("registerUserSchema", () => {
  const validPayload = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    isTermsAccepted: true,
    password: validPassword,
    confirmPassword: validPassword,
  };

  it("accepts a fully valid registration payload", () => {
    const result = registerUserSchema.safeParse(validPayload);
    assert.strictEqual(result.success, true);
  });

  it("rejects when password and confirmPassword don't match", () => {
    const result = registerUserSchema.safeParse({
      ...validPayload,
      confirmPassword: "Different1!",
    });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("confirmPassword"),
      );
      assert.ok(issue, "Expected a confirmPassword mismatch issue");
    }
  });

  it("rejects when terms are not accepted", () => {
    const result = registerUserSchema.safeParse({
      ...validPayload,
      isTermsAccepted: false,
    });
    assert.strictEqual(result.success, false);
  });

  it("rejects an invalid email address", () => {
    const result = registerUserSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });
    assert.strictEqual(result.success, false);
  });

  it("rejects a first name with non-alphabetic characters", () => {
    const result = registerUserSchema.safeParse({
      ...validPayload,
      firstName: "Jane123",
    });
    assert.strictEqual(result.success, false);
  });

  it("rejects a first name shorter than 2 characters", () => {
    const result = registerUserSchema.safeParse({
      ...validPayload,
      firstName: "J",
    });
    assert.strictEqual(result.success, false);
  });
});

describe("loginUserSchema", () => {
  it("accepts a valid email/password pair", () => {
    const result = loginUserSchema.safeParse({
      email: "jane@example.com",
      password: validPassword,
    });
    assert.strictEqual(result.success, true);
  });

  it("rejects a malformed email", () => {
    const result = loginUserSchema.safeParse({
      email: "jane@",
      password: validPassword,
    });
    assert.strictEqual(result.success, false);
  });
});

describe("forgotPasswordSchema / resetPasswordSchema / updatePasswordSchema", () => {
  it("forgotPasswordSchema accepts a valid email only", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "jane@example.com",
    });
    assert.strictEqual(result.success, true);
  });

  it("resetPasswordSchema requires password and confirmPassword to be present", () => {
    const result = resetPasswordSchema.safeParse({
      password: validPassword,
      confirmPassword: validPassword,
    });
    assert.strictEqual(result.success, true);
  });

  it("updatePasswordSchema rejects a new password identical to the old one", () => {
    const result = updatePasswordSchema.safeParse({
      oldPassword: validPassword,
      newPassword: validPassword,
      confirmPassword: validPassword,
    });
    assert.strictEqual(result.success, false);
  });

  it("updatePasswordSchema rejects mismatched newPassword/confirmPassword", () => {
    const result = updatePasswordSchema.safeParse({
      oldPassword: "OldStr0ng!",
      newPassword: validPassword,
      confirmPassword: "Different1!",
    });
    assert.strictEqual(result.success, false);
  });

  it("updatePasswordSchema accepts a genuinely new, matching password", () => {
    const result = updatePasswordSchema.safeParse({
      oldPassword: "OldStr0ng!",
      newPassword: validPassword,
      confirmPassword: validPassword,
    });
    assert.strictEqual(result.success, true);
  });
});

describe("updateUserSchema", () => {
  it("accepts a profile update without email/terms/provider fields", () => {
    const result = updateUserSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
    });
    assert.strictEqual(result.success, true);
  });
});

describe("OTP schemas", () => {
  it("otpSchema accepts a 6-digit numeric code", () => {
    const result = otpSchema.safeParse({ otp: "123456" });
    assert.strictEqual(result.success, true);
  });

  it("otpSchema rejects a non-numeric code", () => {
    const result = otpSchema.safeParse({ otp: "12a456" });
    assert.strictEqual(result.success, false);
  });

  it("otpSchema rejects a code that isn't exactly 6 characters", () => {
    assert.strictEqual(otpSchema.safeParse({ otp: "12345" }).success, false);
    assert.strictEqual(
      otpSchema.safeParse({ otp: "1234567" }).success,
      false,
    );
  });

  it("otpVerifySchema requires both a valid email and a valid otp", () => {
    const valid = otpVerifySchema.safeParse({
      email: "jane@example.com",
      otp: "123456",
    });
    assert.strictEqual(valid.success, true);

    const badEmail = otpVerifySchema.safeParse({
      email: "not-an-email",
      otp: "123456",
    });
    assert.strictEqual(badEmail.success, false);
  });
});
