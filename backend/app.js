import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/ConnectDB.js";
import authRoute from "./Routes/authRoute.js";
import taskRoute from "./Routes/taskRoute.js";
import userRoute from "./Routes/userRoute.js";

//js extension laga dena kabhi bhi inme nahi toh apni error aa jaega

dotenv.config();

const app = express();

const allowedOriginals = "https://task-manager-sigma-sage.vercel.app";

app.use(cors({ origin: allowedOriginals, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set request timeout to 60 seconds
app.use((req, res, next) => {
  req.setTimeout(60000); // 60 seconds
  res.setTimeout(60000); // 60 seconds
  next();
});
connectDB();
const PORT = process.env.PORT || 5000;

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/auth", authRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Shelby");
});

app.listen(PORT, () => {
  console.log(`server is running under ${PORT}`);
});
