import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../../utils/api";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
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

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, otp);
      if (response.success) {
        toast.success(response.message || "OTP verified successfully");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(response.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        toast.success("New OTP sent to your email");
        setTimeLeft(600); // Reset timer
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white text-gray-500 max-w-[380px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
          <p className="text-center mb-6">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
          
          <div className="flex items-center justify-center my-4 border bg-indigo-500/5 border-gray-500/10 rounded px-2">
            <input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full outline-none bg-transparent py-2.5 text-center text-2xl font-mono tracking-widest"
              type="text"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <div className="text-center mb-4">
            {timeLeft > 0 ? (
              <p className="text-gray-600">OTP expires in <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span></p>
            ) : (
              <p className="text-red-500">OTP has expired</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6 || timeLeft === 0}
            className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition py-2.5 rounded text-white font-medium"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            <p className="mb-2">Didn't receive the OTP?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={timeLeft > 540} // Allow resend after 1 minute
              className="text-blue-600 underline disabled:text-gray-400 disabled:no-underline"
            >
              {timeLeft > 540 ? `Resend in ${formatTime(600 - timeLeft)}` : 'Resend OTP'}
            </button>
          </div>

          <p className="text-center mt-4">
            <Link to="/forgot-password" className="text-blue-500 underline">← Back to Forgot Password</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
