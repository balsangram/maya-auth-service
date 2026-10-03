import { deleteUserService, displayAllGlobalUsersService, displayUserDetailsService, editProfileService, getUserByIdService, getUsersByIdsService } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { paginationResponse, successResponse } from "../utils/response.js";
import { checkUserSubscriptionService } from "../services/auth.service.js";

export const displayProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await displayUserDetailsService(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

   const checkSubscription = await checkUserSubscriptionService(user._id);
  console.log("User details checkSubscription:", checkSubscription);
console.log("User details fetched:", user);
  const userResponse = {
    id: user._id,

    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,

    bio: user.bio,
    profileImage: user.image,

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
    isSubscribed: checkSubscription,
  };

  return successResponse(
    res,
    "User profile retrieved successfully",
    userResponse,
    200
  );
});

export const displayOtherUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { userId: otherUserId } = req.query;

  if (!otherUserId) {
    throw new ApiError(400, "Missing required query parameter: userId");
  }

  const user = await displayUserDetailsService(otherUserId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userResponse = {
    id: user._id,
    name: user.name,
    username: user.username,
    bio: user.bio,
    profileImage: user.image,
    isProfilePublic: user.isProfilePublic,
  };

  return successResponse(
    res,
    "Other user's profile retrieved successfully",
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

export const getUserLocation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await getUserByIdService(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const coordinates = user.location?.coordinates;
  const hasCoordinates =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    !(coordinates[0] === 0 && coordinates[1] === 0);

  const locationData = {
    country: user.country,
    state: user.state,
    district: user.district,
    pin: user.pin,
    latitude: hasCoordinates ? coordinates[1] : undefined,
    longitude: hasCoordinates ? coordinates[0] : undefined,
  };

  return res.status(200).json({
    success: true,
    message: "User location fetched successfully",
    data: locationData,
  });
});