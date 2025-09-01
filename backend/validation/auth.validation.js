/**
 * Validation utilities for register/login flows targeting the User schema.
 * Philosophy: never mutate inputs; sanitize, then validate.
 * Fields: name (string, required), number (string, required, unique), password (string, min 6)
 */
import validator from "validator";

// --- Config -----------------------------------------------------------------
const MIN_PASSWORD_LENGTH = 6;
// liberal default: optional "+" then 7-15 digits
const PHONE_NUMBER = /^\+?\d{7,15}$/;

// Centralized messages (easy to translate/tune)
const MSG = {
  required: (f) => `${f} is required`,
  numberFormat: "Number must be 7-15 digits (optional +)",
  numberExists: "User already exists",
  numberMissingUser: "User does not exist",
  passwordMin: `Password length must be at least ${MIN_PASSWORD_LENGTH} characters`,
  passwordMismatch: "Password and repeat password must be the same",
};

// --- Helpers ----------------------------------------------------------------
const toStr = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
const sanitize = (raw) => ({
  name: toStr(raw?.name).trim(),
  number: toStr(raw?.number).trim(),
  password: toStr(raw?.password),
  repeatPassword: toStr(raw?.repeatPassword), // optional
  userExist: Boolean(raw?.userExist),
});

// --- Register ---------------------------------------------------------------
const validateRegister = (data) => {
  const d = sanitize(data);
  const errors = {};

  // name
  if (validator.isEmpty(d.name)) errors.nameError = MSG.required("Name");

  // number
  if (validator.isEmpty(d.number)) errors.numberError = MSG.required("Number");
  else if (!PHONE_NUMBER.test(d.number)) errors.numberError = MSG.numberFormat;

  // password
  if (validator.isEmpty(d.password)) errors.passwordError = MSG.required("Password");
  else if (d.password.length < MIN_PASSWORD_LENGTH) errors.passwordError = MSG.passwordMin;

  // repeatPassword (optional). If present, must match.
  if (!validator.isEmpty(d.repeatPassword) && d.password !== d.repeatPassword)
    errors.repeatPasswordError = MSG.passwordMismatch;

  // pre-checked existence (typically set by service/db layer)
  if (d.userExist) errors.numberError = MSG.numberExists;

  return { errors, valid: Object.keys(errors).length === 0 };
};

// --- Login ------------------------------------------------------------------
const validateLogin = (data) => {
  const d = sanitize(data);
  const errors = {};

  // number
  if (validator.isEmpty(d.number)) errors.numberError = MSG.required("Number");
  else if (!PHONE_NUMBER.test(d.number)) errors.numberError = MSG.numberFormat;

  // password
  if (validator.isEmpty(d.password)) errors.passwordError = MSG.required("Password");
  else if (d.password.length < MIN_PASSWORD_LENGTH) errors.passwordError = MSG.passwordMin;

  // existence flag from caller (DB lookup result)
  if (d.userExist === false) errors.numberError = MSG.numberMissingUser;

  return { errors, valid: Object.keys(errors).length === 0 };
};

// --- Update Profile ---------------------------------------------------------
const validateUpdate = (data) => {
  const d = sanitize(data);
  const errors = {};

  // name (required on update)
  if (validator.isEmpty(d.name)) errors.nameError = MSG.required("Name");

  // number (required)
  if (validator.isEmpty(d.number)) errors.numberError = MSG.required("Number");
  else if (!PHONE_NUMBER.test(d.number)) errors.numberError = MSG.numberFormat;

  // optional password
  if (!validator.isEmpty(d.password) && d.password.length < MIN_PASSWORD_LENGTH) {
    errors.passwordError = MSG.passwordMin;
  }

  // If either password or repeatPassword present, they must match
  const pwdProvided = !validator.isEmpty(d.password) || !validator.isEmpty(d.repeatPassword);
  if (pwdProvided && d.password !== d.repeatPassword) errors.repeatPasswordError = MSG.passwordMismatch;

  // number conflict flagged by caller
  if (d.userExist) errors.numberError = MSG.numberExists;

  return { errors, valid: Object.keys(errors).length === 0 };
};

export { validateRegister, validateLogin, validateUpdate };
