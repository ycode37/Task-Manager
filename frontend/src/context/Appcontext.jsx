import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

export const Appcontext = createContext();

const AppcontextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        
        toast.success(response.message || 'Login successful!');
        navigate('/todo');
        return response;
      } else {
        toast.error(response.message || 'Login failed');
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        toast.success(response.message || 'Registration successful!');
        navigate('/login');
        return response;
      } else {
        toast.error(response.message || 'Registration failed');
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const value = { 
    user, 
    setUser, 
    loading, 
    login, 
    register, 
    logout, 
    navigate 
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export default AppcontextProvider;
