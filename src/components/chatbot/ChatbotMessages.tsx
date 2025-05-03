
import React, { useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";
import ChatMessage from "./ChatMessage";

const ChatbotMessages: React.FC = () => {
  const { messages, isLoading } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Use the message ID and index to create a truly unique key for each message
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage 
          key={`${message.id}-${index}`} 
          message={message} 
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start mb-4 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processando...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatbotMessages;
