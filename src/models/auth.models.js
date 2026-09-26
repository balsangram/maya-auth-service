import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    // ==============================
    // Common fields
    // ==============================

    name: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    image: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    // ==============================
    // Authentication
    // ==============================

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    // ==============================
    // Firebase / Push Notification
    // ==============================

    fcmToken: {
      type: String,
      default: null,
      select: false,
    },

    // ==============================
    // Account status
    // ==============================

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // Subscription
    // ==============================

    subscription: {
     
      startDate: {
        type: Date,
        default: null,
      },

      endDate: {
        type: Date,
        default: null,
      },

      status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "expired",
      },

      paymentId: {
        type: String,
        default: null,
      },

      orderId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;