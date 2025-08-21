"use client";

import { motion } from "framer-motion";
import MotionCard from "@/components/ui/motion-card";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 80,
        }}
        className="w-full max-w-md"
      >
        <MotionCard className="bg-white rounded-2xl shadow-md p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-blue-50 rounded-full">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl font-semibold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Check your email
          </motion.h2>

          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            We’ve sent you a confirmation email. Please click the link inside to
            verify your account and continue to your dashboard.
          </motion.p>

          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Didn’t receive it? Check your spam folder or request a new one from
            the sign in page.
          </motion.p>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}
