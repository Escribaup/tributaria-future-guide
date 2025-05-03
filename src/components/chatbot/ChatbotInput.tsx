
import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatbot } from "@/contexts/ChatbotContext";

const ChatbotInput: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, isLoading } = useChatbot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      const message = inputValue;
      setInputValue("");
      await sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="relative flex items-end">
        <Textarea
          placeholder="Digite sua pergunta sobre a Reforma Tributária..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] pr-14 resize-none"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute bottom-2 right-2"
          disabled={!inputValue.trim() || isLoading}
        >
          <SendHorizontal size={18} />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <p className="text-xs text-center text-muted-foreground mb-2">
          Desenvolvido com tecnologia de IA para auxiliar em dúvidas sobre a Reforma Tributária
        </p>
        <img src="/logo-idvl.png" alt="IDVL Logo" className="h-6" />
      </div>
    </form>
  );
};

export default ChatbotInput;
