import nodemailer from "nodemailer";

const config = {
  sender_email: process.env.SENDER_EMAIL,
  sender_password: process.env.EMAIL_PASSWORD,
};

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.sender_email,
    pass: config.sender_password,
  },
});

// send OTP
const otpSender = async (email: string, otp: string) => {
  const mailDetails = {
    from: config.sender_email,
    to: email,
    subject: "Authplate Account Verification",
    html: `<div style="text-align: center;">
    <h1>Thank you for choosing Authplate!</h1>
    <br>
    <br>
    <br>
    <h2>Use this OTP to verify your account</h2>
    <div style="border: 1px solid #ccc; padding: 4px 20px; border-radius: 5px; display: inline-block;">
    <h2>${otp}</h2>
    </div>
    <br>
    <br>
    <br>
    If you encounter any issues or have questions, please contact our support team.`,
  };
  await mailTransporter.sendMail(mailDetails);
};

// send team invitation mail
const teamInvitation = async (email: string) => {
  const mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `You're Invited to Join a Team on Authplate`,
    html: `
    <p>Hi,</p>
    <p>You have been invited to join a team on Authplate!</p>
    <p>As part of this team, you'll have access to shared resources and collaboration tools. Please click here to log in and join the team.</p>
    <p>We look forward to seeing you on the platform!</p>
    <p>Best regards,</p>
    <p>The Authplate Team</p>
    `,
  };
  await mailTransporter.sendMail(mailDetails);
};

// notification mail
const notificationEmail = async (
  email: string,
  subject: string,
  message: string,
) => {
  const mailDetails = {
    from: config.sender_email,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Notification from Authplate</h1>
        <div style="margin: 20px 0;">
          ${message}
        </div>
        <p>Best regards,<br>The Authplate Team</p>
      </div>
    `,
  };
  await mailTransporter.sendMail(mailDetails);
};

// comment notification
const commentNotification = async (
  email: string,
  itemName: string,
  comment: string,
) => {
  const mailDetails = {
    from: config.sender_email,
    to: email,
    subject: `New comment on ${itemName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Comment Notification</h2>
        <p>A new comment has been added to: ${itemName}</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${comment}
        </div>
      </div>
    `,
  };
  await mailTransporter.sendMail(mailDetails);
};

export const mailSender = {
  otpSender,
  teamInvitation,
  notificationEmail,
  commentNotification,
};
