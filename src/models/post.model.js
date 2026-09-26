import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    mediaId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const postSchema = new mongoose.Schema(
  {
    // ==============================
    // Post Owner
    // ==============================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    // ==============================
    // Post Content
    // ==============================

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // ==============================
    // Images
    // ==============================

    images: {
      type: [mediaSchema],
      default: [],
    },

    // ==============================
    // Videos
    // ==============================

    videos: {
      type: [mediaSchema],
      default: [],
    },

    // ==============================
    // Post Status
    // ==============================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;