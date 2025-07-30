import React from "react";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./components/Landing";

// 1. Import useLocation from router and AnimatePresence from framer-motion
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import TodoPage from "./pages/TodoPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  // 2. Get the current location object
  const location = useLocation();

  return (
    // It's good practice to set a base background color here
    // that matches your pages for a seamless transition.
    <div className="bg-slate-900">
      <Navbar />

      {/* 3. Wrap your Routes with AnimatePresence */}
      {/* 'mode="wait"' ensures one page animates out before the next one animates in. */}
      <AnimatePresence mode="wait">
        {/* 4. Add 'location' and a unique 'key' to the Routes component. */}
        {/* This tells AnimatePresence when the page has changed. */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AnimatePresence>
      {/* yeh toaster toh app.jsx mai lagana padega nahi toh kaam nahi karega  */}
      <Toaster /> 

      <Footer />
    </div>
  );
};

export default App;
