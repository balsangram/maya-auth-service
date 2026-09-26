import express from "express";

import {
  deleteUser,
  displayAllGlobalUsers,
  displayProfile,
  editProfile,
  getUserById,
  getUsersByIds,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { editProfileValidation } from "../validations/user.validation.js";

const router = express.Router();

router.get("/v1/profile", 
  authMiddleware, authorize("User"), 
  displayProfile);
router.patch("/v1/profile",
  authMiddleware, authorize("User"),
  upload.single("profileImage"),
  validate(editProfileValidation),
  editProfile);
router.delete("/v1/profile", 
  authMiddleware, 
  authorize("User"), 
  deleteUser)

router.get("/v1/global-users", authMiddleware, authorize("User"), displayAllGlobalUsers);

// Internal service-to-service endpoints (no user JWT)
router.get("/v1/internal/:userId", getUserById);
router.post("/v1/internal/by-ids", getUsersByIds);

export default router;