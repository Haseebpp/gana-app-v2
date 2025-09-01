import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";

export const authGuard = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not set");
  }

  const decoded = jwt.verify(token, secret);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  req.user = user;
  next();
});
