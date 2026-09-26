import asyncHandler from "../utils/asyncHandler.js";
import { changePasswordService, forgotPasswordService, loginUserService, logoutUserService, registerUserService, sendOtpService, verifyOtpService } from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export const register = asyncHandler(async (req, res) => {
  console.log(req.body,"=======")
  const { username, email, password } = req.body;

  const user = await registerUserService({
    username,
    email,
    password,
  });

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return successResponse(
    res,
    "User registered successfully",
    userResponse,
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  console.log(req.body,"=======")
  const { email, password ,fcmToken} = req.body;
  const user = await loginUserService({ email, password ,fcmToken});
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };

  return successResponse(
    res,
    "User logged in successfully",
    userResponse,
    200
  );
});

export const logout = asyncHandler(async (req, res) => {
   const userId = req.user.id;
   const {fcmToken,refreshToken} = req.body;
    const user = await logoutUserService({userId ,fcmToken ,refreshToken});
   return successResponse(
    res,
    "User logged out successfully",
    user,
    200
   )

});

export const forgotPassword = asyncHandler(async (req, res) => {
  const {userId , newPassword} = req.body;
  await forgotPasswordService({userId, newPassword});
  return successResponse(
    res,
    "Password changed successfully",
    null,
    200
  );
});

export const changePassword = asyncHandler(async (req, res) => {
 const userId = req.user.id;
 console.log("changePassword called with user:", userId);
 const {oldPassword , newPassword} = req.body;
  await changePasswordService({userId,oldPassword , newPassword})
 return successResponse(
  res,
  "Change password successfully",
  null,
  200
 )
});

export const sendOtp = asyncHandler(async (req, res) => {
  const {email} = req.body;
  const userId = await sendOtpService({email});
  return successResponse(
    res,
    "OTP sent successfully",
    { userId },
    200
  );
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const {userId, otp} = req.body;
  await verifyOtpService({userId, otp});
 return successResponse(
  res,
  "OTP verified successfully",
  userId,
  200
 )
});

export const privacyPolicy = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      title: "Privacy Policy",
      version: "1.0",
      effectiveDate: "2026-09-24",
      content: `
        Your privacy is important to us.

        We collect information such as name, email address,
        phone number, profile information, and other information
        required to provide our services.

        We use this information to:
        - Create and manage your account
        - Provide application services
        - Process payments
        - Send important notifications
        - Improve our services
        - Provide customer support

        We do not sell your personal information to third parties.

        We may share information with trusted service providers
        when required to provide our services.

        You may request access, correction, or deletion of your
        personal information subject to applicable laws.

        By using our application, you acknowledge this Privacy Policy.
      `,
    },
  });
};

export const termsAndConditions = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      title: "Terms and Conditions",
      version: "1.0",
      effectiveDate: "2026-09-24",
      content: `
        By registering for and using our application, you agree
        to these Terms and Conditions.

        1. Account
        You are responsible for maintaining the security of your
        account and login credentials.

        2. Acceptable Use
        You agree not to misuse the application, upload illegal
        content, impersonate another person, or attempt to gain
        unauthorized access.

        3. Subscriptions and Payments
        Paid plans and subscriptions are subject to the applicable
        pricing, duration, and payment terms displayed in the application.

        4. User Content
        You are responsible for the content you upload, publish,
        or share through the application.

        5. Account Suspension
        We may suspend or terminate accounts that violate these
        Terms and Conditions or applicable laws.

        6. Changes
        We may update these Terms and Conditions from time to time.
        Continued use of the application after changes means you
        accept the updated terms.

        7. Contact
        For questions regarding these Terms and Conditions,
        please contact our support team.
      `,
    },
  });
};