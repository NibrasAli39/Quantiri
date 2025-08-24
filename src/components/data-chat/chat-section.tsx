"use client";

import { useRef, useEffect } from "react";
import { Bot, Trash2, Database } from "lucide-react";
import { toast } from "sonner";
import MotionCard from "@/components/ui/motion-card";
import { Button } from "@/components/ui/button";
import { useAIAssistantStore } from "@/lib/stores/ai-assistant";
import { ChatInput } from "./chat-input";
import MessageBubble from "./message-bubble";

export default function ChatSection() {
  const { messages, dataset, resetConversation } = useAIAssistantStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleClear = () => {
    resetConversation();
    toast.success("Conversation cleared");
  };

  const noDataset = !dataset;

  return (
    <MotionCard className="bg-white rounded-2xl shadow-md flex flex-col h-[70vh]">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-content-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">AI Data Chat</h2>
            <p className="text-xs text-muted-foreground">
              Ask questions about your uploaded dataset.
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Trash2 className="h-4 w-4 mr-1.5" />
          Clear
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {noDataset ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Database className="h-10 w-10 mb-3 opacity-70" />
            <p className="text-sm">
              Please upload a dataset to start chatting with the AI assistant.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="h-10 w-10 mb-3 opacity-70" />
            <p className="text-sm">
              Hi! I’m your AI data assistant. Ask me anything about your
              dataset.
            </p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="border-t p-4">
        <ChatInput />
      </div>
    </MotionCard>
  );
}
