
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

const Timeline = () => {
  const [activeYear, setActiveYear] = useState("2023");
  
  const timelineData = [
    {
      year: "2023",
      title: "Aprovação da Reforma",
      description: "Implementação inicial da reforma tributária.",
      events: [
        "Emenda Constitucional da Reforma Tributária"
      ]
    },
    {
      year: "2024-2025",
      title: "Regulamentação",
      description: "Definição das regras específicas através de legislação complementar.",
      events: [
        "Leis Complementares que regulamentam:",
        "O IBS e a CBS",
        "O Conselho Federativo do IBS",
        "O Fundo de Desenvolvimento Regional",
        "O ressarcimento dos saldos credores acumulados do ICMS",
        "Lei ordinária do Imposto Seletivo",
        "Desenvolvimento do sistema de cobrança da CBS e do IBS"
      ]
    },
    {
      year: "2026",
      title: "Ano Teste",
      description: "Início da implementação com alíquota teste.",
      events: [
        "Ano teste da CBS, à alíquota de 0,9%, e do IBS, à alíquota de 0,1%, compensáveis com PIS/Cofins e com outros tributos federais"
      ]
    },
    {
      year: "2027",
      title: "Início da Transição",
      description: "Começo da extinção gradual dos tributos antigos.",
      events: [
        "Cobrança da CBS e extinção do PIS e da Cofins",
        "Redução a zero das alíquotas do IPI (exceto ZFM)",
        "Instituição do Imposto Seletivo"
      ]
    },
    {
      year: "2029-2032",
      title: "Transição Completa",
      description: "Período de substituição gradual dos impostos atuais.",
      events: [
        "Transição ICMS e do ISS para o IBS via aumento gradual da alíquota do IBS e redução gradual das alíquotas do ICMS e do ISS:",
        "10% em 2029",
        "20% em 2030",
        "30% em 2031",
        "40% em 2032",
        "100% em 2033"
      ]
    },
    {
      year: "2033",
      title: "Novo Sistema em Vigor",
      description: "Implementação total do novo sistema tributário.",
      events: [
        "Vigência integral do novo modelo e extinção do ICMS, do ISS e do IPI"
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

        {/* New Timeline Visualization inspired by the image */}
        <div className="mb-12 relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-blue-600 z-0"></div>
          
          {/* Timeline points and year labels */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => setActiveYear(item.year)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all",
                    activeYear === item.year ? "bg-blue-600 ring-4 ring-blue-200" : "bg-blue-600"
                  )}
                >
                  <Circle className="w-3 h-3 text-white fill-white" />
                </button>
                <div 
                  className={cn(
                    "mt-2 py-2 px-4 font-bold text-center transition-all w-full",
                    activeYear === item.year 
                      ? "bg-green-500 text-white" 
                      : "bg-green-500 text-white"
                  )}
                >
                  {item.year}
                </div>
              </div>
            ))}
          </div>
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
              <li key={index} className={cn(
                "flex items-start",
                index === 0 && !event.startsWith("O") && !event.startsWith("Transição") && !event.startsWith("Vigência") 
                  ? "" 
                  : "ml-5"
              )}>
                <span className={cn(
                  "text-green-500 mr-2",
                  index === 0 && !event.startsWith("O") && !event.startsWith("Transição") && !event.startsWith("Vigência") 
                    ? "" 
                    : ""
                )}>•</span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 p-6 bg-idvl-blue-light bg-opacity-10 rounded-lg">
          <h3 className="font-bold text-idvl-blue-dark mb-2">Importante:</h3>
          <p className="text-idvl-text-dark">
            Este cronograma representa a previsão atual de implementação da reforma tributária, 
            conforme aprovado na Emenda Constitucional 132/2023. Eventuais alterações podem ocorrer 
            durante o processo de regulamentação.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
