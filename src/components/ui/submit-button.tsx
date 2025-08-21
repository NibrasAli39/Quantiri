"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div whileTap={{ scale: 0.985 }} className="w-full">
      <Button type="submit" disabled={!!loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
    </motion.div>
  );
}
