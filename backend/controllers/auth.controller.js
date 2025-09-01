// Handles user registration, login, and profile retrieval.

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

import { User } from "../models/user.model.js";
import { validateRegister, validateLogin } from "../validation/auth.validation.js";

// tunables (can be set via env)
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5h";

// sign a JWT with user id payload
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret missing");
  return jwt.sign({ id }, secret, { expiresIn: JWT_EXPIRES_IN });
};
const toPublicUser = (u) => ({ id: String(u._id), name: u.name, number: u.number });

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, number, password } = req.body || {};

  // check if number already exists
  const existing = await User.findOne({ number });

  // validate input against schema + existence
  const { errors, valid } = validateRegister({
    name,
    number,
    password,
    userExist: Boolean(existing),
  });

  if (!valid) return res.status(422).json({ errors });

  // hash password securely
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // persist user
  const user = await User.create({ name, number, password: hashedPassword });

  // respond with token + profile basics
  return res.status(201).json({ token: generateToken(user._id), user: toPublicUser(user) });
});

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { number, password } = req.body || {};

  // lookup candidate user
  const user = await User.findOne({ number });

  // validate basic payload
  const { errors, valid } = validateLogin({ number, password, userExist: Boolean(user) });

  if (!valid) return res.status(422).json({ errors });

  // verify credentials
  const passwordOk = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !passwordOk) return res.status(401).json({ message: "Invalid credentials" });

  // successful login
  return res.status(200).json({ token: generateToken(user._id), user: toPublicUser(user) });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (JWT required)
const getProfile = asyncHandler(async (req, res) => {
  const u = req.user; // set by authGuard
  return res.status(200).json({ user: toPublicUser(u) });
});

export { registerUser, loginUser, getProfile };
