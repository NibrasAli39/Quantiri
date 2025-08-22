"use client";

import { motion } from "framer-motion";
import { ReactNode, HTMLAttributes } from "react";

interface MotionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function MotionCard({
  children,
  className = "",
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
