
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
  isAdmin: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
  defaultWebhookUrl?: string;
  isAdmin?: boolean;
}

export const ChatbotProvider = ({ children, defaultWebhookUrl, isAdmin = false }: ChatbotProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrlState] = useState<string>(defaultWebhookUrl || "");

  // Função para atualizar webhook URL que só funciona para admins
  const setN8nWebhookUrl = (url: string) => {
    if (isAdmin) {
      setN8nWebhookUrlState(url);
      if (url) {
        localStorage.setItem("n8nWebhookUrl", url);
      }
    }
  };

  // Inicializa com a mensagem de boas-vindas
  useEffect(() => {
    // Carrega URL do webhook apenas para administradores
    if (isAdmin) {
      const savedUrl = localStorage.getItem("n8nWebhookUrl");
      if (savedUrl) {
        setN8nWebhookUrlState(savedUrl);
      } else if (defaultWebhookUrl) {
        setN8nWebhookUrlState(defaultWebhookUrl);
        localStorage.setItem("n8nWebhookUrl", defaultWebhookUrl);
      }
    } else {
      // Para usuários normais, sempre usa a URL padrão
      setN8nWebhookUrlState(defaultWebhookUrl || "");
    }

    // Adiciona mensagem de boas-vindas
    if (messages.length === 0) {
      addMessage("Olá! Sou o assistente virtual da IDVL especializado na Reforma Tributária. Como posso ajudá-lo hoje?", "bot");
    }
  }, [defaultWebhookUrl, isAdmin]);

  const addMessage = (content: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    };
    
    // Verifica se já existe uma mensagem idêntica para evitar duplicações
    const isDuplicate = messages.some(
      msg => msg.content === content && msg.type === type
    );
    
    if (!isDuplicate) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
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
        addMessage("É necessário configurar a URL do webhook para receber respostas. Por favor, clique no ícone de configurações para configurar.", "system");
      } else {
        addMessage("Desculpe, o sistema de chat não está configurado corretamente. Por favor, contate o administrador.", "system");
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Enviando mensagem para o webhook:", {
        url: n8nWebhookUrl,
        message: message
      });
      
      // Send message to webhook
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
      console.log("Resposta bruta recebida do webhook:", data);
      
      // Extract the bot message from different possible response formats
      let botMessage: string | undefined;
      
      if (Array.isArray(data) && data.length > 0) {
        // Array format - get first item's output or response property
        const firstItem = data[0];
        botMessage = firstItem.output || firstItem.response || firstItem.message || firstItem.answer || firstItem.result || firstItem.text;
      } else if (typeof data === 'object' && data !== null) {
        // Object format - check multiple possible property names
        botMessage = data.output || data.response || data.message || data.answer || data.result || data.text;
        
        // If we have an object with nested structure
        if (!botMessage && data.body) {
          if (typeof data.body === 'string') {
            try {
              const bodyObj = JSON.parse(data.body);
              botMessage = bodyObj.output || bodyObj.response || bodyObj.message || bodyObj.answer || bodyObj.result || bodyObj.text;
            } catch (e) {
              botMessage = data.body; // Use the body as is if not valid JSON
            }
          } else if (typeof data.body === 'object') {
            botMessage = data.body.output || data.body.response || data.body.message || data.body.answer || data.body.result || data.body.text;
          }
        }
        
        // Última tentativa - usar qualquer propriedade string como resposta
        if (!botMessage) {
          for (const key in data) {
            if (typeof data[key] === 'string') {
              botMessage = data[key];
              break;
            }
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
        console.error("Formato de resposta do webhook não reconhecido:", data);
        addMessage("Desculpe, houve um problema ao processar sua mensagem. Por favor, tente novamente mais tarde.", "system");
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem para webhook:", error);
      addMessage("Desculpe, houve um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.", "system");
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
