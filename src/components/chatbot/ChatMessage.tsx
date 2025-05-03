
import React from "react";
import { Message } from "@/contexts/ChatbotContext";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "mb-4 flex animate-fade-in",
        message.type === "user" ? "justify-end" : "justify-start",
        message.type === "system" && "justify-center"
      )}
    >
      {message.type === "system" ? (
        <div className="rounded-md bg-muted px-4 py-2 text-sm text-muted-foreground max-w-[85%]">
          {message.content}
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg px-4 py-2 max-w-[85%] shadow",
            message.type === "user"
              ? "bg-idvl-blue-light text-white"
              : "bg-white border border-gray-200"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <div
            className={cn(
              "text-xs mt-1",
              message.type === "user" ? "text-white/70" : "text-gray-400"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
