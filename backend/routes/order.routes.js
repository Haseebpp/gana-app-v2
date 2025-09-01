import { Router } from "express";
import { authGuard } from "../middleware/auth.middleware.js";
import {
  createOrder,
  listMyOrders,
  getMyOrder,
  updateMyOrder,
} from "../controllers/order.controller.js";

const router = Router();

// All order routes are private (JWT required)
router.use(authGuard);

// POST /api/orders
router.post("/", createOrder);

// GET /api/orders/my
router.get("/my", listMyOrders);

// GET /api/orders/:id
router.get("/:id", getMyOrder);

// PATCH /api/orders/:id
router.patch("/:id", updateMyOrder);

export default router;

