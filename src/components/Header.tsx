
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const menuItems = [
    { name: 'Guia Completo', href: '/guia-completo' },
    { name: 'Impacto por Setor', href: '/impacto-por-setor' },
    { name: 'Ferramentas Úteis', href: '/ferramentas' },
    { name: 'Notícias e Atualizações', href: '/noticias' },
    { name: 'IDVL Soluções', href: '/solucoes' },
    { name: 'Contato', href: '/contato' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo-idvl.png" // Placeholder for IDVL logo
            alt="IDVL Logo"
            className="h-10 md:h-12"
          />
          <div className="ml-3 md:ml-4">
            <h1 className="text-lg md:text-xl text-idvl-blue-dark font-bold">
              Reforma Tributária
            </h1>
            <p className="text-xs md:text-sm text-idvl-text-light">Simplificada</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-idvl-text-dark hover:text-idvl-blue-dark font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <button 
            onClick={toggleSearch} 
            aria-label="Buscar"
            className="text-idvl-text-dark hover:text-idvl-blue-dark transition-colors"
          >
            <Search size={20} />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button 
            onClick={toggleSearch} 
            aria-label="Buscar"
            className="p-2 mr-2 text-idvl-text-dark"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-idvl-text-dark"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Overlay */}
        <div 
          className={cn(
            "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-24",
            searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="bg-white p-4 rounded-md w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar informações sobre a reforma tributária..."
                className="w-full p-3 border border-gray-300 rounded-md pr-10"
              />
              <Search size={20} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="relative h-full">
          <div className="bg-white h-full w-3/4 ml-auto pt-20 px-6 overflow-y-auto">
            <nav className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-idvl-text-dark font-medium py-2 border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-[-1]"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
