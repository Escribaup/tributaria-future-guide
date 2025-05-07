
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useChatbot } from "@/contexts/ChatbotContext";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";
import { useIsMobile } from "@/hooks/use-mobile";

const Chatbot: React.FC = () => {
  const { isOpen, setIsOpen } = useChatbot();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Chatbot toggle button (fixed at bottom right) */}
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`${isMobile ? 'h-12 w-12' : 'h-14 w-14'} rounded-full shadow-lg`}
          aria-label="Abrir chat de assistência"
        >
          <MessageCircle size={isMobile ? 20 : 24} />
        </Button>
      </div>

      {/* Chatbot interface */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className={`w-full ${isMobile ? 'sm:max-w-full' : 'sm:max-w-md'} p-0 flex flex-col`}
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
