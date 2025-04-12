"use server";

import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import "server-only";
import { z } from "zod";

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export type ErrorType =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNIQUE_CONSTRAINT"
  | "FOREIGN_KEY_CONSTRAINT"
  | "SERVER_ERROR"
  | "AUTH_ERROR"
  | "OTP_REQUIRED";

export type Result<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        type: ErrorType;
        message: string;
        details?: Record<string, any>;
      } | null;
    }
  | null;

function formatZodErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([field, messages]) => [
      field,
      messages?.[0] || "Invalid input",
    ]),
  );
}

export async function safeAction<T>(
  fn: () => Promise<T> | T,
): Promise<Result<T>> {
  try {
    const response = await fn();
    return {
      data: response,
      success: true,
    };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      function getFromValue(digest: string): string {
        const urlPattern = /NEXT_REDIRECT;(?:replace|push);(.*?);/;
        const match = digest.match(urlPattern);

        if (match) {
          try {
            const url = new URL(match[1]);
            const redirectUrl = url.searchParams.get("from") || "/";
            return redirectUrl;
          } catch {
            // If URL construction fails, return "/"
          }
        }

        return "/";
      }

      redirect(getFromValue(error.digest));
    }
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          message: "Invalid user data",
          details: formatZodErrors(error),
        },
      };
    }

    if (error instanceof CredentialsSignin) {
      const message = error.message.substring(
        0,
        error.message.indexOf(". Read more"),
      );
      return {
        success: false,
        error: {
          type: message === "User not verified" ? "OTP_REQUIRED" : "AUTH_ERROR",
          message,
          details: {
            originalError: "Unknown error occurred",
          },
        },
      };
    }

    if (error instanceof Error) {
      return {
        error: {
          type: "SERVER_ERROR",
          message: error.message,
          details: {
            originalError: error.stack,
          },
        },
        success: false,
      };
    }

    return {
      success: false,
      error: {
        type: "SERVER_ERROR",
        message: "Unexpected database error",
        details: {
          originalError: "Unknown error occurred",
        },
      },
    };
  }
}
