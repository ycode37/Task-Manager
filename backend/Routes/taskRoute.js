import express from "express";
import { 
  createTask, 
  getAllTasks, 
  updateTask, 
  deleteTask, 
  toggleTaskCompletion,
  addComment
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const TaskRoute = express.Router();

// Admin-only routes (require both authentication and admin role)
TaskRoute.post("/create", authenticateToken, adminAuth, createTask);
TaskRoute.put("/update/:id", authenticateToken, adminAuth, updateTask);
TaskRoute.delete("/delete/:id", authenticateToken, adminAuth, deleteTask);

// Routes accessible by all authenticated users
TaskRoute.get("/all", authenticateToken, getAllTasks);
TaskRoute.patch("/toggle/:id", authenticateToken, toggleTaskCompletion);
TaskRoute.post("/comment/:id", authenticateToken, addComment);

export default TaskRoute;
