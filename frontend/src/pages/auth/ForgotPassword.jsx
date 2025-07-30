import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../utils/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        toast.success(response.message || "OTP sent to your email");
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white text-gray-500 max-w-[380px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
        {isSubmitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Sent!</h2>
            <p>An OTP has been sent to <strong>{email}</strong>. Please check your inbox and enter the OTP to reset your password.</p>
            <p className="mt-4">Didn't receive the email? <button className="text-blue-600 underline">Resend</button></p>
            <Link to="/verify-otp" state={{ email }} className="block mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 rounded">Enter OTP</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
            <p className="text-center mb-6">Enter your email address and we'll send you an OTP to reset your password.</p>
            <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
              <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full outline-none bg-transparent py-2.5" type="email" placeholder="Email" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full mt-4 mb-3 bg-indigo-500 hover:bg-indigo-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition py-2.5 rounded text-white font-medium">
              {isLoading ? 'Sending Email...' : 'Send OTP'}
            </button>
            <p className="text-center mt-4">
              Remember your password? <Link to="/login" className="text-blue-500 underline">Log In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
