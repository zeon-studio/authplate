"use server";
import nodemailer, { TransportOptions } from "nodemailer";
import "server-only";

// Configure email transport
const createMailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as TransportOptions);
};

// Email template interface
interface EmailTemplate {
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Base email sender function
const sendEmail = async (template: EmailTemplate) => {
  const transporter = createMailTransporter();
  await transporter.sendMail(template);
};

// send OTP
export const otpSender = async (email: string, otp: string) => {
  const template: EmailTemplate = {
    from: process.env.SENDER_EMAIL!,
    to: email,
    subject: "AdminX Account Verification",
    text: `Use this OTP to verify your account: ${otp}`,
  };

  await sendEmail(template);
};

// send OTP
export const emailSender = async ({ email }: { email: string }) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment
    ? "http://localhost:3000"
    : "https://adminx-cms.vercel.app";

  const template: EmailTemplate = {
    from: process.env.SENDER_EMAIL!,
    to: email,
    subject: "AdminX invitation",
    text: baseUrl,
  };

  await sendEmail(template);
};
