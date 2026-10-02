import Auth from "../models/auth.models.js";

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.js";

const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.headers["x-refresh-token"];
// console.log("Refresh token received:", refreshToken);
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
// console.log("Decoded refresh token:", decoded);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check refresh token against database
    const user = await Auth.findOne({
      _id: decoded.id,
    }).select("+refreshToken");
// console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or revoked",
      });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    // console.log("New access token generated:", accessToken);
    const newRefreshToken = generateRefreshToken(user);
// console.log("New refresh token generated:", newRefreshToken);
    // Replace old refresh token
    user.refreshToken = newRefreshToken;

    await user.save();

    // Attach user
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    // Attach tokens
    req.tokens = {
      accessToken,
      refreshToken: newRefreshToken,
    };

    next();
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};

export default refreshTokenMiddleware;