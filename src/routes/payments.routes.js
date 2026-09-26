import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import {
  verifyPayment,
  paymentWebhook,
  recheckPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Verify payment after checkout
router.post(
  "/v1/verify",
  authMiddleware,
  authorize("User"),
  verifyPayment
);

// Payment provider webhook
router.post(
  "/v1/webhook",
  paymentWebhook
);

// Re-check payment/subscription when app opens
router.get(
  "/v1/recheck",
  authMiddleware,
  authorize("User"),
  recheckPayment
);

export default router;