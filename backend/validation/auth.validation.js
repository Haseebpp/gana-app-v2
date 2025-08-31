/**
 * Validation utilities for register/login flows targeting the User schema.
 * Philosophy: never mutate inputs; sanitize, then validate.
 * Fields: name (string, required), number (string, required, unique), password (string, min 6)
 */
const validator = require('validator')
const isEmpty = require('./isEmpty')

// --- Config -----------------------------------------------------------------
const MIN_PASSWORD_LENGTH = 6
const TEN_DIGIT_NUMBER = /^\d{10}$/ // adjust if your numbering rules differ

// Centralized messages (easy to translate/tune)
const MSG = {
  required: (f) => `${f} is required`,
  numberDigits: 'Number must be exactly 10 digits',
  numberExists: 'User already exists',
  numberMissingUser: 'User does not exist',
  passwordMin: `Password length must be at least ${MIN_PASSWORD_LENGTH} characters`,
  passwordMismatch: 'Password and repeat password must be the same',
}

// --- Helpers ----------------------------------------------------------------
const toStr = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v))
const sanitize = (raw) => ({
  // trim to prevent "  " from sneaking past isEmpty
  name: toStr(raw?.name).trim(),
  number: toStr(raw?.number).trim(),
  password: toStr(raw?.password),
  repeatPassword: toStr(raw?.repeatPassword),
  // Booleans should be booleans. Accept a few common shapes.
  userExist:
    typeof raw?.userExist === 'boolean'
      ? raw.userExist
      : ['true', '1', 1].includes(raw?.userExist),
})

// --- Register ---------------------------------------------------------------
const validateRegister = (data) => {
  const d = sanitize(data)
  const errors = {}

  // name
  if (validator.isEmpty(d.name)) {
    errors.nameError = MSG.required('Name')
  }

  // number
  if (validator.isEmpty(d.number)) {
    errors.numberError = MSG.required('Number')
  } else if (!TEN_DIGIT_NUMBER.test(d.number)) {
    errors.numberError = MSG.numberDigits
  }

  // password
  if (validator.isEmpty(d.password)) {
    errors.passwordError = MSG.required('Password')
  } else if (d.password.length < MIN_PASSWORD_LENGTH) {
    errors.passwordError = MSG.passwordMin
  }

  // repeatPassword
  if (validator.isEmpty(d.repeatPassword)) {
    errors.repeatPasswordError = MSG.required('Repeat password')
  } else if (d.password !== d.repeatPassword) {
    errors.repeatPasswordError = MSG.passwordMismatch
  }

  // pre-checked existence (typically set by service/db layer, e.g., found by number)
  if (d.userExist) {
    // surfacing on the "number" field mirrors unique index UX
    errors.numberError = MSG.numberExists
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  }
}

// --- Login ------------------------------------------------------------------
const validateLogin = (data) => {
  const d = sanitize(data)
  const errors = {}

  // number
  if (validator.isEmpty(d.number)) {
    errors.numberError = MSG.required('Number')
  } else if (!TEN_DIGIT_NUMBER.test(d.number)) {
    errors.numberError = MSG.numberDigits
  }

  // password
  if (validator.isEmpty(d.password)) {
    errors.passwordError = MSG.required('Password')
  } else if (d.password.length < MIN_PASSWORD_LENGTH) {
    errors.passwordError = MSG.passwordMin
  }

  // existence flag from caller (DB lookup result)
  if (d.userExist === false) {
    errors.numberError = MSG.numberMissingUser
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  }
}

module.exports = { validateRegister, validateLogin }
