
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

// Define message types
export type MessageType = "user" | "bot" | "system";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  addMessage: (content: string, type: MessageType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>("");

  // Load webhook URL from localStorage on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("n8nWebhookUrl");
    if (savedUrl) {
      setN8nWebhookUrl(savedUrl);
    }

    // Add welcome message when the context is first initialized
    addMessage("Olá! Sou o assistente virtual da IDVL especializado na Reforma Tributária. Como posso ajudá-lo hoje?", "bot");
  }, []);

  // Save webhook URL to localStorage when it changes
  useEffect(() => {
    if (n8nWebhookUrl) {
      localStorage.setItem("n8nWebhookUrl", n8nWebhookUrl);
    }
  }, [n8nWebhookUrl]);

  const addMessage = (content: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    // Re-add the welcome message
    addMessage("Olá! Sou o assistente virtual da IDVL especializado na Reforma Tributária. Como posso ajudá-lo hoje?", "bot");
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    addMessage(message, "user");
    
    // Check if webhook URL is set
    if (!n8nWebhookUrl) {
      addMessage("É necessário configurar a URL do webhook do n8n para receber respostas. Por favor, clique no ícone de configurações para configurar.", "system");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send message to n8n webhook
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat - Handle both "response" and "output" property names
      const botMessage = data.response || data.output || "Desculpe, não consegui processar sua pergunta.";
      addMessage(botMessage, "bot");
      console.log("Resposta recebida do n8n:", data);
    } catch (error) {
      console.error("Erro ao enviar mensagem para n8n:", error);
      addMessage("Desculpe, houve um erro ao processar sua mensagem. Por favor, verifique a configuração do webhook e tente novamente.", "system");
      toast.error("Erro ao conectar com o serviço do chatbot");
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    messages,
    addMessage,
    isOpen,
    setIsOpen,
    isLoading,
    sendMessage,
    clearMessages,
    n8nWebhookUrl,
    setN8nWebhookUrl,
  };
  
  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
