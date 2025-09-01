import mongoose from "mongoose";

const STATUS = ["pending", "in_progress", "ready", "completed"];

const orderSchema = new mongoose.Schema(
  {
    // Always linked to a registered user
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Flexible service type (no enum)
    serviceType: { type: String, required: true, trim: true },

    // Pickup scheduling
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true, trim: true }, // "14:05" or "2:05 PM"

    // Delivery scheduling
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, required: true, trim: true },

    // ---- Pickup location (choose one: geo OR address) ----
    pickupLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: {
        type: [Number], // [lng, lat]
        validate: {
          validator: (v) => !v || (Array.isArray(v) && v.length === 2 && v.every((n) => Number.isFinite(n))),
          message: "pickupLocation.coordinates must be [lng, lat]",
        },
      },
    },
    pickupAddress: { type: String, trim: true },
    pickupPlaceId: { type: String, required: true, trim: true },

    // ---- Delivery location (choose one: geo OR address) ----
    deliveryLocation: {
      type: { type: String, enum: ["Point"] },
      coordinates: {
        type: [Number], // [lng, lat]
        validate: {
          validator: (v) => !v || (Array.isArray(v) && v.length === 2 && v.every((n) => Number.isFinite(n))),
          message: "deliveryLocation.coordinates must be [lng, lat]",
        },
      },
    },
    deliveryAddress: { type: String, trim: true },
    deliveryPlaceId: { type: String, required: true, trim: true },

    // Optional notes
    instructions: { type: String, trim: true, default: "", maxlength: 2000 },

    // Order details
    garmentCount: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },

    // Workflow state
    status: { type: String, enum: STATUS, required: true, index: true },
  },
  { timestamps: true }
);

// Require either geo or address for BOTH pickup and delivery
orderSchema.pre("validate", function (next) {
  const has = (coords, addr) =>
    (Array.isArray(coords) &&
      coords.length === 2 &&
      coords.every((n) => Number.isFinite(n))) ||
    (typeof addr === "string" && addr.trim().length > 0);

  if (!has(this.pickupLocation?.coordinates, this.pickupAddress)) {
    this.invalidate("pickupAddress", "Provide either pickup current location or a detailed pickup address.");
  }

  if (!has(this.deliveryLocation?.coordinates, this.deliveryAddress)) {
    this.invalidate("deliveryAddress", "Provide either delivery location or a detailed delivery address.");
  }

  next();
});

// Indexes
orderSchema.index({ createdAt: -1 });
orderSchema.index({ pickupLocation: "2dsphere" });
orderSchema.index({ deliveryLocation: "2dsphere" });

// Clean up incomplete geo subdocs on save to avoid invalid index keys
orderSchema.pre("save", function (next) {
  const isValidCoords = (pl) => Array.isArray(pl?.coordinates) && pl.coordinates.length === 2 && pl.coordinates.every((n) => Number.isFinite(n));
  if (this.pickupLocation && !isValidCoords(this.pickupLocation)) {
    this.pickupLocation = undefined;
  }
  if (this.deliveryLocation && !isValidCoords(this.deliveryLocation)) {
    this.deliveryLocation = undefined;
  }
  next();
});

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
