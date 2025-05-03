
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll event listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md text-idvl-text-dark' : 'bg-idvl-blue-dark text-white'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={isScrolled ? "/logo-idvl.png" : "/logo-idvl-white.png"} 
            alt="IDVL Logo" 
            className="h-8"
          />
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className={`hover:opacity-80 transition-colors ${
                isScrolled ? 'text-idvl-text-dark' : 'text-white'
              }`}>
                Início
              </Link>
            </li>
            <li>
              <Link to="/guia-completo" className={`hover:opacity-80 transition-colors ${
                isScrolled ? 'text-idvl-text-dark' : 'text-white'
              }`}>
                Guia Completo
              </Link>
            </li>
            <li>
              <Link to="/simulador" className={`hover:opacity-80 transition-colors ${
                isScrolled ? 'text-idvl-text-dark' : 'text-white'
              }`}>
                Simulador
              </Link>
            </li>
            <li>
              <Link to="/contato" className={`hover:opacity-80 transition-colors ${
                isScrolled ? 'text-idvl-text-dark' : 'text-white'
              }`}>
                Contato
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/admin" className={`hover:opacity-80 transition-colors ${
                  isScrolled ? 'text-idvl-text-dark' : 'text-white'
                }`}>
                  Admin
                </Link>
              </li>
            )}
            {!user && (
              <li>
                <Link to="/auth" className={`hover:opacity-80 transition-colors ${
                  isScrolled ? 'text-idvl-text-dark' : 'text-white'
                }`}>
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
