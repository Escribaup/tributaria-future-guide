
import { Link } from 'react-router-dom';
import { BookOpen, PieChart, CheckSquare, FileText, Info } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-idvl-blue-dark" />,
      title: "Guia Completo da Reforma",
      description: "Uma explicação detalhada sobre todas as mudanças e seus impactos para pessoas e empresas.",
      link: "/guia-completo",
      color: "bg-blue-50"
    },
    {
      icon: <PieChart className="h-10 w-10 text-idvl-blue-dark" />,
      title: "Impacto por Setor",
      description: "Análises específicas sobre como a reforma afeta cada segmento da economia brasileira.",
      link: "/impacto-por-setor",
      color: "bg-green-50"
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-idvl-blue-dark" />,
      title: "Ferramentas Úteis",
      description: "Simuladores, calculadoras e checklists para preparar sua empresa para as novas regras.",
      link: "/ferramentas",
      color: "bg-yellow-50"
    },
    {
      icon: <FileText className="h-10 w-10 text-idvl-blue-dark" />,
      title: "Notícias e Atualizações",
      description: "Mantenha-se informado sobre os últimos acontecimentos relacionados à reforma tributária.",
      link: "/noticias",
      color: "bg-purple-50"
    },
    {
      icon: <Info className="h-10 w-10 text-idvl-blue-dark" />,
      title: "IDVL Soluções",
      description: "Conheça nossos serviços especializados em adequação às novas regras tributárias.",
      link: "/solucoes",
      color: "bg-red-50"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
            Navegue pela Reforma Tributária
          </h2>
          <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
            Utilize nossos recursos para entender e se adaptar às mudanças da reforma tributária brasileira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`rounded-xl p-6 shadow-md transition-transform hover:-translate-y-1 ${feature.color} border border-gray-100`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">{feature.title}</h3>
              <p className="text-idvl-text-light mb-4">{feature.description}</p>
              <Link 
                to={feature.link}
                className="text-idvl-blue-dark font-medium flex items-center hover:underline"
              >
                Saiba mais
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-1"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
