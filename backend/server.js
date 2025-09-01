import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -----------------------
// Middleware
// -----------------------
app.use(express.json()); // Parse incoming JSON requests (req.body)
app.use(cookieParser()); // Parse cookies for authentication/session handling

// Enable CORS (Cross-Origin Resource Sharing)
// "credentials: true" allows cookies/headers between FE & BE
const origins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

// -----------------------
// Health Check Route
// -----------------------
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
  });
});

// -----------------------
// API Routes
// -----------------------
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// -----------------------
// Error Handling Middleware
// -----------------------
app.use(notFound); // Handle 404s
app.use(errorHandler); // Centralized error handler

// -----------------------
// Production Static File Serving
// -----------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Catch-all route to serve React/SPA frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// -----------------------
// Server Startup Function
// -----------------------
async function start() {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () =>
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
