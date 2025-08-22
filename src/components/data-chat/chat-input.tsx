"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useAIAssistantStore } from "@/lib/stores/ai-assistant";
import { useChatMutation } from "@/lib/hooks/ai";

export default function ChatInput() {
  const { appendMessage, setStatus, dataset } = useAIAssistantStore();
  const chat = useChatMutation();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const disabled = chat.isPending;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const doSend = useCallback(async () => {
    const text = value.trim();
    if (!text) return;
    setValue("");
    setStatus("thinking");

    try {
      const reply = await chat.mutateAsync(text);
      appendMessage({ role: "assistant", content: reply });
    } catch (e) {
      const error = e instanceof Error ? e.message : "Failed to get response";
      toast.error(error);
      appendMessage({
        role: "assistant",
        content: "Sorry—something went wrong. Please try again.",
      });
    } finally {
      setStatus("ready");
    }
  }, [value, appendMessage, chat, setStatus]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) void doSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            dataset
              ? "Ask about your data… (Shift+Enter for newline)"
              : "Upload a CSV first, then ask…"
          }
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          rows={1}
          maxLength={4000}
          aria-label="Message"
          disabled={disabled}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            size="sm"
            onClick={() => void doSend()}
            disabled={disabled || !value.trim()}
          >
            <Send className="h-4 w-4 mr-1.5" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
