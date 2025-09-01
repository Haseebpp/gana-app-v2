/**
 * Order validation: sanitize first, then validate.
 * Required (create): serviceType, pickupDate, pickupTime, deliveryDate, deliveryTime,
 * pickupPlaceId, deliveryPlaceId, garmentCount, totalPrice, status,
 * and BOTH invariants: (pickupLocation || pickupAddress) AND (deliveryLocation || deliveryAddress).
 * Optional: instructions.
 */
import validator from "validator";

const STATUS = ["pending", "in_progress", "ready", "completed"];
const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIME_12H = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
const isTime = (s) => TIME_24H.test(s) || TIME_12H.test(s);
const isDate = (v) => !Number.isNaN(new Date(v).getTime());

const toStr = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
const toNum = (v) => (typeof v === "number" ? v : Number(v));

const sanitize = (raw) => ({
  serviceType: toStr(raw?.serviceType).trim(),

  pickupDate: raw?.pickupDate,
  pickupTime: toStr(raw?.pickupTime).trim(),
  deliveryDate: raw?.deliveryDate,
  deliveryTime: toStr(raw?.deliveryTime).trim(),

  pickupLocation: raw?.pickupLocation,       // { type: 'Point', coordinates: [lng, lat] }
  pickupAddress: toStr(raw?.pickupAddress).trim(),
  pickupPlaceId: toStr(raw?.pickupPlaceId).trim(),

  deliveryLocation: raw?.deliveryLocation,   // { type: 'Point', coordinates: [lng, lat] }
  deliveryAddress: toStr(raw?.deliveryAddress).trim(),
  deliveryPlaceId: toStr(raw?.deliveryPlaceId).trim(),

  instructions: toStr(raw?.instructions).trim(), // optional
  garmentCount: raw?.garmentCount,
  totalPrice: raw?.totalPrice,
  status: toStr(raw?.status).trim(),
});

const hasGeo = (pl) => {
  const c = pl?.coordinates;
  if (!Array.isArray(c) || c.length !== 2) return false;
  const [lng, lat] = c.map(Number);
  return Number.isFinite(lng) && Number.isFinite(lat) &&
         lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

const requireEither = (geo, addr, fieldBase, errors, humanLabel) => {
  const okGeo = hasGeo(geo);
  const okAddr = !validator.isEmpty(addr || "");
  if (!okGeo && !okAddr) errors[`${fieldBase}Error`] = `Provide either ${humanLabel} location or a detailed ${humanLabel} address.`;
};

const reqDate = (label, v, errors) => {
  if (v == null || v === "") errors[`${label}Error`] = `${label.replace("Date"," date")} is required`;
  else if (!isDate(v)) errors[`${label}Error`] = `${label.replace("Date"," date")} is invalid`;
};
const reqTime = (label, v, errors) => {
  if (validator.isEmpty(v || "")) errors[`${label}Error`] = `${label.replace("Time"," time")} is required`;
  else if (!isTime(v)) errors[`${label}Error`] = `${label.replace("Time"," time")} must be HH:MM (24h) or HH:MM AM/PM`;
};
const posInt = (label, v, min, errors) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) errors[`${label}Error`] = `${label} must be a number`;
  else if (!Number.isInteger(n) || n < min) errors[`${label}Error`] = `${label} must be an integer >= ${min}`;
};
const nonNeg = (label, v, errors) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) errors[`${label}Error`] = `${label} must be a number`;
  else if (n < 0) errors[`${label}Error`] = `${label} must be >= 0`;
};

