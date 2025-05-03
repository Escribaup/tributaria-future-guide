
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
  isAdmin: boolean; // Adicionado para controle de acesso
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
  defaultWebhookUrl?: string; // URL padrão pode ser fornecida como prop
  isAdmin?: boolean; // Indica se o usuário é administrador
}

// URL padrão do webhook - pode ser substituída pela prop
const DEFAULT_WEBHOOK_URL = "https://seu-webhook-padrao-n8n.com/webhook/...";

export const ChatbotProvider = ({ children, defaultWebhookUrl, isAdmin = false }: ChatbotProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>("");

  // Load webhook URL from localStorage on component mount or use default
  useEffect(() => {
    // Se for admin, tenta carregar do localStorage
    if (isAdmin) {
      const savedUrl = localStorage.getItem("n8nWebhookUrl");
      if (savedUrl) {
        setN8nWebhookUrl(savedUrl);
      } else if (defaultWebhookUrl) {
        setN8nWebhookUrl(defaultWebhookUrl);
        localStorage.setItem("n8nWebhookUrl", defaultWebhookUrl);
      } else if (DEFAULT_WEBHOOK_URL) {
        setN8nWebhookUrl(DEFAULT_WEBHOOK_URL);
        localStorage.setItem("n8nWebhookUrl", DEFAULT_WEBHOOK_URL);
      }
    } else {
      // Se não for admin, usa diretamente a URL padrão
      setN8nWebhookUrl(defaultWebhookUrl || DEFAULT_WEBHOOK_URL);
    }

    // Add welcome message when the context is first initialized
    addMessage("Olá! Sou o assistente virtual da IDVL especializado na Reforma Tributária. Como posso ajudá-lo hoje?", "bot");
  }, [defaultWebhookUrl, isAdmin]);

  // Save webhook URL to localStorage when it changes (apenas para admins)
  useEffect(() => {
    if (isAdmin && n8nWebhookUrl) {
      localStorage.setItem("n8nWebhookUrl", n8nWebhookUrl);
    }
  }, [n8nWebhookUrl, isAdmin]);

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
      // Mensagem de erro diferente para admins e usuários comuns
      if (isAdmin) {
        addMessage("É necessário configurar a URL do webhook do n8n para receber respostas. Por favor, clique no ícone de configurações para configurar.", "system");
      } else {
        addMessage("Desculpe, o sistema de chat não está configurado corretamente. Por favor, contate o administrador.", "system");
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Enviando mensagem para o n8n:", {
        url: n8nWebhookUrl,
        message: message
      });
      
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
      console.log("Resposta bruta recebida do n8n:", data);
      
      // Extract the bot message from different possible response formats
      let botMessage: string | undefined;
      
      if (Array.isArray(data) && data.length > 0) {
        // Array format - get first item's output or response property
        const firstItem = data[0];
        botMessage = firstItem.output || firstItem.response || firstItem.message;
      } else if (typeof data === 'object' && data !== null) {
        // Object format - get output, response, or message property
        botMessage = data.output || data.response || data.message;
        
        // If we have an object with nested structure
        if (!botMessage && data.body) {
          if (typeof data.body === 'string') {
            try {
              const bodyObj = JSON.parse(data.body);
              botMessage = bodyObj.output || bodyObj.response || bodyObj.message;
            } catch (e) {
              botMessage = data.body; // Use the body as is if not valid JSON
            }
          } else if (typeof data.body === 'object') {
            botMessage = data.body.output || data.body.response || data.body.message;
          }
        }
      } else if (typeof data === 'string') {
        // Direct string response
        botMessage = data;
      }

      // If we've extracted a valid message, add it to the chat
      if (botMessage && typeof botMessage === 'string') {
        addMessage(botMessage, "bot");
      } else {
        console.error("Formato de resposta do n8n não reconhecido:", data);
        if (isAdmin) {
          addMessage("Desculpe, recebi uma resposta do n8n mas não consegui interpretar o formato. Por favor, verifique a configuração do webhook.", "system");
        } else {
          addMessage("Desculpe, houve um problema ao processar sua mensagem. Por favor, tente novamente mais tarde.", "system");
        }
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem para n8n:", error);
      if (isAdmin) {
        addMessage("Desculpe, houve um erro ao processar sua mensagem. Por favor, verifique a configuração do webhook e tente novamente.", "system");
      } else {
        addMessage("Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.", "system");
      }
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
    isAdmin,
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
