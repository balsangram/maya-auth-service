import asyncHandler from "../utils/asyncHandler.js";

import {
  getAdminProfileService,
  updateAdminProfileService,
} from "../services/admin.service.js";

// ============================================
// GET ADMIN PROFILE
// ============================================
export const displayProfile = asyncHandler(async (req, res) => {
  const adminId = req.user.id;

  const admin = await getAdminProfileService(adminId);

  return res.status(200).json({
    success: true,
    message: "Admin profile retrieved successfully",
    data: admin,
  });
});

// ============================================
// UPDATE ADMIN PROFILE
// ============================================
export const editProfile = asyncHandler(async (req, res) => {
  const adminId = req.user.id;

  const admin = await updateAdminProfileService(
    adminId,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Admin profile updated successfully",
    data: admin,
  });
});