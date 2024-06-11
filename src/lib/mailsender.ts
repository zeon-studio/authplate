import nodemailer from "nodemailer";
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// send OTP
const otpSender = async (email: string, otp: string) => {
  let mailDetails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Gethugothemes Account Verification",
    text: `Use this OTP to verify your account: ${otp}`,
  };
  const otpSent = await mailTransporter.sendMail(mailDetails);
  return otpSent;
};

export const mailSender = {
  otpSender,
};
