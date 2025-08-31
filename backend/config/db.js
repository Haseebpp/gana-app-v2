import mongoose from "mongoose";

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI not set in environment");
  }
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(mongoUri, {
      // Defaults are fine for Mongoose v8; options kept minimal
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

