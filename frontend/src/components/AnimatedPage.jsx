import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    x: "100vw", // Start off-screen to the right
  },
  in: {
    opacity: 1,
    x: 0, // Animate to the center
  },
  out: {
    opacity: 0,
    x: "-100vw", // Animate off-screen to the left
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.6,
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
