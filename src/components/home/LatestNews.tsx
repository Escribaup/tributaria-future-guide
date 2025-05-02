
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const LatestNews = () => {
  const news = [
    {
      id: 1,
      title: "Aprovação da lei complementar que regulamenta a reforma tributária",
      summary: "O Congresso Nacional aprovou a lei que detalha as regras do IBS e da CBS, com foco em simplificar o sistema tributário brasileiro.",
      date: "15/04/2025",
      image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Legislação"
    },
    {
      id: 2,
      title: "Como o setor de serviços será impactado pela reforma tributária",
      summary: "Análise detalhada sobre as mudanças para empresas prestadoras de serviços com a implementação do IBS e suas alíquotas.",
      date: "03/04/2025",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Análise Setorial"
    },
    {
      id: 3,
      title: "Empresas começam a se preparar para as mudanças tributárias de 2026",
      summary: "Pesquisa revela que 67% das grandes empresas já iniciaram projetos internos para adequação à primeira fase da reforma.",
      date: "28/03/2025",
      image: "https://images.unsplash.com/photo-1664575599730-0814817939de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Preparação"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark">
              Últimas Notícias
            </h2>
            <p className="text-idvl-text-light text-lg mt-2">
              Fique por dentro das atualizações sobre a reforma tributária
            </p>
          </div>
          <Link 
            to="/noticias"
            className="hidden md:flex items-center text-idvl-blue-dark font-medium hover:text-idvl-blue-light transition-colors"
          >
            Ver todas as notícias
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <span className="absolute top-4 left-4 bg-idvl-blue-light text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-idvl-text-light text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-idvl-blue-dark mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-idvl-text-light mb-4 line-clamp-3">
                  {item.summary}
                </p>
                <Link 
                  to={`/noticias/${item.id}`}
                  className="text-idvl-blue-dark font-medium flex items-center hover:text-idvl-blue-light transition-colors"
                >
                  Ler mais
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/noticias"
            className="inline-flex items-center text-idvl-blue-dark font-medium hover:text-idvl-blue-light transition-colors"
          >
            Ver todas as notícias
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