// --- Create -----------------------------------------------------------------
const validateCreateOrder = (data) => {
  const d = sanitize(data);
  const errors = {};

  if (validator.isEmpty(d.serviceType)) errors.serviceTypeError = "Service type is required";

  reqDate("pickupDate", d.pickupDate, errors);
  reqTime("pickupTime", d.pickupTime, errors);
  reqDate("deliveryDate", d.deliveryDate, errors);
  reqTime("deliveryTime", d.deliveryTime, errors);

  if (validator.isEmpty(d.pickupPlaceId)) errors.pickupPlaceIdError = "pickupPlaceId is required";
  if (validator.isEmpty(d.deliveryPlaceId)) errors.deliveryPlaceIdError = "deliveryPlaceId is required";

  requireEither(d.pickupLocation, d.pickupAddress, "pickupAddress", errors, "pickup");
  requireEither(d.deliveryLocation, d.deliveryAddress, "deliveryAddress", errors, "delivery");

  if (d.garmentCount == null) errors.garmentCountError = "Garment count is required";
  else posInt("garmentCount", d.garmentCount, 1, errors);

  if (d.totalPrice == null) errors.totalPriceError = "Total price is required";
  else nonNeg("totalPrice", d.totalPrice, errors);

  if (validator.isEmpty(d.status)) errors.statusError = "Status is required";
  else if (!STATUS.includes(d.status)) errors.statusError = `Status must be one of: ${STATUS.join(", ")}`;

  // Optional extra: if provided, ensure coords are valid
  if (d.pickupLocation && !hasGeo(d.pickupLocation)) errors.pickupLocationError = "pickupLocation.coordinates must be [lng, lat] within valid bounds";
  if (d.deliveryLocation && !hasGeo(d.deliveryLocation)) errors.deliveryLocationError = "deliveryLocation.coordinates must be [lng, lat] within valid bounds";

  return { errors, valid: Object.keys(errors).length === 0, sanitized: d };
};

// --- Update (partial) -------------------------------------------------------
const validateUpdateOrder = (data, existing) => {
  const d = sanitize(data);
  const errors = {};

  if (data?.serviceType !== undefined && validator.isEmpty(d.serviceType))
    errors.serviceTypeError = "Service type cannot be empty";

  if (data?.pickupDate !== undefined) reqDate("pickupDate", d.pickupDate, errors);
  if (data?.pickupTime !== undefined) reqTime("pickupTime", d.pickupTime, errors);
  if (data?.deliveryDate !== undefined) reqDate("deliveryDate", d.deliveryDate, errors);
  if (data?.deliveryTime !== undefined) reqTime("deliveryTime", d.deliveryTime, errors);

  if (data?.pickupPlaceId !== undefined && validator.isEmpty(d.pickupPlaceId))
    errors.pickupPlaceIdError = "pickupPlaceId cannot be empty";
  if (data?.deliveryPlaceId !== undefined && validator.isEmpty(d.deliveryPlaceId))
    errors.deliveryPlaceIdError = "deliveryPlaceId cannot be empty";

  if (data?.garmentCount !== undefined) posInt("garmentCount", d.garmentCount, 1, errors);
  if (data?.totalPrice !== undefined) nonNeg("totalPrice", d.totalPrice, errors);

  if (data?.status !== undefined) {
    if (validator.isEmpty(d.status)) errors.statusError = "Status cannot be empty";
    else if (!STATUS.includes(d.status)) errors.statusError = `Status must be one of: ${STATUS.join(", ")}`;
  }

  // Location invariants on merged state
  if (data?.pickupLocation !== undefined && d.pickupLocation && !hasGeo(d.pickupLocation))
    errors.pickupLocationError = "pickupLocation.coordinates must be [lng, lat] within valid bounds";
  if (data?.deliveryLocation !== undefined && d.deliveryLocation && !hasGeo(d.deliveryLocation))
    errors.deliveryLocationError = "deliveryLocation.coordinates must be [lng, lat] within valid bounds";

  if (data?.pickupLocation !== undefined || data?.pickupAddress !== undefined) {
    const merged = {
      pickupLocation: data?.pickupLocation !== undefined ? d.pickupLocation : existing?.pickupLocation,
      pickupAddress: data?.pickupAddress !== undefined ? d.pickupAddress : (existing?.pickupAddress || ""),
    };
    requireEither(merged.pickupLocation, merged.pickupAddress, "pickupAddress", errors, "pickup");
  }

  if (data?.deliveryLocation !== undefined || data?.deliveryAddress !== undefined) {
    const merged = {
      deliveryLocation: data?.deliveryLocation !== undefined ? d.deliveryLocation : existing?.deliveryLocation,
      deliveryAddress: data?.deliveryAddress !== undefined ? d.deliveryAddress : (existing?.deliveryAddress || ""),
    };
    requireEither(merged.deliveryLocation, merged.deliveryAddress, "deliveryAddress", errors, "delivery");
  }

  return { errors, valid: Object.keys(errors).length === 0, sanitized: d };
};

export { validateCreateOrder, validateUpdateOrder, STATUS };
