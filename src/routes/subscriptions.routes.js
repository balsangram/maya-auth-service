import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import {
  subscribePlan,
  cancelPlan,
  resubscribePlan,
} from "../controllers/subscription.controller.js";
import { verifyPayment } from "../services/payment.service.js";

const router = express.Router();

// Subscribe to a plan
router.post(
  "/v1/subscribe",
  authMiddleware,
  authorize("User"),
  subscribePlan
);
router.post(
  "/v1/verify-payment",
  authMiddleware,
  authorize("User"),
  verifyPayment
);

// Cancel subscription
router.patch(
  "/v1/cancel",
  authMiddleware,
  authorize("User"),
  cancelPlan
);

// Re-subscribe to the cancelled subscription
router.patch(
  "/v1/resubscribe",
  authMiddleware,
  authorize("User"),
  resubscribePlan
);

export default router;