import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import {
  checkIsUserNameExist,
  checkIsEmailExist,
  findUserByEmail,
  validatePassword,
  updateFcmToken,
  createUser,
  logoutUserRepository,
  findUserRepository,
  updatePassword,
  findUserOtpRepository,
  updatePasswordRepository,
  updateOtpRepository,
} from "../repositories/auth.repository.js";
import { hashPassword } from "../utils/password.js";
import { generateOtp } from "../utils/generateOtp.js";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";
import { sendEmail } from "../utils/mailer.js";

export const registerUserService = async (userData) => {
  const { username, email, password } = userData;
  const isUsername = await checkIsUserNameExist(username);

  if (isUsername) {
    throw ApiError.badRequest("Username already exists");
  }
  const isEmail = await checkIsEmailExist(email);

  if (isEmail) {
    throw ApiError.badRequest("Email already exists");
  }
  const hashedPassword = await hashPassword(password);

  const newUser = await createUser({ ...userData, password: hashedPassword });
  return newUser;
};

export const loginUserService = async (loginData) => {
  const { email, password, fcmToken } = loginData;
  const user = await findUserByEmail(email);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isPasswordValid = await validatePassword(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid password");
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await updateFcmToken(user._id, fcmToken);
  return { ...user.toObject(), accessToken, refreshToken };
};

export const logoutUserService = async (userData) => {
  const { userId, fcmToken, refreshToken } = userData;
  const user = await logoutUserRepository(userId, fcmToken, refreshToken);
  return user;
};

export const forgotPasswordService = async (passwordData) => {
  const { userId, newPassword } = passwordData;
  const user = await findUserRepository(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const hashedPassword = await hashPassword(newPassword);
  const isPasswordValid = await updatePassword(userId, hashedPassword);
  if (!isPasswordValid) {
    throw ApiError.badRequest("Password update failed");
  }
};

export const changePasswordService = async (passwordData) => {
  const { userId, oldPassword, newPassword } = passwordData;
  const user = await findUserRepository(userId);

  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isPasswordValid = await validatePassword(oldPassword, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Incorrect old password");
  }

  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await updatePasswordRepository(userId, hashedPassword);

  if (!updatedUser) {
    throw ApiError.badRequest("Password update failed");
  }

  return {
    message: "Password changed successfully",
  };
};

export const sendOtpService = async (otpData) => {
  const { email } = otpData;
  const user = await findUserByEmail(email);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const otp = generateOtp();
  await updateOtpRepository(user._id, otp);
  const emailHtml = verificationEmailTemplate(otp);
  await sendEmail({
    to: email,
    subject: "Email Verification",
    html: emailHtml,
  });
  return user._id;
};

export const verifyOtpService = async (otpData) => {
  const { userId, otp } = otpData;
  const user = await findUserRepository(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const resentOtp = await findUserOtpRepository(userId);
  if (!resentOtp) {
    throw ApiError.notFound("OTP not found");
  }
  if (resentOtp.otp !== otp) {
    throw ApiError.badRequest("Invalid OTP");
  }
  await updateOtpRepository(userId, null);
};
