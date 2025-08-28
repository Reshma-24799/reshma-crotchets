import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, getDashboardStats } from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/", protect, admin, getUsers);
router.get("/dashboard/stats", protect, admin, getDashboardStats);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
