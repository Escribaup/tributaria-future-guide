
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GuideComplete from "./pages/GuideComplete";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { AuthProvider } from "./hooks/useAuth";
import AdminRoute from "./components/AdminRoute";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import Chatbot from "./components/chatbot/Chatbot";
import { useAuth } from "./hooks/useAuth";

// Initialize environment variable to hide the Lovable badge
// Using environment variable properly
declare global {
  interface Window {
    VITE_HIDE_BADGE: boolean;
  }
}

window.VITE_HIDE_BADGE = true;

// URL do webhook da IDVL - URL fixa para produção
const DEFAULT_N8N_WEBHOOK_URL = "https://webhook.idvl.com.br/webhook/reforma";

// Componente para fornecer ChatbotProvider com contexto de autenticação
const ChatbotProviderWithAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  return (
    <ChatbotProvider 
      defaultWebhookUrl={DEFAULT_N8N_WEBHOOK_URL} 
      isAdmin={isAdmin}
    >
      {children}
    </ChatbotProvider>
  );
};

const App = () => {
  // Criar o queryClient dentro do componente funcional
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <ChatbotProviderWithAuth>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/guia-completo" element={<GuideComplete />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/privacidade" element={<Privacy />} />
                
                {/* Rotas protegidas */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Chatbot />
            </ChatbotProviderWithAuth>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
