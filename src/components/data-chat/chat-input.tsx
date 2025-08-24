"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useChatMutation } from "@/lib/hooks/ai";
import { useAIAssistantStore } from "@/lib/stores/ai-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ChatInput() {
  const [value, setValue] = useState("");
  const { appendMessage, setStatus, dataset, messages } = useAIAssistantStore();
  const chat = useChatMutation();

  const doSend = useCallback(async () => {
    const text = value.trim();
    if (!text) return;

    if (!dataset) {
      toast.message("Upload a CSV first, then ask your question.");
      return;
    }

    // Show user message immediately in UI
    appendMessage({ role: "user", content: text });
    setValue("");
    setStatus("thinking");

    try {
      const reply = await chat.mutateAsync({
        messages: [...messages, { role: "user", content: text }],
        dataset,
      });

      appendMessage({ role: "assistant", content: reply });
    } catch (e: unknown) {
      const error =
        e instanceof Error ? e.message : "Failed to get response from AI";
      toast.error(error);
      appendMessage({
        role: "assistant",
        content: "Sorry—something went wrong. Please try again.",
      });
    } finally {
      setStatus("ready");
    }
  }, [value, dataset, messages, appendMessage, chat, setStatus]);

  return (
    <div className="flex gap-2 p-2 border-t">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            doSend();
          }
        }}
        placeholder="Ask something about your dataset..."
      />
      <Button onClick={doSend} disabled={!value.trim() || chat.isPending}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
