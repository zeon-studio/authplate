// import ApiError from "@/errors/ApiError";
import { OtpVerification } from "@/db/model/otp-verification.model";
import { Url_Params } from "@/db/model/urlparams.model";
import { User } from "@/db/model/user.model";
import ApiError from "@/error/ApiError";
import { mailSender } from "@/lib/mailsender";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
const verifyOtpService = async (
  user_id: string,
  otp: string,
  currentTime: string,
) => {
  if (!otp && !user_id) {
    throw Error("Empty details are not allowed");
  } else {
    const verificationToken = await OtpVerification.findOne({
      user_id,
    });
    if (!verificationToken) {
      throw Error("OTP doesn't exists");
    } else {
      const { token: hashedOtp, expires } = verificationToken;

      if (new Date(expires) > new Date(currentTime)) {
        const compareOtp = await bcrypt.compare(otp, hashedOtp);
        if (!compareOtp) {
          throw Error("Incorrect OTP");
        } else {
          await OtpVerification.deleteOne({ user_id });
          await User.findOneAndUpdate({ email: user_id }, { isValid: true });
        }
      } else {
        await OtpVerification.deleteOne({ user_id });
        throw Error("OTP Expired");
      }
    }
  }
};
// user verification for password recovery
const verifyUserService = async (email: string, currentTime: string) => {
  await OtpVerification.deleteOne({ user_id: email });
  await sendVerificationOtp(email, currentTime);
  return OtpVerification.findOne({ user_id: email });
};

// send verification otp
export const sendVerificationOtp = async (
  email: string,
  currentTime: string,
) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const getCurrentTime = new Date(currentTime);
  const expiringTime = new Date(
    getCurrentTime.setMinutes(getCurrentTime.getMinutes() + 5),
  ).toISOString();

  const userVerification = new OtpVerification({
    user_id: email,
    token: await bcrypt.hash(otp, Number(process.env.SALT)),
    expires: expiringTime,
  });
  await userVerification.save();
  const otpSender = await mailSender.otpSender(email, otp);
  return otpSender;
};

// reset password
const resetPasswordService = async (id: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  const resetPassword = await User.findOneAndUpdate(
    { email: id },
    {
      $set: {
        password: hashedPassword,
      },
    },
    { new: true },
  );
  if (!resetPassword) {
    throw new ApiError("Something went wrong", httpStatus.FORBIDDEN, "");
  }
};

// update password
const updatePasswordService = async (
  id: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findOne({ id: id });

  if (!user) {
    throw new Error("Something went wrong");
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT),
  );

  await User.updateOne(
    { id: id },
    {
      $set: {
        password: hashedPassword,
      },
    },
  );
};

// // resend verification token
const resendOtpService = async (user_id: string, currentTime: string) => {
  if (!user_id) {
    throw Error("Empty user information");
  } else {
    await OtpVerification.deleteOne({ user_id });
    await sendVerificationOtp(user_id, currentTime);
  }
};
const createUrlParams = async (email: string, params: string) => {
  const urlparams = await Url_Params.findOne({ email });
  if (urlparams) {
    await Url_Params.updateOne(
      { email: email },
      {
        $set: {
          params,
        },
      },
    );
  } else {
    await Url_Params.create([{ email, params }]);
  }
};
export const optVerificationService = {
  verifyUserService,
  createUrlParams,
  resendOtpService,
  updatePasswordService,
  verifyOtpService,
  resetPasswordService,
};
