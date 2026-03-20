import mongoose from "mongoose";
import { APP_CONFIG } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(APP_CONFIG.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;