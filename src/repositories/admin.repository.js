import Admin from "../models/admin.model.js";

// ============================================
// Get Admin Profile
// ============================================
export const findAdminById = async (adminId) => {
  return await Admin.findById(adminId).select(
    "-password -refreshToken -fcmToken"
  );
};

// ============================================
// Update Admin Profile
// ============================================
export const updateAdminById = async (adminId, updateData) => {
  return await Admin.findByIdAndUpdate(
    adminId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken -fcmToken");
};