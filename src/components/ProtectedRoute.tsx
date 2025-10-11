import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idvl-blue-dark"></div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return <Navigate to="/auth?redirect=simulador" />;
  }

  // Renderizar o conteúdo da rota protegida
  return <>{children}</>;
};

export default ProtectedRoute;
