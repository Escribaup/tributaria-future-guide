
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Timeline = () => {
  const [activeYear, setActiveYear] = useState("2023");
  
  const timelineData = [
    {
      year: "2023",
      title: "Aprovação da Reforma",
      description: "Aprovação da Emenda Constitucional 132/2023, que marca o início da implementação da nova estrutura tributária no Brasil.",
      events: [
        "Discussão e apresentação da reforma no Congresso Nacional",
        "Votação e aprovação da PEC",
        "Promulgação da Emenda Constitucional"
      ]
    },
    {
      year: "2024",
      title: "Regulamentação e Transição",
      description: "Definição das regras específicas e preparação para o início da implementação gradual do novo sistema.",
      events: [
        "Aprovação das leis complementares",
        "Definição das alíquotas de referência",
        "Preparação dos sistemas governamentais"
      ]
    },
    {
      year: "2026",
      title: "Início da Implementação",
      description: "Começo da transição para os novos tributos, com implementação parcial das novas regras.",
      events: [
        "Início da implementação do IBS e da CBS com alíquota teste de 0,1%",
        "Início da redução gradual dos tributos existentes",
        "Adaptação dos sistemas empresariais"
      ]
    },
    {
      year: "2027-2032",
      title: "Transição Completa",
      description: "Período de transição gradual até a implementação completa do novo sistema tributário.",
      events: [
        "Redução progressiva dos tributos antigos",
        "Aumento progressivo dos novos tributos",
        "Ajustes e correções no sistema"
      ]
    },
    {
      year: "2033",
      title: "Novo Sistema em Vigor",
      description: "Implementação completa do novo sistema tributário brasileiro, com extinção dos tributos anteriores.",
      events: [
        "Fim do período de transição",
        "IBS e CBS em plena vigência",
        "Extinção completa do PIS, Cofins, IPI, ICMS e ISS"
      ]
    }
  ];

  const activeData = timelineData.find(item => item.year === activeYear) || timelineData[0];

  return (
    <section className="section-padding bg-idvl-gray">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
            Cronograma da Reforma
          </h2>
          <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
            Entenda as etapas de implementação e prepare-se com antecedência.
          </p>
        </div>

        {/* Timeline Years */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {timelineData.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveYear(item.year)}
              className={cn(
                "min-w-[100px] p-4 text-center font-semibold rounded-md transition-all",
                activeYear === item.year 
                  ? "bg-idvl-blue-dark text-white" 
                  : "bg-white text-idvl-text-dark hover:bg-idvl-blue-light hover:text-white"
              )}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Timeline Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-idvl-blue-dark mb-3">
            {activeData.title}
          </h3>
          <p className="text-idvl-text-light mb-6 text-lg">
            {activeData.description}
          </p>
          
          <h4 className="font-semibold text-idvl-blue-dark mb-4">Principais eventos:</h4>
          <ul className="space-y-3">
            {activeData.events.map((event, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-idvl-blue-light text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
