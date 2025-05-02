
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-idvl-blue-dark"></div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado e é um administrador
  if (!user || !isAdmin) {
    return <Navigate to="/auth" />;
  }

  // Renderizar o conteúdo da rota protegida
  return <>{children}</>;
};

export default AdminRoute;
