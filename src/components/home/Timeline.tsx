
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

const Timeline = () => {
  const [activeYear, setActiveYear] = useState("2023");
  const timelineData = [
    {
      year: "2023",
      title: "Emenda Constitucional",
      description: "Aprovação da Emenda Constitucional da Reforma Tributária.",
      events: [
        "Aprovação da Emenda Constitucional da Reforma Tributária"
      ]
    },
    {
      year: "2024-2025",
      title: "Leis Complementares",
      description: "Leis Complementares que regulamentam o novo sistema tributário.",
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
      title: "Ano teste dos novos tributos",
      description: "Implementação inicial com alíquotas teste dos novos tributos.",
      events: [
        "Ano teste da CBS, à alíquota de 0,9%, e do IBS, à alíquota de 0,1%, compensáveis com PIS/Cofins e com outros tributos federais"
      ]
    },
    {
      year: "2027",
      title: "Início da transição",
      description: "Cobrança da CBS e início da redução gradual de tributos.",
      events: [
        "Cobrança da CBS e extinção do PIS e da Cofins",
        "Redução a zero das alíquotas do IPI (exceto ZFM)",
        "Instituição do Imposto Seletivo"
      ]
    },
    {
      year: "2029-2032",
      title: "Transição Gradual",
      description: "Transição gradual entre o antigo e o novo sistema tributário.",
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
      title: "Vigência Integral",
      description: "Implementação completa do novo modelo tributário.",
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

        {/* Timeline visualization */}
        <div className="relative mb-12 max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-idvl-blue-light" />
          
          {/* Timeline dots and years */}
          <div className="flex justify-between relative">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <button 
                  onClick={() => setActiveYear(item.year)}
                  className={cn(
                    "w-8 h-8 rounded-full z-10 transition-all duration-300 flex items-center justify-center border-2",
                    activeYear === item.year 
                      ? "bg-idvl-blue-dark border-white" 
                      : "bg-idvl-blue-light border-idvl-blue-light hover:bg-idvl-blue-dark"
                  )}
                >
                  <span className="sr-only">{item.year}</span>
                </button>
                <div className={cn(
                  "mt-3 bg-idvl-blue-dark text-white font-semibold py-2 px-3 rounded-md transition-all",
                  activeYear === item.year ? "scale-110" : ""
                )}>
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
              <li key={index} className="flex items-start">
                {event.startsWith("O ") || event.startsWith("10%") || event.startsWith("20%") || event.startsWith("30%") || event.startsWith("40%") || event.startsWith("100%") ? (
                  <>
                    <span className="text-idvl-blue-light mr-2">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                    <span className="ml-2">{event}</span>
                  </>
                ) : (
                  <>
                    <span className="bg-idvl-blue-light text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{event}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
