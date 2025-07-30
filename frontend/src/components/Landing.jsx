// src/components/LandingPage.js
import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiStar, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import { Appcontext } from "../context/Appcontext";

// Animated Checkmark Component for the background
const AnimatedCheckmark = ({ x, y, size, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.3, 0], scale: 1 }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatType: "loop" }}
    className="absolute text-emerald-400"
    style={{ top: `${y}%`, left: `${x}%`, fontSize: `${size}rem` }}
  >
    <FiCheckCircle />
  </motion.div>
);



const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const featureCardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
const { navigate, user, logout } = useContext(Appcontext);
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10rem] right-[0rem] h-[30rem] w-[30rem] bg-emerald-500/20 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10rem] left-[-10rem] h-[30rem] w-[30rem] bg-sky-500/20 rounded-full blur-[150px]"></div>

      {/* Animated Background Icons */}
      <AnimatedCheckmark x={10} y={20} size={3} delay={0.5} />
      <AnimatedCheckmark x={80} y={30} size={2} delay={1} />
      <AnimatedCheckmark x={25} y={70} size={4} delay={1.5} />
      <AnimatedCheckmark x={90} y={85} size={2.5} delay={0} />

      <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
          >
            Organize Your Chaos.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400">
              Elevate Your Workflow.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-slate-300"
          >
            The last task manager you'll ever need. Effortlessly capture tasks,
            organize projects, and achieve your goals with a stunningly simple
            interface. 🚀
          </motion.p>

          {/* Call to Action Button */}
          <motion.div variants={itemVariants} className="mt-10">
            <button onClick={() => {
              
              navigate("/login");
            }} className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out">
              
              Get Started for Free
              
            </button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mt-28 md:mt-40 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Feature 1 */}
          <motion.div
            variants={featureCardVariants}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="text-emerald-400 text-4xl mb-4">
              <FiCheckCircle />
            </div>
            <h3 className="text-xl font-bold mb-2">Effortless Tracking</h3>
            <p className="text-slate-400">
              Manage tasks with a clean, intuitive drag-and-drop interface.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={featureCardVariants}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="text-sky-400 text-4xl mb-4">
              <FiStar />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Prioritization</h3>
            <p className="text-slate-400">
              AI-powered suggestions to help you focus on what truly matters.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={featureCardVariants}
            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm transform hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="text-amber-400 text-4xl mb-4">
              <FiTrendingUp />
            </div>
            <h3 className="text-xl font-bold mb-2">Boost Productivity</h3>
            <p className="text-slate-400">
              Visualize your progress with insightful analytics and reports.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
