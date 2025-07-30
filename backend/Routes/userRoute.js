import express from 'express';
import {
  getOrganizationUsers,
  getUserStats,
  deleteUser,
  getPendingAdminRequests,
  reviewAdminRequest,
  requestAdminPrivileges,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const UserRoute = express.Router();

// Admin-only routes
UserRoute.get('/organization', authenticateToken, adminAuth, getOrganizationUsers);
UserRoute.get('/stats', authenticateToken, adminAuth, getUserStats);
UserRoute.delete('/:id', authenticateToken, adminAuth, deleteUser);

// Admin request management routes (Admin only)
UserRoute.get('/admin-requests', authenticateToken, adminAuth, getPendingAdminRequests);
UserRoute.post('/admin-requests/:id/review', authenticateToken, adminAuth, reviewAdminRequest);

// User routes
UserRoute.post('/request-admin', authenticateToken, requestAdminPrivileges);

export default UserRoute;
