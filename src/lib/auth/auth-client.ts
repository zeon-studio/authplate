import {
  inferAdditionalFields,
  customSessionClient,
  emailOTPClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { toast } from "sonner";

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  getSession,
  sendVerificationEmail,
  emailOtp,
  forgetPassword,
  changePassword,
  updateUser,
  changeEmail,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  $Infer,
} = createAuthClient({
  plugins: [
    emailOTPClient(),
    customSessionClient<typeof auth>(), // To infer the custom session types
    inferAdditionalFields<typeof auth>(), // To infer addition fields
  ],
  fetchOptions: {
    onError: (e) => {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
});

// session type e infer
export type Session = typeof $Infer.Session;
