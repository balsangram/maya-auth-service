import express from "express";

import {
  displayProfile,
  editProfile,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/v1/profile", 
    authMiddleware, authorize("Admin"), 
  displayProfile);
router.put("/v1/profile", authMiddleware, authorize("Admin"), editProfile);

export default router;