import Subscription from "../models/Subscription.model.js";

// ============================================
// Find user's subscription
// ============================================
export const findSubscriptionByUserId = async (userId) => {
  return await Subscription.findOne({
    userId,
  }).populate("planId");
};

// ============================================
// Find subscription by ID
// ============================================
export const findSubscriptionById = async (
  subscriptionId
) => {
  return await Subscription.findById(
    subscriptionId
  ).populate("planId");
};

// ============================================
// Create subscription
// ============================================
export const createSubscription = async (data) => {
  return await Subscription.create(data);
};

// ============================================
// Update subscription
// ============================================
export const updateSubscription = async (
  subscriptionId,
  data
) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate("planId");
};

// ============================================
// Find subscription by Razorpay order ID
// ============================================
export const findSubscriptionByRazorpayOrderId =
  async (razorpayOrderId) => {
    return await Subscription.findOne({
      razorpayOrderId,
    }).populate("planId");
  };

// ============================================
// Find active subscription
// ============================================
export const findActiveSubscriptionByUserId =
  async (userId) => {
    return await Subscription.findOne({
      userId,
      status: "active",
    }).populate("planId");
  };