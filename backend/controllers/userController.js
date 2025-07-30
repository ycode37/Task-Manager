import User from '../models/userModel.js';

// Get all users in the admin's organization
export const getOrganizationUsers = async (req, res) => {
  try {
    const { organization } = req.user;

    const users = await User.find({ organization }).select('-password');

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// Get user statistics for admin dashboard
export const getUserStats = async (req, res) => {
  try {
    const { organization } = req.user;

    const totalUsers = await User.countDocuments({ organization });
    const adminUsers = await User.countDocuments({ organization, role: 'admin' });
    const regularUsers = await User.countDocuments({ organization, role: 'user' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message,
    });
  }
};

// Delete a user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { organization } = req.user;

    // Ensure the user being deleted is from the same organization
    const userToDelete = await User.findOne({ _id: id, organization });

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'User not found in your organization',
      });
    }

    // Prevent admin from deleting themselves
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// Get pending admin requests (Admin only)
export const getPendingAdminRequests = async (req, res) => {
  try {
    const { organization } = req.user;

    const pendingRequests = await User.find({
      organization,
      adminRequestStatus: 'pending'
    }).select('-password');

    res.status(200).json({
      success: true,
      requests: pendingRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin requests',
      error: error.message,
    });
  }
};

// Approve or reject admin request (Admin only)
export const reviewAdminRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const { organization, _id: adminId } = req.user;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject".',
      });
    }

    // Find the user with pending admin request
    const userToReview = await User.findOne({
      _id: id,
      organization,
      adminRequestStatus: 'pending'
    });

    if (!userToReview) {
      return res.status(404).json({
        success: false,
        message: 'Pending admin request not found in your organization',
      });
    }

    if (action === 'approve') {
      // Check if there's already an admin (should be only one)
      const currentAdmin = await User.findOne({
        organization,
        role: 'admin',
        _id: { $ne: userToReview._id }
      });

      if (currentAdmin && currentAdmin._id.toString() !== adminId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Another admin already exists for this organization',
        });
      }

      // If approving, demote the current admin to user
      if (currentAdmin && currentAdmin._id.toString() === adminId.toString()) {
        currentAdmin.role = 'user';
        currentAdmin.adminApproval = false;
        await currentAdmin.save();
      }

      userToReview.role = 'admin';
      userToReview.adminApproval = true;
      userToReview.adminRequestStatus = 'approved';
      userToReview.approvedBy = adminId;
      userToReview.approvedAt = new Date();
    } else {
      userToReview.adminRequestStatus = 'rejected';
    }

    await userToReview.save();

    res.status(200).json({
      success: true,
      message: `Admin request ${action}d successfully`,
      user: {
        id: userToReview._id,
        username: userToReview.username,
        email: userToReview.email,
        role: userToReview.role,
        adminRequestStatus: userToReview.adminRequestStatus,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reviewing admin request',
      error: error.message,
    });
  }
};

// Request admin privileges (User only)
export const requestAdminPrivileges = async (req, res) => {
  try {
    const { _id: userId, organization, role } = req.user;

    if (role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You are already an admin',
      });
    }

    // Check if user already has a pending request
    const existingRequest = await User.findById(userId);
    if (existingRequest.adminRequestStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending admin request',
      });
    }

    // Check if an admin exists in the organization
    const existingAdmin = await User.findOne({ organization, role: 'admin' });
    if (!existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'No admin found in your organization to approve the request',
      });
    }

    // Update user's admin request status
    existingRequest.adminRequestStatus = 'pending';
    existingRequest.adminRequestedAt = new Date();
    await existingRequest.save();

    res.status(200).json({
      success: true,
      message: 'Admin privilege request submitted successfully. Awaiting approval.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting admin request',
      error: error.message,
    });
  }
};
