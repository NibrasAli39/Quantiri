"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MotionCard from "@/components/ui/motion-card";
import { Button } from "@/components/ui/button";

function VerifyPageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const token = sp.get("token");
    const email = sp.get("email");
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Email verified successfully. You can now sign in.");
          toast.success("Email verified!");
        } else {
          setStatus("error");
          setMessage(data?.error ?? "Verification failed.");
          toast.error(data?.error ?? "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again later.");
        toast.error("Network error");
      }
    })();
  }, [sp]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="w-full max-w-md"
      >
        <MotionCard className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Email Verification</h2>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>

          {status === "success" ? (
            <Button onClick={() => router.replace("/auth/signin")}>
              Go to sign in
            </Button>
          ) : status === "error" ? (
            <Button
              variant="outline"
              onClick={() => router.replace("/auth/signin")}
            >
              Back to sign in
            </Button>
          ) : null}
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
