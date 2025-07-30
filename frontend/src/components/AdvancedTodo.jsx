import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { todoAPI } from '../utils/api';
import { Appcontext } from '../context/Appcontext';

const AdvancedTodo = () => {
  const { user, logout } = useContext(Appcontext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await todoAPI.getAllTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '') return;
    try {
      const response = await todoAPI.createTask({ task: newTask });
      setTasks([response.task, ...tasks]);
      setNewTask('');
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('You are Logged In as User Only Admin Can Add Task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await todoAPI.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditingText(task.task);
  };

  const saveTask = async (id) => {
    try {
      const response = await todoAPI.updateTask(id, { task: editingText });
      setTasks(tasks.map(task => (task._id === id ? response.task : task)));
      setEditingTask(null);
      setEditingText('');
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const toggleCompletion = async (id) => {
    try {
      const response = await todoAPI.toggleTaskCompletion(id);
      setTasks(tasks.map(task => (task._id === id ? response.task : task)));
      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const clearCompleted = () => {
    const completedTasks = tasks.filter(task => task.completed);
    completedTasks.forEach(task => deleteTask(task._id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 bg-slate-800 rounded-lg shadow-2xl p-8">
      {/* User Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.username}!</h2>
          <p className="text-slate-400">{user?.email} • {user?.role} • {user?.organization}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      
      <h1 className="text-4xl font-bold text-center text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Your Personal Task Manager
      </h1>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold text-blue-400">{stats.total}</h3>
          <p className="text-slate-300">Total</p>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-400">{stats.completed}</h3>
          <p className="text-slate-300">Completed</p>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold text-yellow-400">{stats.pending}</h3>
          <p className="text-slate-300">Pending</p>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex mb-6">
        <input
          type="text"
          className="flex-grow p-3 rounded-l-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg transition-colors"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-6 gap-2">
        {['all', 'pending', 'completed'].map((filterType) => (
          <button
            key={filterType}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </button>
        ))}
        {stats.completed > 0 && (
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={clearCompleted}
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Tasks */}
      {isLoading ? (
        <div className="text-center text-white">Loading tasks...</div>
      ) : (
        <AnimatePresence>
          <ul className="space-y-3">
            {filteredTasks.map(task => (
              <motion.li
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  task.completed ? 'bg-slate-700/50' : 'bg-slate-600'
                }`}
              >
                <div className="flex items-center flex-grow">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompletion(task._id)}
                    className="mr-4 h-5 w-5 text-blue-600 bg-slate-700 border-slate-500 rounded focus:ring-blue-500"
                  />
                  {editingTask === task._id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveTask(task._id)}
                      onBlur={() => saveTask(task._id)}
                      className="bg-slate-700 text-white p-2 rounded flex-grow mr-4"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`text-lg flex-grow mr-4 ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : 'text-white'
                      }`}
                    >
                      {task.task}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingTask === task._id ? (
                    <button
                      onClick={() => saveTask(task._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(task)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}

      {filteredTasks.length === 0 && !isLoading && (
        <div className="text-center text-slate-400 py-8">
          {filter === 'all' && 'No tasks yet. Add one above!'}
          {filter === 'completed' && 'No completed tasks yet.'}
          {filter === 'pending' && 'No pending tasks. Great work!'}
        </div>
      )}
    </div>
  );
};

export default AdvancedTodo;
