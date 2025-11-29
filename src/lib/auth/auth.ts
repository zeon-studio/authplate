import { mailSender } from "@/app/actions/sender";
import bcryptjs from "bcryptjs";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { getClient } from "../mongoose";
import { userSchema } from "../validation/user.schema";
import { otpVerifySchema } from "./server-validation-schema";

const client = await getClient();

export const auth = betterAuth({
  database: mongodbAdapter(client),
  // to modify user data before create or update
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Modify the user object before it is created
          return { data: user };
        },
        // after: async (user) => {
        //perform additional actions, like creating a stripe customer
        // },
      },
      update: {
        before: async (user) => {
          // const validationResult = updateUserSchema.safeParse(user)
          // Modify the user object before it is created
          return { data: user };
        },
      },
    },
  },

  // if allowing muliple social providers, enable account linking
  // account: {
  //   accountLinking: {
  //     enabled: true,
  //     allowDifferentEmails: false
  //     trustedProviders: ["google", "github"],
  //   },
  // },

  // To use custom session expiration and update age, and sesssion cookie cache
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  rateLimit: {
    // enabled: true, // enabled only if you want to test it in development
    window: parseInt(process.env.RATELIMIT_WINDOW!), // time window in seconds
    max: parseInt(process.env.RATELIMIT_MAX!), // max requests in the window
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // run before an endpoint is executed.
      if (ctx.path === "/sign-up/email") {
        // validate register payload
        const refinedSchema = userSchema.omit({ isTermsAccepted: true });
        const { success, error } = refinedSchema.safeParse({
          ...ctx.body,
          firstName: ctx.body.name,
        });
        if (!success) {
          throw new APIError("BAD_REQUEST", {
            message: error.issues.map((issue) => issue.message)[0],
          });
        }
      }

      if (ctx.path === "/email-otp/verify-email") {
        // validate otp payload
        const { success, error } = otpVerifySchema.safeParse(ctx.body);
        if (!success) {
          throw new APIError("BAD_REQUEST", {
            message: error.issues.map((issue) => issue.message)[0],
          });
        }
      }
    }),
    after: createAuthMiddleware(async () => {
      // run after an endpoint is executed. Use them to modify responses.
    }),
  },

  emailVerification: {
    sendOnSignUp: true,
    // sendVerificationEmail: async ({ user, url, token }, request) => {
    // await sendEmail({
    //   to: user.email,
    //   subject: "Verify your email address",
    //   text: `Click the link to verify your email: ${url}`,
    // });
    // },

    // afterEmailVerification: async (user, request) => {
    // Your custom logic here, e.g., grant access to premium features
    // },
  },
  user: {
    modelName: "user",
    fields: {
      name: "firstName",
    },
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        input: true,
        defaultValue: "",
      },
      lastName: {
        type: "string",
        required: true,
        input: true,
        defaultValue: "",
      },
      isTermsAccepted: {
        type: "boolean",
        required: true,
        input: false,
        defaultValue: true,
      },
      provider: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "Credential",
      },
      password: {
        type: "string",
        input: true,
      },
      // verifications: {
      //   type: "string[]",
      //   required: false,
      //   input: true,
      //   reference: {
      //     model: "OtpVerification", // table name to reference
      //     field: "_id", // field name to reference
      //   },
      // },
      // subscriptions: {
      //   type: "string[]",
      //   required: false,
      //   input: true,
      //   reference: {
      //     model: "Subscription", // table name to reference
      //     field: "_id", // field name to reference
      //   },
      // },
      // payments: {
      //   type: "string[]",
      //   required: false,
      //   input: true,
      //   reference: {
      //     model: "Payment", // table name to reference
      //     field: "_id", // field name to reference
      //   },
      // },
    },
    // if you want to allow user to change their email
    // changeEmail: {
    //   enabled: true,
    //   sendChangeEmailVerification: async (
    //     { user, newEmail, url, token },
    //     request,
    //   ) => {
    //     await sendEmail({
    //       to: user.email, // verification email must be sent to the current user email to approve the change
    //       subject: "Approve email change",
    //       text: `Click the link to approve the change: ${url}`,
    //     });
    //   },
    // },

    // deleteUser: {
    //   enabled: false, // use true to enable user to delete their account
    //   beforeDelete: async (user, request) => {
    //     // Perform any cleanup or additional checks here
    //     if (user.email.includes("admin")) {
    //       throw new APIError("BAD_REQUEST", {
    //         message: "Admin accounts can't be deleted",
    //       });
    //     }
    //   },
    //   afterDelete: async (user, request) => {
    //     // Perform any cleanup or additional actions here
    //   },
    //   sendDeleteAccountVerification: async (
    //     {
    //       user, // The user object
    //       url, // The auto-generated URL for deletion
    //       token, // The verification token  (can be used to generate custom URL)
    //     },
    //     request, // The original request object (optional)
    //   ) => {
    //     // Your email sending logic here
    //     // Example: sendEmail(data.user.email, "Verify Deletion", data.url);
    //   },
    // },
  },
  advanced: {
    database: {
      generateId: false, // true to generate a random id for user
      // ora callback to generate custom id
      // generateId: () => crypto.randomUUID(),
      // useNumberId: true, // true to use auto incremental number as id
    },
    // cookiePrefix: "authplate", // all cookie name starts with that (middleware should be confuged too)

    // For custom cookie name and attributes
    // cookies: {
    //   session_token: {
    //     name: "custom_session_token",
    //     attributes: {
    //       // Set custom cookie attributes
    //     },
    //   },
    // },

    // cookie enabled across subdomain
    // crossSubDomainCookies: {
    //   enabled: true,
    //   domain: "app.example.com", // enabled for all subdomain of example.com
    // },

    // only specific subdomain here, more secure
    // trustedOrigins: [process.env.BETTER_AUTH_URL!],
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // this will call sendVerificationEmail if not verified
    autoSignIn: true, // false for not auto signin after signup
    autoSignInAfterVerification: true, // false for not auto signin after email verification
    // sendResetPassword: async ({ user, url, token }, request) => {
    // my custom email sending logic here
    // await sendEmail({
    //   to: user.email,
    //   subject: "Reset your password",
    //   text: `Click the link to reset your password: ${url}`,
    // });
    // },
    // minPasswordLength: 8,
    // maxPasswordLength: 128,

    // Custom password validation function
    // onPasswordReset: async ({ user }, request) => {
    // your logic here
    // },
    password: {
      hash: async (password: string) => {
        const hashPass = await bcryptjs.hash(password, 10);
        return hashPass;
      }, // your custom password hashing function
      verify: async ({ password, hash }) => {
        const isValidPassword = await bcryptjs.compare(password, hash);
        return isValidPassword;
      }, // your custom password verification function
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1],
          provider: "Github",
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      disableImplicitSignUp: false, // auto signup when when signin with google
      accessType: "offline", // To always get a refresh token
      prompt: "select_account consent",
      // scope: [""], // custom scopes
      mapProfileToUser: (profile) => {
        return {
          name: profile.given_name, // aliased as firstName
          firstName: profile.given_name, // aliased as firstName
          lastName: profile.family_name,
          provider: "Google",
        };
      },
      // refreshAccessToken: async (token) => {
      //   return token
      //   // fetch new access token from google
      //   return {
      //     accessToken: "new-access-token",
      //     refreshToken: "new-refresh-token",
      //   };
      // },
      // getUserInfo: async (token) => {
      //   // Custom implementation to get user info
      //   const response = await fetch(
      //     "https://www.googleapis.com/oauth2/v2/userinfo",
      //     {
      //       headers: {
      //         Authorization: `Bearer ${token.accessToken}`,
      //       },
      //     },
      //   );
      //   const profile = await response.json();
      //   return {
      //     user: {
      //       id: profile.id,
      //       name: profile.name,
      //       email: profile.email,
      //       image: profile.picture,
      //       emailVerified: profile.verified_email,
      //     },
      //     data: profile,
      //   };
      // },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6, // six digits
      expiresIn: 15 * 60, // 15 minutes
      allowedAttempts: 3, // Invalid the otp after 3 wrong submisssion
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "sign-in") {
          // Send the OTP for sign in
        }
        if (type === "email-verification") {
          // Send the OTP for email verification
          await mailSender.otpSender(email, otp);
        }
        if (type === "forget-password") {
          // Send the OTP for email verification
          await mailSender.otpSender(email, otp);
        }
      },
    }),
    nextCookies(),
    // enabe this if you need twofactor
    // twoFactor()

    // use this plugin to add custom property
    // customSession(async ({ user, session }) => {
    //   return {
    //     user,
    //     session,
    //   };
    // }),
  ],
});
