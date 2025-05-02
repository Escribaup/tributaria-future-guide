import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
type HeaderProps = {
  // Add any props here
};
const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    user,
    isAdmin
  } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Verifica inicialmente se não estamos no topo da página
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-idvl-blue-dark py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={isScrolled ? "/logo-idvl.png" : "/logo-idvl-white.png"} alt="IDVL Logo" className="h-10 mr-3" />
          
        </Link>
        
        <div className="lg:hidden">
          <button onClick={toggleMenu} className={`p-2 rounded-md ${isScrolled ? 'text-idvl-blue-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} aria-expanded={isMenuOpen}>
            <span className="sr-only">Menu Principal</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        
        <nav className={`absolute top-full left-0 w-full p-4 lg:p-0 lg:static lg:w-auto lg:flex lg:space-x-8 ${isMenuOpen ? 'block bg-white shadow-md' : 'hidden'} lg:flex`}>
          <Link to="/" className={`block py-2 px-3 rounded-md ${isScrolled || isMenuOpen ? 'text-idvl-blue-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'} lg:px-3 lg:py-2`}>
            Início
          </Link>
          <Link to="/guia-completo" className={`block py-2 px-3 rounded-md ${isScrolled || isMenuOpen ? 'text-idvl-blue-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'} lg:px-3 lg:py-2`}>
            Guia Completo
          </Link>
          <Link to="/contato" className={`block py-2 px-3 rounded-md ${isScrolled || isMenuOpen ? 'text-idvl-blue-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'} lg:px-3 lg:py-2`}>
            Contato
          </Link>
          
          {isAdmin && <Link to="/admin" className={`block py-2 px-3 rounded-md text-white bg-idvl-blue-dark hover:bg-idvl-blue-light`}>
              Administração
            </Link>}
          
          {!user && <Link to="/auth" className={`block py-2 px-3 rounded-md ${isScrolled || isMenuOpen ? 'bg-idvl-blue-dark text-white hover:bg-idvl-blue-light' : 'bg-white text-idvl-blue-dark hover:bg-opacity-90'} lg:px-3 lg:py-2`}>
              Login
            </Link>}
        </nav>
      </div>
    </header>;
};
export default Header;