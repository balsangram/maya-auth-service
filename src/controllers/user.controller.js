import { deleteUserService, displayAllGlobalUsersService, displayUserDetailsService, editProfileService, getUserByIdService, getUsersByIdsService } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { paginationResponse, successResponse } from "../utils/response.js";

export const displayProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await displayUserDetailsService(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userResponse = {
    id: user._id,

    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,

    bio: user.bio,
    profileImage: user.profileImage,

    dateOfBirth: user.dateOfBirth,
    gender: user.gender,

    education: user.education,
    profession: user.profession,

    hobbies: user.hobbies,
    languages: user.languages,

    address: user.address,
    country: user.country,
    state: user.state,
    district: user.district,
    pin: user.pin,

    isProfilePublic: user.isProfilePublic,
  };

  return successResponse(
    res,
    "User profile retrieved successfully",
    userResponse,
    200
  );
});
export const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await editProfileService(
    userId,
    req.body,
    req.file
  );

  return successResponse(
    res,
    "Profile updated successfully",
    null,
    200
  );
});
export const displayAllGlobalUsers = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const result = await displayAllGlobalUsersService({
      page,
      limit,
      search,
    });

    return paginationResponse(
      res,
      "Global users fetched successfully",
      result.users,
      result.pagination.page,
      result.pagination.limit,
      result.total
    );
  }
);
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await deleteUserService(userId);

  return successResponse(
    res,
    "User deleted successfully"
  );
});

/**
 * Get user by ID
 *
 * GET /v1/internal/:userId
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await getUserByIdService(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

/**
 * Get multiple users by IDs
 *
 * POST /v1/internal/by-ids
 */
export const getUsersByIds = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "userIds must be a non-empty array",
    });
  }

  const users = await getUsersByIdsService(userIds);

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});