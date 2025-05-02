
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-idvl-blue-dark text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/">
              <img src="/logo-idvl-white.png" alt="IDVL Logo" className="h-12 mb-4" />
            </Link>
            <p className="text-sm opacity-80 mb-4">
              A IDVL oferece soluções estratégicas para empresas navegarem
              pelas complexidades da reforma tributária, garantindo conformidade
              e maximizando oportunidades.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons - Atualizados com links corretos */}
              <a href="https://www.facebook.com/idvlcontabil/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/idvlcontabilidade/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/idvlcontabilidade" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@IDVLContabilidade" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guia-completo" className="hover:text-idvl-blue-light transition-colors">Guia Completo da Reforma</Link>
              </li>
              <li>
                <Link to="/impacto-por-setor" className="hover:text-idvl-blue-light transition-colors">Impacto por Setor</Link>
              </li>
              <li>
                <Link to="/ferramentas" className="hover:text-idvl-blue-light transition-colors">Ferramentas Úteis</Link>
              </li>
              <li>
                <Link to="/noticias" className="hover:text-idvl-blue-light transition-colors">Notícias e Atualizações</Link>
              </li>
              <li>
                <Link to="/solucoes" className="hover:text-idvl-blue-light transition-colors">IDVL Soluções</Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-idvl-blue-light transition-colors">Contato</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>R. Antônio Stival, 94 - Santa Felicidade, Curitiba - PR, 82400-060</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>(41) 3095-1111</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="mailto:contato@idvl.com.br" className="hover:text-idvl-blue-light transition-colors">comercial@idvl.com.br</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm mb-4 opacity-80">
              Receba atualizações sobre a reforma tributária e novidades da IDVL:
            </p>
            <form className="flex flex-col space-y-3">
              <input type="email" placeholder="Seu e-mail" className="p-3 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-idvl-blue-light" />
              <button type="submit" className="bg-idvl-blue-light text-white font-medium py-3 px-4 rounded hover:bg-opacity-90 transition-colors">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
          <p>© {currentYear} IDVL. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/termos" className="hover:text-idvl-blue-light transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-idvl-blue-light transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
