
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const NavLinks = () => (
    <ul className={`flex ${isMobile ? "flex-col space-y-6" : "items-center space-x-6"}`}>
      <li>
        <Link 
          to="/" 
          className={`hover:opacity-80 transition-colors ${isScrolled && !isMobile ? 'text-idvl-text-dark' : 'text-white'} ${isMobile ? 'text-lg' : ''}`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          Início
        </Link>
      </li>
      <li>
        <Link 
          to="/guia-completo" 
          className={`hover:opacity-80 transition-colors ${isScrolled && !isMobile ? 'text-idvl-text-dark' : 'text-white'} ${isMobile ? 'text-lg' : ''}`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          Guia Completo
        </Link>
      </li>
      <li>
        <Link 
          to="/simulador" 
          className={`hover:opacity-80 transition-colors ${isScrolled && !isMobile ? 'text-idvl-text-dark' : 'text-white'} ${isMobile ? 'text-lg' : ''}`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          Simulador
        </Link>
      </li>
      <li>
        <a 
          href="https://wa.me/41996946641" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`hover:opacity-80 transition-colors ${isScrolled && !isMobile ? 'text-idvl-text-dark' : 'text-white'} ${isMobile ? 'text-lg' : ''}`}
        >
          Contato
        </a>
      </li>
      {user && (
        <li>
          <Link 
            to="/admin" 
            className={`hover:opacity-80 transition-colors ${isScrolled && !isMobile ? 'text-idvl-text-dark' : 'text-white'} ${isMobile ? 'text-lg' : ''}`}
            onClick={() => isMobile && setIsMenuOpen(false)}
          >
            Admin
          </Link>
        </li>
      )}
      {user && isMobile && (
        <li className="mt-2">
          <Button asChild variant="secondary" className="w-full">
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
              Painel Admin
            </Link>
          </Button>
        </li>
      )}
    </ul>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md text-idvl-text-dark' : 'bg-idvl-blue-dark text-white'}`}>
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center z-20">
          <img 
            src={isScrolled || (isMobile && isMenuOpen) ? "/logo-idvl.png" : "/logo-idvl-white.png"} 
            alt="IDVL Logo" 
            className="h-8" 
          />
        </Link>
        
        {isMobile ? (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`z-20 ${isScrolled ? 'text-idvl-text-dark' : 'text-white'}`}
              >
                <Menu size={24} />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] pt-16 bg-idvl-blue-dark">
              <SheetHeader className="text-left">
                <SheetTitle className="text-white text-2xl">Menu</SheetTitle>
              </SheetHeader>
              <div className="py-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <nav className="hidden md:block">
              <NavLinks />
            </nav>
            {user && (
              <div className="hidden md:block">
                <Button asChild variant="secondary">
                  <Link to="/admin">Painel Admin</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
