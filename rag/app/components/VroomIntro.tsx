"use client";
import { motion } from "framer-motion";

const VroomTitle = () => {
  return (
    <motion.div
      className="vroom-title"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1 className="vroom-heading">
        Vroom F1 Bot<span className="emoji"> 🏁</span>
      </h1>
      <p className="vroom-sub">
        Your fastest pit stop for Formula 1 facts, memes, and madness.
      </p>
    </motion.div>
  );
};

export default VroomTitle;
