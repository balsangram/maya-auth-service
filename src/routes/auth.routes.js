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
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/v1/register", register);
router.post("/v1/login", login);
router.post("/v1/logout",authMiddleware,authorize("User"), logout);

router.post("/v1/forgot-password", forgotPassword);
router.post("/v1/change-password",authMiddleware,authorize("User"), changePassword);

router.post("/v1/send-otp", sendOtp);
router.post("/v1/verify-otp", verifyOtp);

// ==============================
// Legal
// ==============================

router.get("/v1/privacy-policy", privacyPolicy);

router.get("/v1/terms-and-conditions", termsAndConditions);


export default router;