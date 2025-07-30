import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../../utils/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // If no email is passed, redirect to forgot password
  useEffect(() => {
    if (!email) {
      toast.error("Please start from forgot password page");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const response = await authAPI.resetPassword(email, password);
      if (response.success) {
        toast.success(response.message || "Password reset successfully");
        navigate("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white text-gray-500 max-w-[380px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
          <p className="text-center mb-6">Enter your new password for <strong>{email}</strong></p>
          
          <div className="flex items-center mt-2 mb-4 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none bg-transparent py-2.5"
              type="password"
              placeholder="New Password"
              required
            />
          </div>
          <div className="flex items-center mt-2 mb-4 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full outline-none bg-transparent py-2.5"
              type="password"
              placeholder="Confirm New Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || password.length < 6}
            className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition py-2.5 rounded text-white font-medium"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <p className="text-center mt-4">
            <Link to="/login" className="text-blue-500 underline">← Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
