import Auth from "./auth.models.js";

const userSchema = new Auth.base.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    profession: {
      type: String,
      default: "",
      trim: true,
    },

    hobbies: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
      type: String,
      default: "",
      trim: true,
    },

    pin: {
      type: String,
      default: "",
      trim: true,
    },

    isProfilePublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = Auth.discriminator("User", userSchema);

export default User;