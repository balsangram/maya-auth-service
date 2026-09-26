import User from "../models/user.model.js";

export const findAllGlobalUsers = async ({
  skip = 0,
  limit = 10,
  search = "",
}) => {
  const filter = {};

  const searchValue = search?.trim();

  if (searchValue) {
    filter.$or = [
      {
        username: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
  };
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const updateUserProfile = async (
  userId,
  updateData
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select(
    "-password -refreshToken -fcmToken -profileImagePublicId"
  );
};

export const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

const toPublicUser = (user) => {
  if (!user) return null;

  const image = user.profileImage || user.image || null;

  return {
    _id: user._id,
    name: user.name || user.username || null,
    username: user.username || null,
    image: image && String(image).trim() ? image : null,
  };
};

export const findUserByIdRepository = async (userId) => {
  const user = await User.findById(userId)
    .select("_id name username image profileImage")
    .lean();

  return toPublicUser(user);
};

/**
 * Get multiple users by IDs
 */
export const findUsersByIdsRepository = async (userIds) => {
  const users = await User.find({
    _id: { $in: userIds },
  })
    .select("_id name username image profileImage")
    .lean();

  return users.map(toPublicUser);
};

