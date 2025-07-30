import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import AdvancedTodo from '../components/AdvancedTodo';
import AnimatedPage from "../components/AnimatedPage";
import { Appcontext } from '../context/Appcontext';

const TodoPage = () => {
  const { user, loading, navigate } = useContext(Appcontext);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-900 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <AdvancedTodo />
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default TodoPage;
