
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useChatbot } from "@/contexts/ChatbotContext";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";

const Chatbot: React.FC = () => {
  const { isOpen, setIsOpen } = useChatbot();

  return (
    <>
      {/* Chatbot toggle button (fixed at bottom right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="Abrir chat de assistência"
        >
          <MessageCircle size={24} />
        </Button>
      </div>

      {/* Chatbot interface */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col"
        >
          <ChatbotHeader onClose={() => setIsOpen(false)} />
          <ChatbotMessages />
          <ChatbotInput />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Chatbot;
