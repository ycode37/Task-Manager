import Tasks from "../models/taskTodo.js";

// Create a new task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { task, description, priority, dueDate } = req.body;
    const { _id: createdBy, organization } = req.user;

    if (!task) {
      return res.status(400).json({ success: false, message: "Task is required" });
    }

    const newTask = await Tasks.create({
      task,
      description,
      priority,
      dueDate,
      createdBy,
      organization
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Get all tasks for the user's organization
export const getAllTasks = async (req, res) => {
  try {
    const { organization } = req.user;

    const tasks = await Tasks.find({ organization })
      .populate('createdBy', 'username email')
      .populate('comments.user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Update a task (Admin only)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, description, priority, dueDate } = req.body;

    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { task, description, priority, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete a task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Tasks.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Toggle task completion (Any authenticated user)
export const toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const task = await Tasks.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.completed = !task.completed;
    task.completedBy = task.completed ? userId : null;
    task.completedAt = task.completed ? new Date() : null;
    
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// Add a comment to a task (Any authenticated user)
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const { _id: userId, username } = req.user;

    if (!comment) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { 
        $push: { 
          comments: { 
            user: userId,
            username,
            comment
          }
        }
      },
      { new: true }
    ).populate('comments.user', 'username email');

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};
