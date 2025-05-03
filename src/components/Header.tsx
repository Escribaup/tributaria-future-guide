import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-idvl-blue-dark text-white py-4 shadow-md">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          IDVL Reforma Tributária
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-200 transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/guia-completo" className="hover:text-gray-200 transition-colors">
                Guia Completo
              </Link>
            </li>
            <li>
              <Link to="/simulador" className="hover:text-gray-200 transition-colors">
                Simulador
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/admin" className="hover:text-gray-200 transition-colors">
                  Admin
                </Link>
              </li>
            )}
            {!user && (
              <li>
                <Link to="/auth" className="hover:text-gray-200 transition-colors">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {user && (
          <div>
            <Button asChild variant="secondary">
              <Link to="/admin">Painel Admin</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
