import { Router } from "express";
import { getProfile, registerUser, loginUser, updateProfile, deleteProfile } from "../controllers/auth.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (no JWT required)
router.post("/register", registerUser); // POST /api/auth/register
router.post("/login", loginUser);       // POST /api/auth/login

// Private routes (JWT required)
router.get("/me", authGuard, getProfile); // GET /api/auth/me
router.put("/me", authGuard, updateProfile); // PUT /api/auth/me
router.delete("/me", authGuard, deleteProfile); // DELETE /api/auth/me

export default router;
