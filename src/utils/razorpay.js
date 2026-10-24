import Razorpay from "razorpay";
import env from "../config/env.js";

let instance = null;

const getRazorpayInstance = () => {
  if (!instance) {
    const keyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials are missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
      );
    }

    instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return instance;
};

const razorpayProxy = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getRazorpayInstance();
      const val = client[prop];
      return typeof val === "function" ? val.bind(client) : val;
    },
  }
);

export default razorpayProxy;