"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end flex-row-reverse" : "justify-start",
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg grid place-content-center",
          isUser ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900",
        )}
        aria-label={isUser ? "You" : "Assistant"}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm shadow-sm",
          isUser
            ? "bg-slate-900 text-white rounded-tr-sm"
            : "bg-slate-100 text-slate-900 rounded-tl-sm",
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}
