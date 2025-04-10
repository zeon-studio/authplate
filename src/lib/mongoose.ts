import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not defined in the environment variables.",
      );
    }

    if (mongoose.connection?.readyState === 0) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.DATABASE_URL);
      console.log("Successfully connected to MongoDB.");
    } else {
      console.log("Already connected to MongoDB.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectMongo;
