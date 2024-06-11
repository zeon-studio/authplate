"use server";
import "server-only";

import nodemailer from "nodemailer";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// send OTP
export const otpSender = async (email: string, otp: string) => {
  let mailDetails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "AdminX Account Verification",
    text: `Use this OTP to verify your account: ${otp}`,
  };
  await mailTransporter.sendMail(mailDetails);
};

// send OTP
export const emailSender = async ({
  email,
  role,
}: {
  email: string;
  role: "admin" | "editor";
}) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  let mailDetails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "AdminX invitation",
    text: `${isDevelopment ? "http://localhost:3000" : "https://adminx-cms.vercel.app"}`,
  };

  await mailTransporter.sendMail(mailDetails);
};
