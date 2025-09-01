import { Router } from "express";
import { getProfile,registerUser,loginUser } from "../controllers/auth.controller.js";
import { authGuard } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authGuard, getProfile);

export default router;