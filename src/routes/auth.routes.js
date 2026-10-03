import express from "express";

import {
  login,
  register,
  logout,
  forgotPassword,
  changePassword,
  sendOtp,
  verifyOtp,
  privacyPolicy,
  termsAndConditions,
  uploadProfile,
  addExtraDetails,
  generateTokens,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import cloudinaryUpload from "../utils/cloudinary.js";
import refreshTokenMiddleware from "../middlewares/refreshToken.middleware.js";

const router = express.Router();

router.post("/v1/register", register);
router.post("/v1/login", login);
router.post(
  "/v2/upload-profile",
  authMiddleware,
  cloudinaryUpload.single("profileImage"),
  uploadProfile
);
router.post("/v2/update-extra-details",authMiddleware ,addExtraDetails);

router.post("/v1/logout",authMiddleware,authorize("User"), logout);

router.post("/v1/forgot-password", forgotPassword);
router.post("/v1/change-password",authMiddleware,authorize("User"), changePassword);

router.post("/v1/send-otp", sendOtp);
router.post("/v1/verify-otp", verifyOtp);

router.get("/v2/generate-token", refreshTokenMiddleware, generateTokens);

// ==============================
// Legal
// ==============================

router.get("/v1/privacy-policy", privacyPolicy);

router.get("/v1/terms-and-conditions", termsAndConditions);


export default router;