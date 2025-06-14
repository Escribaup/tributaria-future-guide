
import React from "react";
import { Message } from "@/contexts/ChatbotContext";
import { cn } from "@/lib/utils";
import HtmlMessage from "./HtmlMessage";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Check if the message content is HTML
  const isHtmlContent = (content: string): boolean => {
    return content.trim().startsWith('<!DOCTYPE html>') || 
           content.trim().startsWith('<html') ||
           (content.includes('<h1>') || content.includes('<h2>') || content.includes('<h3>')) ||
           (content.includes('<p>') && content.includes('</p>')) ||
           (content.includes('<ul>') && content.includes('</ul>'));
  };

  const shouldRenderAsHtml = message.type === "bot" && isHtmlContent(message.content);

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
          {shouldRenderAsHtml ? (
            <HtmlMessage content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
          
          <div
            className={cn(
              "text-xs mt-2",
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
