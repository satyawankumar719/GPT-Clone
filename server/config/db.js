import mongoose from "mongoose";
import { APP_CONFIG } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);

  }
};

export default connectDB;