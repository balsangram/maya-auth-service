import {
  subscribePlan as subscribePlanService,
  cancelPlan as cancelPlanService,
  resubscribePlan as resubscribePlanService,
} from "../services/subscription.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

// Subscribe → Create Razorpay Order
export const subscribePlan = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log(req.body,"=====",userId)
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({
      success: false,
      message: "Plan ID is required",
    });
  }

  const order = await subscribePlanService(
    userId,
    planId
  );

  successResponse(
    res,
    "Razorpay order created successfully",
    order,
    201
  );
});

// Cancel subscription
export const cancelPlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscription = await cancelPlanService(userId);

  successResponse(
    res,
    "Subscription cancelled successfully",
    subscription,
    200
  );
});

// Re-subscribe → Create Razorpay Order
export const resubscribePlan = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await resubscribePlanService(userId);

  successResponse(
    res,
    "Razorpay order created successfully",
    order,
    201
  );
});

