import {
  verifyPayment as verifyPaymentService,
  paymentWebhook as paymentWebhookService,
  recheckPayment as recheckPaymentService,
} from "../services/payment.service.js";

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("User ID:", userId);
    console.log("Verify payment request body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const payment = await verifyPaymentService({
      userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const recheckPayment = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;


    const result =
      await recheckPaymentService(
        userId
      );


    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Recheck payment error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentWebhook = async (
  req,
  res
) => {
  try {
    const signature =
      req.headers[
        "x-razorpay-signature"
      ];


    await paymentWebhookService(
      req.body,
      signature
    );


    return res.status(200).json({
      success: true,
      message:
        "Razorpay webhook processed successfully",
    });
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );


    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};