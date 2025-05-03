
import React from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/contexts/ChatbotContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChatbotHeaderProps {
  onClose: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ onClose }) => {
  const { n8nWebhookUrl, setN8nWebhookUrl, isAdmin } = useChatbot();
  const [tempUrl, setTempUrl] = React.useState(n8nWebhookUrl);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleSaveSettings = () => {
    setN8nWebhookUrl(tempUrl);
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div>
        <h3 className="font-semibold">Assistente IDVL</h3>
        <p className="text-xs text-muted-foreground">
          Especialista em Reforma Tributária
        </p>
      </div>

      <div className="flex gap-1">
        {/* Mostrar configurações apenas para administradores */}
        {isAdmin && (
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings size={18} />
                <span className="sr-only">Configurações</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações do Chatbot</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://webhook.idvl.com.br/webhook/reforma"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Insira a URL do webhook que processa as mensagens do chatbot
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>Salvar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatbotHeader;
