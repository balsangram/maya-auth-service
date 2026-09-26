import Payment from "../models/Payment.model.js";
import Subscription from "../models/Subscription.model.js";

// Find payment by Razorpay payment ID
export const findPaymentByProviderPaymentId = async (
  providerPaymentId
) => {
  return await Payment.findOne({
    providerPaymentId,
  });
};


// Create payment
export const createPayment = async (data) => {
  return await Payment.create(data);
};


// Update payment
export const updatePayment = async (
  paymentId,
  data
) => {
  return await Payment.findByIdAndUpdate(
    paymentId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};


// Find user's subscription
export const findSubscriptionByUserId = async (
  userId
) => {
  return await Subscription.findOne({
    userId,
  }).populate("planId");
};


// Find subscription by Razorpay subscription ID
export const findSubscriptionByProviderId = async (
  providerSubscriptionId
) => {
  return await Subscription.findOne({
    providerSubscriptionId,
  });
};


// Update subscription
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