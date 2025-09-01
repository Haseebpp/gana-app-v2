// Orders: create/list/get/update (user-scoped)

import asyncHandler from "express-async-handler";
import { Order } from "../models/order.model.js";
import { validateCreateOrder, validateUpdateOrder } from "../validation/order.validation.js";

const normPoint = (p) =>
  p?.coordinates
    ? { type: "Point", coordinates: [Number(p.coordinates[0]), Number(p.coordinates[1])] }
    : undefined;

const toPublicOrder = (o) => ({
  id: String(o._id),
  customer: String(o.customer),
  serviceType: o.serviceType,

  pickupDate: o.pickupDate,
  pickupTime: o.pickupTime,
  deliveryDate: o.deliveryDate,
  deliveryTime: o.deliveryTime,

  pickupLocation: o.pickupLocation,
  pickupAddress: o.pickupAddress,
  pickupPlaceId: o.pickupPlaceId,

  deliveryLocation: o.deliveryLocation,
  deliveryAddress: o.deliveryAddress,
  deliveryPlaceId: o.deliveryPlaceId,

  instructions: o.instructions,
  garmentCount: o.garmentCount,
  totalPrice: o.totalPrice,
  status: o.status,

  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
});

// @desc   Create order for current user
// @route  POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
  const { errors, valid, sanitized } = validateCreateOrder(req.body || {});
  if (!valid) return res.status(422).json({ message: "Validation failed", errors });

  const order = await Order.create({
    ...sanitized,
    pickupLocation: normPoint(sanitized.pickupLocation),
    deliveryLocation: normPoint(sanitized.deliveryLocation),
    customer: req.user._id, // authoritative
  });

  return res.status(201).json({ order: toPublicOrder(order) });
});

// @desc   List my orders (optional status filter; pagination)
// @route  GET /api/orders/my
// @access Private
const listMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));

  const q = { customer: req.user._id };
  if (req.query.status) q.status = req.query.status;

  const [items, total] = await Promise.all([
    Order.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(q),
  ]);

  return res.status(200).json({ page, limit, total, orders: items.map(toPublicOrder) });
});

// @desc   Get a single order I own
// @route  GET /api/orders/:id
// @access Private
const getMyOrder = asyncHandler(async (req, res) => {
  const o = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!o) return res.status(404).json({ message: "Order not found" });
  return res.status(200).json({ order: toPublicOrder(o) });
});

// @desc   Update my order (partial) with location invariants
// @route  PATCH /api/orders/:id
// @access Private
const updateMyOrder = asyncHandler(async (req, res) => {
  const existing = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!existing) return res.status(404).json({ message: "Order not found" });

  const { errors, valid, sanitized } = validateUpdateOrder(req.body || {}, existing);
  if (!valid) return res.status(422).json({ message: "Validation failed", errors });

  const allowed = [
    "serviceType",
    "pickupDate",
    "pickupTime",
    "deliveryDate",
    "deliveryTime",
    "pickupLocation",
    "pickupAddress",
    "pickupPlaceId",
    "deliveryLocation",
    "deliveryAddress",
    "deliveryPlaceId",
    "instructions",
    "garmentCount",
    "totalPrice",
    "status",
  ];

  for (const k of allowed) {
    if (!(k in sanitized)) continue;
    if (k === "pickupLocation") {
      existing.pickupLocation = normPoint(sanitized.pickupLocation);
    } else if (k === "deliveryLocation") {
      existing.deliveryLocation = normPoint(sanitized.deliveryLocation);
    } else {
      existing[k] = sanitized[k];
    }
  }

  await existing.save();
  return res.status(200).json({ order: toPublicOrder(existing) });
});

export { createOrder, listMyOrders, getMyOrder, updateMyOrder };
