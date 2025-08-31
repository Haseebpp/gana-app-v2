// Handles user registration, login, and profile retrieval.

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/user.model')
const {
  validateRegister,
  validateLogin,
} = require('../validation/user.validation')

// --- config sanity checks ----------------------------------------------------
// Fail fast if env is missing critical secrets
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET not set')
  process.exit(1)
}

// tunables (can be set via env)
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5h'

// sign a JWT with user id payload
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// @desc    Register new user
// @route   POST /api/user/register
// @access  Public
// @expected-payload
// {
//   "name": "Alice",
//   "number": "0551234567",
//   "password": "secret123",
//   "repeatPassword": "secret123"
// }
const registerUser = asyncHandler(async (req, res) => {
  const { name, number, password, repeatPassword } = req.body || {}

  // check if number already exists
  const existing = await User.findOne({ number })

  // validate input against schema + existence
  const { errors, valid } = validateRegister({
    name,
    number,
    password,
    repeatPassword,
    userExist: Boolean(existing),
  })

  if (!valid) {
    return res.status(422).json({ success: false, errors })
  }

  // hash password securely
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS)

  // persist user
  const user = await User.create({
    name,
    number,
    password: hashedPassword,
  })

  // respond with token + profile basics
  return res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      number: user.number,
      token: generateToken(user._id),
    },
  })
})

// @desc    Authenticate user
// @route   POST /api/user/login
// @access  Public
// @expected-payload
// {
//   "number": "0551234567",
//   "password": "secret123"
// }
const loginUser = asyncHandler(async (req, res) => {
  const { number, password } = req.body || {}

  // lookup candidate user
  const user = await User.findOne({ number })

  // validate basic payload
  const { errors, valid } = validateLogin({
    number,
    password,
    userExist: Boolean(user),
  })

  if (!valid) {
    return res.status(422).json({ success: false, errors })
  }

  // verify credentials
  const passwordOk = user ? await bcrypt.compare(password, user.password) : false
  if (!user || !passwordOk) {
    return res
      .status(401)
      .json({ success: false, errors: { auth: 'Invalid credentials' } })
  }

  // successful login
  return res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      number: user.number,
      token: generateToken(user._id),
    },
  })
})

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private (JWT required)
// @expected-payload
//   (no body; must send header)
//   Authorization: Bearer <JWT>
const getProfile = asyncHandler(async (req, res) => {
  // auth middleware should already have set req.user
  const u = req.user
  return res.status(200).json({
    success: true,
    data: {
      _id: u._id,
      name: u.name,
      number: u.number,
    },
  })
})

module.exports = {
  registerUser,
  loginUser,
  getProfile,
}
