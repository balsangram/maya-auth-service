import crypto from "crypto";

import razorpay from "../utils/razorpay.js";
import {
  findPaymentByProviderPaymentId,
  createPayment,
  updatePayment,
  findSubscriptionByUserId,
  findSubscriptionByProviderId,
  updateSubscription,
} from "../repositories/payment.repository.js";


export const verifyPayment = async ({
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  // 1. Validate Razorpay details
  console.log("Verifying payment for user:", userId);
  console.log(
    "Razorpay Order ID:", razorpayOrderId
  );
  console.log(
    "Razorpay Payment ID:", razorpayPaymentId
  );
  console.log(
    "Razorpay Signature:", razorpaySignature
  );
  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    throw new Error(
      "Razorpay payment details are required"
    );
  }

  // 2. Create signature string
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  // 3. Generate expected signature
  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(body)
    .digest("hex");

  // 4. Verify signature
  if (expectedSignature !== razorpaySignature) {
    throw new Error(
      "Invalid Razorpay payment signature"
    );
  }

  // 5. Prevent duplicate payment
  const existingPayment =
    await findPaymentByProviderPaymentId(
      razorpayPaymentId
    );

  if (existingPayment) {
    return existingPayment;
  }

  // 6. Fetch payment from Razorpay to get amount (paise → rupees)
  const razorpayPayment =
    await razorpay.payments.fetch(razorpayPaymentId);

  if (!razorpayPayment?.amount) {
    throw new Error(
      "Unable to fetch payment amount from Razorpay"
    );
  }

  const amount = razorpayPayment.amount / 100;

  // 7. Save payment
  const payment = await createPayment({
    userId,
    amount,
    status: "completed",
    provider: "razorpay",
    providerPaymentId: razorpayPaymentId,
  });

  return payment;
};

export const recheckPayment = async (
  userId
) => {
  const subscription =
    await findSubscriptionByUserId(userId);


  // User has no subscription
  if (!subscription) {
    return {
      active: false,
      subscription: null,
    };
  }


  const now = new Date();


  // Subscription expired
  if (
    subscription.currentPeriodEnd <= now
  ) {
    const updatedSubscription =
      await updateSubscription(
        subscription._id,
        {
          status: "expired",
          autoRenew: false,
        }
      );


    return {
      active: false,
      subscription: updatedSubscription,
    };
  }


  // Subscription cancelled
  if (
    subscription.status === "cancelled"
  ) {
    return {
      active: false,
      subscription,
    };
  }


  // Subscription active
  return {
    active: true,
    subscription,
  };
};

export const paymentWebhook = async (
  rawBody,
  signature
) => {
  if (!signature) {
    throw new Error(
      "Razorpay webhook signature missing"
    );
  }


  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(rawBody)
      .digest("hex");


  if (
    expectedSignature !== signature
  ) {
    throw new Error(
      "Invalid Razorpay webhook signature"
    );
  }


  const event =
    JSON.parse(
      rawBody.toString()
    );


  switch (event.event) {
    case "payment.captured":
      await paymentCaptured(event);
      break;


    case "payment.failed":
      await paymentFailed(event);
      break;


    case "subscription.activated":
      await subscriptionActivated(event);
      break;


    case "subscription.cancelled":
      await subscriptionCancelled(event);
      break;


    default:
      console.log(
        "Unhandled Razorpay event:",
        event.event
      );
  }


  return true;
};

const paymentCaptured = async (
  event
) => {
  const paymentEntity =
    event.payload?.payment?.entity;


  if (!paymentEntity) {
    return;
  }


  const payment =
    await findPaymentByProviderPaymentId(
      paymentEntity.id
    );


  if (!payment) {
    return;
  }


  await updatePayment(
    payment._id,
    {
      status: "completed",
      paidAt: new Date(),
    }
  );
};

const paymentFailed = async (
  event
) => {
  const paymentEntity =
    event.payload?.payment?.entity;


  if (!paymentEntity) {
    return;
  }


  const payment =
    await findPaymentByProviderPaymentId(
      paymentEntity.id
    );


  if (!payment) {
    return;
  }


  await updatePayment(
    payment._id,
    {
      status: "failed",
    }
  );
};

const subscriptionActivated = async (
  event
) => {
  const subscriptionEntity =
    event.payload?.subscription?.entity;


  if (!subscriptionEntity) {
    return;
  }


  const subscription =
    await findSubscriptionByProviderId(
      subscriptionEntity.id
    );


  if (!subscription) {
    return;
  }


  await updateSubscription(
    subscription._id,
    {
      status: "active",
      autoRenew: true,
    }
  );
};

const subscriptionCancelled = async (
  event
) => {
  const subscriptionEntity =
    event.payload?.subscription?.entity;


  if (!subscriptionEntity) {
    return;
  }


  const subscription =
    await findSubscriptionByProviderId(
      subscriptionEntity.id
    );


  if (!subscription) {
    return;
  }


  await updateSubscription(
    subscription._id,
    {
      status: "cancelled",
      autoRenew: false,
      cancelledAt: new Date(),
    }
  );
};