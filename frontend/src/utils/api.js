import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_URL}`

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear localStorage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password
  resetPassword: async (email, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { email, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Todo API functions
export const todoAPI = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await apiClient.get('/task/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/task/create', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/task/update/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/task/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Toggle task completion
  toggleTaskCompletion: async (id) => {
    try {
      const response = await apiClient.patch(`/task/toggle/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add comment to task
  addComment: async (id, comment) => {
    try {
      const response = await apiClient.post(`/task/comment/${id}`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// User management API (Admin only)
export const userAPI = {
  // Get all users in organization
  getOrganizationUsers: async () => {
    try {
      const response = await apiClient.get('/user/organization');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/user/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default apiClient;
