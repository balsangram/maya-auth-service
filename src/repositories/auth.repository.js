import Auth from "../models/auth.models.js";
import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import { comparePassword } from "../utils/password.js";

// ==========================================
// Check Username - User only
// ==========================================

export const checkIsUserNameExist = async (username) => {
  const user = await User.findOne({ username });

  return !!user;
};

// ==========================================
// Check Email - All Roles
// ==========================================

export const checkIsEmailExist = async (email) => {
  const auth = await Auth.findOne({ email });

  return !!auth;
};

// ==========================================
// Create User
// ==========================================

export const createUser = async (userData) => {
  return await User.create(userData);
};

// ==========================================
// Find User By Email
// ==========================================

export const findUserByEmail = async (email) => {
  return await Auth.findOne({ email })
    .select("+password +refreshToken +fcmToken");
};

// ==========================================
// Find Auth By ID
// ==========================================

export const findAuthById = async (userId) => {
  return await Auth.findById(userId)
    .select("+password +refreshToken +fcmToken");
};

// ==========================================
// Find User By ID
// ==========================================

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

// ==========================================
// Validate Password
// ==========================================

export const validatePassword = async (
  inputPassword,
  storedPassword
) => {
  return await comparePassword(
    inputPassword,
    storedPassword
  );
};

// ==========================================
// Update Refresh Token
// All Roles
// ==========================================

export const updateRefreshToken = async (
  userId,
  refreshToken
) => {
  return await Auth.findByIdAndUpdate(
    userId,
    {
      refreshToken,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Clear Refresh Token
// All Roles
// ==========================================

export const clearRefreshToken = async (userId) => {
  return await Auth.findByIdAndUpdate(
    userId,
    {
      refreshToken: null,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Update FCM Token
// All Roles
// ==========================================

export const updateFcmToken = async (
  userId,
  fcmToken
) => {
  return await Auth.findByIdAndUpdate(
    userId,
    {
      fcmToken,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Remove FCM Token
// All Roles
// ==========================================

export const removeFcmToken = async (userId) => {
  return await Auth.findByIdAndUpdate(
    userId,
    {
      fcmToken: null,
    },
    {
      new: true,
    }
  );
};

// ==========================================
// Update Auth Profile
// All Roles
// ==========================================

export const updateAuthProfile = async (
  userId,
  updateData
) => {
  return await Auth.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// Check Active Account
// ==========================================

export const findActiveAuthByEmail = async (email) => {
  return await Auth.findOne({
    email,
    isActive: true,
  }).select("+password +refreshToken +fcmToken");
};


export const logoutUserRepository = async (userId, fcmToken, refreshToken) => {
  const user = await Auth.findOneAndUpdate(
    {
      _id: userId,
      fcmToken: fcmToken,
      refreshToken: refreshToken,
    },
    {
      $set: {
        fcmToken: null,
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  return user;
};

export const findUserRepository = async (userId) => {
  return await User.findById(userId).select(
    "+password -refreshToken -fcmToken -profileImagePublicId"
  );
};

export const updatePassword = async (userId, newPassword) => {
  return await Auth.findByIdAndUpdate(
    userId,
    {
      $set: {
        password: newPassword,
      },
    },
    {
      new: true,
    }
  );
};
export const isPasswordValidRepository = async (oldPassword, userId) => {
  const user = await Auth.findById(userId).select("+password");

  if (!user) {
    return false;
  }

  return await comparePassword(oldPassword, user.password);
};

export const updatePasswordRepository = async (userId, hashedPassword) => { 
  console.log("updatePasswordRepository called with:", { userId, hashedPassword });
 return await Auth.findByIdAndUpdate(
    userId,
    {
      $set: {
        password: hashedPassword,
      },
    },
    {
      new: true,
    }
  );  
}

export const updateOtpRepository = async (userId, otp) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

  return await Otp.findOneAndUpdate(
    { userId },
    {
      $set: {
        otp,
        expiresAt,
        verified: false,
        attempts: 0,
      },
    },
    {
      new: true,
      upsert: true, // Create a new document if it doesn't exist
    }
  );
}

export const findUserOtpRepository = async (userId) => {
  return await Otp.findOne({ userId });
}