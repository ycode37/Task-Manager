import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(process.env.MONGO, {
      
    });
    console.log(`DB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('DB connection error:', error.message);
    // Exit process if DB connection fails
    process.exit(1);
  }
};
