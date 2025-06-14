import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquarePlus, ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
const GuideComplete = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeYear, setActiveYear] = useState("2023");
  const timelineData = [{
    year: "2023",
    title: "Emenda Constitucional",
    description: "Aprovação da Emenda Constitucional da Reforma Tributária.",
    events: ["Aprovação da Emenda Constitucional da Reforma Tributária"]
  }, {
    year: "2024-2025",
    title: "Leis Complementares",
    description: "Leis Complementares que regulamentam o novo sistema tributário.",
    events: ["Leis Complementares que regulamentam:", "O IBS e a CBS", "O Conselho Federativo do IBS", "O Fundo de Desenvolvimento Regional", "O ressarcimento dos saldos credores acumulados do ICMS", "Lei ordinária do Imposto Seletivo", "Desenvolvimento do sistema de cobrança da CBS e do IBS"]
  }, {
    year: "2026",
    title: "Ano teste dos novos tributos",
    description: "Implementação inicial com alíquotas teste dos novos tributos.",
    events: ["Ano teste da CBS, à alíquota de 0,9%, e do IBS, à alíquota de 0,1%, compensáveis com PIS/Cofins e com outros tributos federais"]
  }, {
    year: "2027",
    title: "Início da transição",
    description: "Cobrança da CBS e início da redução gradual de tributos.",
    events: ["Cobrança da CBS e extinção do PIS e da Cofins", "Redução a zero das alíquotas do IPI (exceto ZFM)", "Instituição do Imposto Seletivo"]
  }, {
    year: "2029-2032",
    title: "Transição Gradual",
    description: "Transição gradual entre o antigo e o novo sistema tributário.",
    events: ["Transição ICMS e do ISS para o IBS via aumento gradual da alíquota do IBS e redução gradual das alíquotas do ICMS e do ISS:", "10% em 2029", "20% em 2030", "30% em 2031", "40% em 2032", "100% em 2033"]
  }, {
    year: "2033",
    title: "Vigência Integral",
    description: "Implementação completa do novo modelo tributário.",
    events: ["Vigência integral do novo modelo e extinção do ICMS, do ISS e do IPI"]
  }];
  const activeData = timelineData.find(item => item.year === activeYear) || timelineData[0];
  const breadcrumbs = [{
    text: "Guia Completo",
    href: "/guia-completo"
  }];
  return <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PageHeader title="Guia Completo da Reforma Tributária" description="Entenda todas as mudanças, impactos e o cronograma de implementação da reforma tributária brasileira." breadcrumbs={breadcrumbs} />

        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-idvl-blue-dark mb-4">Neste Guia</h2>
                <nav className="space-y-2">
                  <a href="#overview" onClick={() => setActiveTab("overview")} className={`block p-3 rounded-md ${activeTab === "overview" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    O que é a Reforma
                  </a>
                  <a href="#why" onClick={() => setActiveTab("why")} className={`block p-3 rounded-md ${activeTab === "why" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    Por que é necessária
                  </a>
                  <a href="#changes" onClick={() => setActiveTab("changes")} className={`block p-3 rounded-md ${activeTab === "changes" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    O que muda
                  </a>
                  <a href="#timeline" onClick={() => setActiveTab("timeline")} className={`block p-3 rounded-md ${activeTab === "timeline" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    Cronograma
                  </a>
                  <a href="#glossary" onClick={() => setActiveTab("glossary")} className={`block p-3 rounded-md ${activeTab === "glossary" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    Glossário
                  </a>
                  <a href="#faq" onClick={() => setActiveTab("faq")} className={`block p-3 rounded-md ${activeTab === "faq" ? "bg-idvl-blue-light text-white" : "hover:bg-gray-100"}`}>
                    Perguntas Frequentes
                  </a>
                </nav>

                <div className="mt-8 p-4 bg-idvl-gray rounded-lg">
                  <h3 className="font-semibold text-idvl-blue-dark mb-2">Precisa de ajuda?</h3>
                  <p className="text-sm text-idvl-text-light mb-3">
                    Nossa equipe está pronta para esclarecer suas dúvidas sobre a reforma tributária.
                  </p>
                  <a href="https://wa.me/41996946641" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm w-full text-center block flex items-center justify-center gap-2">
                    <MessageSquarePlus className="w-4 h-4" />
                    Fale com um especialista
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="overview">O que é a Reforma</TabsTrigger>
                  <TabsTrigger value="why">Por que é necessária</TabsTrigger>
                  <TabsTrigger value="changes">O que muda</TabsTrigger>
                  <TabsTrigger value="timeline">Cronograma</TabsTrigger>
                  <TabsTrigger value="glossary">Glossário</TabsTrigger>
                  <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" id="overview" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">O que é a Reforma Tributária</h2>
                    
                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-4">
                        A Reforma Tributária brasileira, aprovada em 2023 através da Emenda Constitucional 132, 
                        representa a mais significativa reestruturação do sistema tributário nacional em décadas. 
                        Seu objetivo principal é simplificar e tornar mais eficiente a tributação sobre o consumo no país.
                      </p>
                      
                      <p className="mb-4">
                        Essa reforma unifica diversos tributos existentes em impostos mais simples, com destaque para a 
                        criação do Imposto sobre Bens e Serviços (IBS) e da Contribuição sobre Bens e Serviços (CBS), 
                        que substituirão gradualmente cinco tributos atuais: PIS, Cofins, IPI, ICMS e ISS.
                      </p>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Principais Características</h3>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Simplificação do sistema tributário com menos tributos e regras mais claras</li>
                        <li>Adoção do princípio do destino, tributando onde ocorre o consumo</li>
                        <li>Não-cumulatividade plena, eliminando o "efeito cascata"</li>
                        <li>Implementação gradual ao longo de vários anos</li>
                        <li>Manutenção da carga tributária global (neutralidade)</li>
                      </ul>

                      <div className="bg-idvl-gray p-6 rounded-lg mb-6">
                        <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">Impacto Esperado</h4>
                        <p>
                          Estima-se que a reforma poderá aumentar o PIB brasileiro em até 12% ao longo de 15 anos, 
                          segundo estudos da Fundação Getulio Vargas. Isso representa um acréscimo de riqueza de 
                          aproximadamente R$ 1,2 trilhão à economia do país, com aumento de produtividade e redução do 
                          custo Brasil.
                        </p>
                      </div>

                      <figure className="my-8">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Reforma Tributária" className="w-full rounded-lg" />
                        <figcaption className="text-center text-sm text-idvl-text-light mt-2">
                          A reforma tributária visa modernizar o sistema fiscal do Brasil
                        </figcaption>
                      </figure>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Bases da Reforma</h3>
                      
                      <p className="mb-4">
                        A reforma segue princípios tributários internacionalmente reconhecidos, como o Imposto sobre 
                        Valor Agregado (IVA), já adotado em mais de 170 países. O modelo brasileiro terá algumas 
                        particularidades, como a divisão em um IVA dual (IBS e CBS) e tratamentos diferenciados para 
                        determinados setores e produtos essenciais.
                      </p>
                      
                      <p>
                        A implementação será gradual, iniciando-se em 2026 e concluindo-se em 2033, permitindo uma 
                        adaptação progressiva das empresas e do governo às novas regras. Durante esse período, haverá 
                        uma coexistência dos tributos antigos e novos, com alíquotas sendo ajustadas gradativamente.
                      </p>
                    </div>
                    
                    <div className="mt-8">
                      
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="why" id="why" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">Por que a Reforma é Necessária</h2>
                    
                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-4">
                        O sistema tributário brasileiro atual é reconhecido como um dos mais complexos e oneroso do mundo. 
                        Esta complexidade gera diversos problemas que afetam negativamente a economia e a sociedade como um todo.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="bg-idvl-gray p-6 rounded-lg">
                          <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">Complexidade Excessiva</h4>
                          <p>
                            O Brasil possui mais de 90 tributos diferentes, com regras específicas para cada um. 
                            Empresas gastam, em média, 1.501 horas por ano apenas para cumprir obrigações tributárias, 
                            segundo o Banco Mundial.
                          </p>
                        </div>
                        <div className="bg-idvl-gray p-6 rounded-lg">
                          <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">Guerra Fiscal</h4>
                          <p>
                            A competição entre estados e municípios pela atração de empresas através de incentivos 
                            fiscais cria distorções econômicas e reduz a arrecadação pública sem necessariamente 
                            gerar desenvolvimento regional equilibrado.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Problemas do Sistema Atual</h3>
                      
                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li><strong>Cumulatividade:</strong> Tributos que incidem em cascata, gerando tributação sobre tributação</li>
                        <li><strong>Insegurança jurídica:</strong> Mais de 50 mil normas tributárias vigentes, gerando contencioso tributário de R$ 5,4 trilhões</li>
                        <li><strong>Custo de conformidade:</strong> Empresas precisam manter grandes estruturas apenas para cumprir obrigações fiscais</li>
                        <li><strong>Regressividade:</strong> Sistema que onera proporcionalmente mais as pessoas de menor renda</li>
                        <li><strong>Fragmentação federativa:</strong> Conflitos de competência entre União, estados e municípios</li>
                      </ul>

                      <figure className="my-8">
                        <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Complexidade Tributária" className="w-full rounded-lg" />
                        <figcaption className="text-center text-sm text-idvl-text-light mt-2">
                          A complexidade do sistema tributário brasileiro impõe altos custos às empresas
                        </figcaption>
                      </figure>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Benefícios Esperados</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-idvl-blue-dark mb-2">Aumento do PIB</h4>
                          <p className="text-sm">Potencial crescimento de 12% no PIB em 15 anos após implementação completa.</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-idvl-blue-dark mb-2">Redução de Custos</h4>
                          <p className="text-sm">Diminuição estimada de 30% nos custos de conformidade tributária para empresas.</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-idvl-blue-dark mb-2">Mais Investimentos</h4>
                          <p className="text-sm">Aumento previsto de 16% nos investimentos produtivos no país.</p>
                        </div>
                      </div>
                      
                      <p>
                        Além desses benefícios quantificáveis, espera-se maior segurança jurídica, redução de litígios 
                        tributários, maior equidade na tributação e fortalecimento do pacto federativo com distribuição 
                        mais justa de recursos entre União, estados e municípios.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="changes" id="changes" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">O que Muda com a Reforma</h2>

                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-4">
                        A reforma tributária substitui cinco tributos atuais por dois novos impostos sobre o consumo, 
                        além de criar um Imposto Seletivo para produtos específicos. Entenda as principais mudanças:
                      </p>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Novos Tributos</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                        <div className="bg-idvl-gray p-6 rounded-lg">
                          <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">IBS</h4>
                          <p className="mb-3">
                            <strong>Imposto sobre Bens e Serviços</strong> - Tributo de competência estadual e municipal que substituirá o ICMS e o ISS.
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Arrecadado por comitê gestor</li>
                            <li>Receita distribuída para estados e municípios</li>
                            <li>Não-cumulativo e com crédito amplo</li>
                          </ul>
                        </div>
                        <div className="bg-idvl-gray p-6 rounded-lg">
                          <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">CBS</h4>
                          <p className="mb-3">
                            <strong>Contribuição sobre Bens e Serviços</strong> - Tributo federal que substituirá PIS, Cofins e IPI.
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Administrado pela Receita Federal</li>
                            <li>Mesma base de cálculo do IBS</li>
                            <li>Estrutura similar à do IBS</li>
                          </ul>
                        </div>
                        <div className="bg-idvl-gray p-6 rounded-lg">
                          <h4 className="text-xl font-semibold text-idvl-blue-dark mb-3">IS</h4>
                          <p className="mb-3">
                            <strong>Imposto Seletivo</strong> - "Imposto do pecado" sobre produtos prejudiciais à saúde ou ao meio ambiente.
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Incidirá sobre itens como bebidas alcoólicas e tabaco</li>
                            <li>Função extrafiscal (regulatória)</li>
                            <li>Competência da União</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Princípios da Nova Tributação</h3>
                      
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-idvl-blue-dark text-white">
                              <th className="border border-gray-300 px-4 py-2">Princípio</th>
                              <th className="border border-gray-300 px-4 py-2">Como Era</th>
                              <th className="border border-gray-300 px-4 py-2">Como Ficará</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Local de Tributação</td>
                              <td className="border border-gray-300 px-4 py-2">Origem (onde se produz)</td>
                              <td className="border border-gray-300 px-4 py-2">Destino (onde se consome)</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Cumulatividade</td>
                              <td className="border border-gray-300 px-4 py-2">Tributos em cascata</td>
                              <td className="border border-gray-300 px-4 py-2">Não-cumulatividade plena</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Créditos Tributários</td>
                              <td className="border border-gray-300 px-4 py-2">Restritos e complexos</td>
                              <td className="border border-gray-300 px-4 py-2">Amplos e automáticos</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Alíquotas</td>
                              <td className="border border-gray-300 px-4 py-2">Múltiplas e variáveis por local</td>
                              <td className="border border-gray-300 px-4 py-2">Padrão nacional com exceções limitadas</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 px-4 py-2 font-medium">Legislação</td>
                              <td className="border border-gray-300 px-4 py-2">27 legislações estaduais + mais de 5.500 municipais</td>
                              <td className="border border-gray-300 px-4 py-2">Única nacional</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3 className="text-2xl font-bold text-idvl-blue-dark mt-8 mb-4">Tratamentos Diferenciados</h3>
                      
                      <p className="mb-4">
                        A reforma prevê alíquotas reduzidas ou isenções para determinados setores e produtos:
                      </p>

                      <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Alimentos da cesta básica - alíquota zero (isenção)</li>
                        <li>Medicamentos - redução de 60% na alíquota</li>
                        <li>Serviços de educação - redução de 60% na alíquota</li>
                        <li>Serviços de saúde - redução de 60% na alíquota</li>
                        <li>Transporte público - redução de 60% na alíquota</li>
                        <li>Regimes específicos para setores como combustíveis, serviços financeiros, imóveis e agronegócio</li>
                      </ul>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                        <h4 className="font-semibold text-yellow-800 mb-2">Atenção!</h4>
                        <p className="text-yellow-700">
                          As alíquotas específicas e detalhes dos regimes diferenciados ainda serão definidos nas leis complementares 
                          que regulamentarão a reforma. Acompanhe as atualizações.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" id="timeline" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">Cronograma de Implementação</h2>
                    
                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-6">
                        A implementação da Reforma Tributária seguirá um cronograma gradual ao longo de vários anos, 
                        permitindo que empresas e governos se adaptem progressivamente às mudanças.
                      </p>

                      {/* Timeline visualization - Same as home page */}
                      <div className="relative mb-12 max-w-5xl mx-auto">
                        {/* Timeline line */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-idvl-blue-light" />
                        
                        {/* Timeline dots and years */}
                        <div className="flex justify-between relative">
                          {timelineData.map((item, index) => <div key={index} className="flex flex-col items-center">
                              <button onClick={() => setActiveYear(item.year)} className={cn("w-8 h-8 rounded-full z-10 transition-all duration-300 flex items-center justify-center border-2", activeYear === item.year ? "bg-idvl-blue-dark border-white" : "bg-idvl-blue-light border-idvl-blue-light hover:bg-idvl-blue-dark")}>
                                <span className="sr-only">{item.year}</span>
                              </button>
                              <div className={cn("mt-3 bg-idvl-blue-dark text-white font-semibold py-2 px-3 rounded-md transition-all", activeYear === item.year ? "scale-110" : "")}>
                                {item.year}
                              </div>
                            </div>)}
                        </div>
                      </div>

                      {/* Timeline Content - Same as home page */}
                      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
                        <h3 className="text-2xl font-bold text-idvl-blue-dark mb-3">
                          {activeData.title}
                        </h3>
                        <p className="text-idvl-text-light mb-6 text-lg">
                          {activeData.description}
                        </p>
                        
                        <h4 className="font-semibold text-idvl-blue-dark mb-4">Principais eventos:</h4>
                        <ul className="space-y-3">
                          {activeData.events.map((event, index) => <li key={index} className="flex items-start">
                              {event.startsWith("O ") || event.startsWith("10%") || event.startsWith("20%") || event.startsWith("30%") || event.startsWith("40%") || event.startsWith("100%") ? <>
                                  <span className="text-idvl-blue-light mr-2">
                                    <ChevronRight className="h-5 w-5" />
                                  </span>
                                  <span className="ml-2">{event}</span>
                                </> : <>
                                  <span className="bg-idvl-blue-light text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span>{event}</span>
                                </>}
                            </li>)}
                        </ul>
                      </div>

                      <div className="mt-10 p-6 bg-idvl-gray rounded-lg">
                        <h3 className="text-xl font-bold text-idvl-blue-dark mb-3">Preparação para as Empresas</h3>
                        <p className="mb-3">
                          É fundamental que as organizações iniciem sua preparação o quanto antes, considerando:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2">
                          <li>Avaliação do impacto das mudanças tributárias no negócio</li>
                          <li>Adaptação dos sistemas de gestão e contabilidade</li>
                          <li>Treinamento das equipes internas</li>
                          <li>Revisão de contratos e políticas de preços</li>
                          <li>Planejamento estratégico para a transição</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="glossary" id="glossary" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">Glossário da Reforma Tributária</h2>
                    
                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-6">
                        Entenda os principais termos e conceitos relacionados à Reforma Tributária:
                      </p>

                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">IBS - Imposto sobre Bens e Serviços</h3>
                          <p>
                            Novo imposto de competência estadual e municipal que substituirá o ICMS e o ISS. 
                            Será um imposto sobre valor agregado (IVA) com alíquota única nacional, não-cumulativo 
                            e cobrado no destino.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">CBS - Contribuição sobre Bens e Serviços</h3>
                          <p>
                            Nova contribuição federal que substituirá o PIS, a Cofins e o IPI. Terá as mesmas 
                            características do IBS, formando com ele o sistema de IVA dual brasileiro.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Imposto Seletivo (IS)</h3>
                          <p>
                            Também conhecido como "Imposto do Pecado", incidirá sobre produtos e serviços prejudiciais à saúde 
                            ou ao meio ambiente, como bebidas alcoólicas, tabaco e veículos poluentes. Tem função regulatória além da arrecadatória.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">IVA - Imposto sobre Valor Agregado</h3>
                          <p>
                            Modelo de tributação que incide apenas sobre o valor adicionado em cada etapa da cadeia produtiva, 
                            evitando a tributação em cascata. É o modelo mais utilizado no mundo para tributar o consumo.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Não-cumulatividade</h3>
                          <p>
                            Princípio tributário que permite ao contribuinte abater do imposto a pagar o valor do tributo 
                            já recolhido nas etapas anteriores da cadeia. Evita o "efeito cascata" e a tributação em duplicidade.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Princípio do Destino</h3>
                          <p>
                            Sistema de tributação em que o imposto é cobrado no local onde o bem é consumido ou o serviço é utilizado, 
                            não onde é produzido. Este princípio acaba com a guerra fiscal entre estados e municípios.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Comitê Gestor do IBS</h3>
                          <p>
                            Órgão que será criado para administrar o IBS, formado por representantes dos estados e municípios. 
                            Será responsável por arrecadar o imposto e distribuir as receitas para os entes federativos.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Alíquota de Referência</h3>
                          <p>
                            Alíquota padrão que será calculada para manter a carga tributária atual. Servirá como base para 
                            as reduções e isenções previstas para determinados setores e produtos.
                          </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Cashback</h3>
                          <p>
                            Sistema de devolução de parte do imposto pago por famílias de baixa renda na aquisição de bens e serviços. 
                            Visa tornar o sistema tributário mais progressivo.
                          </p>
                        </div>

                        <div className="pb-4">
                          <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">Regimes Específicos</h3>
                          <p>
                            Tratamentos diferenciados previstos para determinados setores econômicos com características especiais, 
                            como combustíveis, serviços financeiros, imóveis e agronegócio.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="faq" id="faq" className="animate-fade-in">
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <h2 className="text-3xl font-bold text-idvl-blue-dark mb-6">Perguntas Frequentes</h2>
                    
                    <div className="prose max-w-none text-idvl-text-dark">
                      <p className="mb-6">
                        Respostas para as dúvidas mais comuns sobre a Reforma Tributária:
                      </p>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            A reforma vai aumentar a carga tributária?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              A reforma foi desenhada para ser neutra em termos de carga tributária global. Isso significa que 
                              o objetivo é manter a arrecadação total no mesmo patamar, apenas reorganizando a forma como os 
                              tributos são cobrados. No entanto, pode haver redistribuição da carga entre setores econômicos, 
                              com alguns pagando mais e outros menos do que pagam atualmente.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Quando as mudanças entrarão em vigor?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              A implementação será gradual. Em 2026, o IBS e a CBS começarão a ser cobrados com uma alíquota 
                              teste de 0,1%. A partir de 2027, inicia-se a redução dos tributos atuais e o aumento progressivo 
                              dos novos. A implementação completa, com a extinção dos tributos antigos, ocorrerá em 2033.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Como ficará a tributação dos alimentos?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              Os alimentos que compõem a cesta básica nacional terão alíquota zero, ou seja, serão isentos do 
                              IBS e da CBS. Outros alimentos poderão ter reduções parciais nas alíquotas ou serão tributados 
                              pela alíquota padrão, conforme definições que serão feitas nas leis complementares.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            O que acontecerá com os benefícios fiscais existentes?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              Os benefícios fiscais atuais serão gradualmente extintos durante o período de transição. 
                              Alguns serão substituídos por subvenções diretas no âmbito de um fundo de desenvolvimento 
                              regional e industrial. As empresas que possuem benefícios com prazo definido poderão mantê-los 
                              até o fim da vigência, dentro de certas condições.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Como serão tributadas as exportações?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              As exportações serão completamente desoneradas, seguindo o princípio do destino. 
                              Isso significa que os produtos e serviços exportados não serão tributados pelo IBS e pela CBS, 
                              e os exportadores terão direito a crédito integral dos tributos pagos em suas aquisições. 
                              Esta é uma melhoria importante em relação ao sistema atual, onde há resíduos tributários nas exportações.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-6">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Como a reforma afetará o Simples Nacional?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              O Simples Nacional será mantido. As empresas optantes poderão escolher entre permanecer no regime 
                              atual ou migrar para o novo sistema de IBS e CBS. Além disso, as empresas do Simples poderão 
                              transferir seus créditos tributários para outras empresas, o que não é possível no sistema atual. 
                              Isso pode representar um benefício adicional para pequenas empresas que fornecem para médias e grandes.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-7">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Qual será a alíquota dos novos tributos?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              A alíquota padrão ainda será definida por lei complementar, mas estimativas preliminares apontam 
                              para algo em torno de 25% a 28% (somando IBS e CBS). Esta alíquota será calculada para manter a 
                              arrecadação atual, considerando as reduções e isenções previstas para determinados setores e produtos.
                            </p>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-8">
                          <AccordionTrigger className="text-lg font-semibold text-idvl-blue-dark">
                            Como as empresas devem se preparar para a reforma?
                          </AccordionTrigger>
                          <AccordionContent className="text-idvl-text-dark">
                            <p>
                              Recomenda-se que as empresas iniciem o quanto antes um processo de:
                            </p>
                            <ol className="list-decimal pl-6 space-y-1 mt-2">
                              <li>Diagnóstico do impacto das mudanças no negócio</li>
                              <li>Revisão de processos internos e sistemas de gestão</li>
                              <li>Capacitação das equipes fiscais e contábeis</li>
                              <li>Planejamento financeiro para o período de transição</li>
                              <li>Análise de contratos com fornecedores e clientes</li>
                              <li>Consideração de oportunidades estratégicas decorrentes das mudanças</li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <div className="mt-10 p-6 bg-idvl-blue-dark text-white rounded-lg">
                        <h3 className="text-xl font-bold mb-3 text-slate-50">Ainda tem dúvidas?</h3>
                        <p className="mb-4 font-normal text-slate-50">
                          Entre em contato com nossa equipe de especialistas para obter respostas personalizadas 
                          sobre como a reforma tributária afetará seu negócio.
                        </p>
                        <a href="https://wa.me/41996946641" target="_blank" rel="noopener noreferrer" className="bg-white text-idvl-blue-dark hover:bg-opacity-90 transition-all px-6 py-3 rounded-md font-semibold inline-flex items-center">
                          Falar com um especialista
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default GuideComplete;