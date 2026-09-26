import {
  findAdminById,
  updateAdminById,
} from "../repositories/admin.repository.js";

// ============================================
// Get Admin Profile
// ============================================
export const getAdminProfileService = async (adminId) => {
  const admin = await findAdminById(adminId);

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};

// ============================================
// Update Admin Profile
// ============================================
export const updateAdminProfileService = async (adminId, data) => {
  const { name, phone, image } = data;

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (phone !== undefined) {
    updateData.phone = phone;
  }

  if (image !== undefined) {
    updateData.image = image;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  const admin = await updateAdminById(adminId, updateData);

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};