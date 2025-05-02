import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
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
              {/* Social Media Icons */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
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