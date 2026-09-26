import { getPlanById } from "../repositories/plan.repository.js";
import crypto from "crypto";
import {
  findSubscriptionByUserId,
  updateSubscription,
} from "../repositories/subscription.repository.js";

import razorpay from "../utils/razorpay.js";

// ============================================
// Subscribe
// Create Razorpay order
// ============================================
export const subscribePlan = async (userId, planId) => {
  console.log(userId, planId, "=====")
  const plan = await getPlanById(planId);

  if (!plan) {
    throw new Error("Plan not found");
  }

  if (!plan.isActive) {
    throw new Error("Plan is not active");
  }

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: "INR",
    receipt: `sub_${userId}_${Date.now()}`,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    planId: plan._id,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  };
};

// ============================================
// Cancel subscription
// ============================================
export const cancelPlan = async (userId) => {
  const subscription =
    await findSubscriptionByUserId(userId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  if (subscription.status !== "active") {
    throw new Error("Subscription is not active");
  }

  if (subscription.cancelAtPeriodEnd) {
    throw new Error(
      "Subscription is already scheduled for cancellation"
    );
  }

  const updatedSubscription =
    await updateSubscription(
      subscription._id,
      {
        cancelAtPeriodEnd: true,
        autoRenew: false,
      }
    );

  return updatedSubscription;
};

// ============================================
// Re-subscribe
// Create Razorpay order
// ============================================
export const resubscribePlan = async (userId) => {
  const subscription =
    await findSubscriptionByUserId(userId);

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const now = new Date();

  if (subscription.currentPeriodEnd <= now) {
    throw new Error(
      "Subscription has expired. Please subscribe again."
    );
  }

  if (
    subscription.status === "active" &&
    !subscription.cancelAtPeriodEnd
  ) {
    throw new Error("Subscription is already active");
  }

  const plan = await getPlanById(
    subscription.planId._id
  );

  if (!plan) {
    throw new Error("Plan not found");
  }

  if (!plan.isActive) {
    throw new Error("Plan is not active");
  }

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: "INR",
    receipt: `resub_${userId}_${Date.now()}`,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    planId: plan._id,
    subscriptionId: subscription._id,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  };
};

