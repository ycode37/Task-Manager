import { useState, useEffect, useContext } from 'react';
import { userAPI } from '../../utils/api';
import { Appcontext } from '../../context/Appcontext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useContext(Appcontext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, statsResponse] = await Promise.all([
          userAPI.getOrganizationUsers(),
          userAPI.getUserStats(),
        ]);

        if (usersResponse.success) {
          setUsers(usersResponse.users);
        } else {
          toast.error(usersResponse.message || 'Failed to fetch users');
        }

        if (statsResponse.success) {
          setStats(statsResponse.stats);
        } else {
          toast.error(statsResponse.message || 'Failed to fetch stats');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await userAPI.deleteUser(userId);
        if (response.success) {
          setUsers(users.filter(u => u._id !== userId));
          toast.success('User deleted successfully');
        } else {
          toast.error(response.message || 'Failed to delete user');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Admins</h3>
            <p className="text-3xl font-bold">{stats.adminUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Regular Users</h3>
            <p className="text-3xl font-bold">{stats.regularUsers}</p>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Organization Users</h2>
        <ul className="divide-y divide-gray-200">
          {users.map(u => (
            <li key={u._id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{u.username}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
                <p className="text-sm text-gray-400">Role: {u.role}</p>
              </div>
              {u._id !== user._id && (
                <button 
                  onClick={() => handleDeleteUser(u._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
