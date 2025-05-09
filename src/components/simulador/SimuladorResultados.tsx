
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ResultadoSimulacao } from '@/types/simulador';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InfoIcon, FileTextIcon, ArrowDown, ArrowUp, HelpCircle, ServerIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface SimuladorResultadosProps {
  resultados: ResultadoSimulacao[];
  resultadosN8n?: any;
  dadosEnviadosN8n?: any;
  onRetry?: () => void;
  erro?: string | null;
}

const formatCurrency = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) {
    return 'N/A';
  }
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const formatPercent = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) {
    return 'N/A';
  }
  return valor.toFixed(2) + '%';
};

const SimuladorResultados: React.FC<SimuladorResultadosProps> = ({ 
  resultados, 
  resultadosN8n,
  dadosEnviadosN8n,
  onRetry,
  erro
}) => {
  const [activeTab, setActiveTab] = useState<string>("reduzir-custo");
  const [activeMainTab, setActiveMainTab] = useState<string>(resultadosN8n ? "n8n-results" : "local-results");
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [dadosProcessados, setDadosProcessados] = useState<boolean>(false);
  const [erroProcessamento, setErroProcessamento] = useState<string | null>(null);
  
  // Log da estrutura dos resultados recebidos
  useEffect(() => {
    console.log('SimuladorResultados recebeu resultados:', resultados);
    console.log('Quantidade de resultados:', resultados?.length || 0);
    console.log('Tipo dos resultados:', Array.isArray(resultados) ? 'Array' : typeof resultados);
    
    if (resultadosN8n) {
      console.log('Resultados N8n disponíveis, estrutura:', JSON.stringify(resultadosN8n, null, 2));
      // Definir a aba principal para mostrar os dados formatados ao invés dos dados brutos
      setActiveMainTab("local-results");
    }
    
    if (resultados?.length > 0) {
      console.log('Primeiro objeto de resultado:', resultados[0]);
    }
  }, [resultados, resultadosN8n]);

  // Efeito para processar os resultados quando mudarem
  useEffect(() => {
    if (!resultados || resultados.length === 0) {
      setDadosProcessados(false);
      return;
    }
    
    console.log("Processando resultados para gráficos:", resultados);
    
    try {
      // Formatar dados para os gráficos - adicionando validação para evitar erros com valores undefined
      const dadosFormatados = resultados.map(r => {
        // Antes de acessar qualquer propriedade, verificar se r é um objeto válido
        if (!r || typeof r !== 'object') {
          console.warn("Resultado inválido encontrado:", r);
          return {
            ano: "N/A",
            aliquota_efetiva_pct: 0,
            aliquota_ibs_pct: 0,
            aliquota_ibs_efetiva_pct: 0,
            aliquota_cbs_pct: 0,
            aliquota_cbs_efetiva_pct: 0,
            impostos_atuais_pct: 0,
            reducao_custo_pct: 0,
            aumento_preco_pct: 0,
          };
        }
        
        // Verificar cada propriedade individualmente e fornecer valores padrão seguros
        const ano = r.ano !== undefined ? String(r.ano) : "N/A";
        
        // Para valores numéricos, garantir que são números válidos antes de chamar toFixed
        let aliquota_efetiva_total = 0;
        if (r.aliquota_efetiva_total !== undefined && r.aliquota_efetiva_total !== null) {
          aliquota_efetiva_total = Number((r.aliquota_efetiva_total * 100).toFixed(2));
        }
        
        let aliquota_ibs = 0;
        if (r.aliquota_ibs !== undefined && r.aliquota_ibs !== null) {
          aliquota_ibs = Number((r.aliquota_ibs * 100).toFixed(2));
        }
        
        let aliquota_ibs_efetiva = 0;
        if (r.aliquota_ibs_efetiva !== undefined && r.aliquota_ibs_efetiva !== null) {
          aliquota_ibs_efetiva = Number((r.aliquota_ibs_efetiva * 100).toFixed(2));
        }
        
        let aliquota_cbs = 0;
        if (r.aliquota_cbs !== undefined && r.aliquota_cbs !== null) {
          aliquota_cbs = Number((r.aliquota_cbs * 100).toFixed(2));
        }
        
        let aliquota_cbs_efetiva = 0;
        if (r.aliquota_cbs_efetiva !== undefined && r.aliquota_cbs_efetiva !== null) {
          aliquota_cbs_efetiva = Number((r.aliquota_cbs_efetiva * 100).toFixed(2));
        }
        
        let impostos_atuais = 0;
        if (r.impostos_atuais !== undefined && r.impostos_atuais !== null) {
          impostos_atuais = Number((r.impostos_atuais * 100).toFixed(2));
        }
        
        let reducao_custo_pct = 0;
        if (r.reducao_custo_pct !== undefined && r.reducao_custo_pct !== null) {
          reducao_custo_pct = Number(r.reducao_custo_pct.toFixed(2));
        }
        
        let aumento_preco_pct = 0;
        if (r.aumento_preco_pct !== undefined && r.aumento_preco_pct !== null) {
          aumento_preco_pct = Number(r.aumento_preco_pct.toFixed(2));
        }
        
        return {
          ...r,
          ano,
          aliquota_efetiva_pct: aliquota_efetiva_total,
          aliquota_ibs_pct: aliquota_ibs,
          aliquota_ibs_efetiva_pct: aliquota_ibs_efetiva,
          aliquota_cbs_pct: aliquota_cbs,
          aliquota_cbs_efetiva_pct: aliquota_cbs_efetiva,
          impostos_atuais_pct: impostos_atuais,
          reducao_custo_pct,
          aumento_preco_pct,
        };
      });
      
      console.log('Dados formatados para gráficos:', dadosFormatados);
      setDadosGrafico(dadosFormatados);
      setDadosProcessados(true);
      setErroProcessamento(null);
    } catch (error: any) {
      console.error("Erro ao processar resultados para gráficos:", error);
      setDadosGrafico([]);
      setDadosProcessados(false);
      setErroProcessamento(error.message || "Erro ao processar os dados para visualização");
    }
  }, [resultados]);

  // Verifica se há erro para exibir
  if (erro) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-medium text-gray-900">Erro na simulação</h3>
          <p className="text-gray-500 max-w-md">{erro}</p>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="mt-4" 
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Verifica se não há resultados
  if (!resultados?.length && !resultadosN8n) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado disponível. Realize uma simulação para ver os resultados.</p>
      </div>
    );
  }
  
  // Tentar extrair os dados do primeiro ano para o resumo inicial
  let primeiroAno: ResultadoSimulacao | undefined;
  
  if (resultados?.length > 0) {
    primeiroAno = resultados[0];
    console.log("Primeiro ano extraído:", primeiroAno);
  } else {
    console.warn("Não foi possível extrair o primeiro ano dos resultados");
  }
  
  // Verificar se há anos com IBS zero para exibir informação específica
  const temAnoComIBSZero = resultados?.some(r => {
    // Verificar se r e r.aliquota_ibs são válidos antes de comparar
    return r && r.aliquota_ibs !== undefined && r.aliquota_ibs === 0;
  }) || false;

  // Renderizar o JSON de forma bonita
  const renderPrettyJson = (data: any) => {
    if (!data) return <p className="text-gray-500">Nenhum dado disponível</p>;
    
    return (
      <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  // Renderizar resultados do n8n
  const renderN8nResults = () => {
    if (!resultadosN8n) {
      return (
        <div className="text-center py-8">
          <ServerIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">Nenhum resultado do serviço externo disponível.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5" />
              Resultados do Processamento Externo (n8n)
            </CardTitle>
            <CardDescription>
              Dados processados e retornados pelo serviço externo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Exibir os resultados do n8n de forma estruturada */}
              {typeof resultadosN8n === 'object' ? (
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(resultadosN8n).map((key) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger className="text-lg font-medium hover:bg-gray-50 px-4 rounded-md">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        {typeof resultadosN8n[key] === 'object' ? 
                          renderPrettyJson(resultadosN8n[key]) : 
                          <p className="py-2">{String(resultadosN8n[key])}</p>
                        }
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{String(resultadosN8n)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados Enviados para Processamento</CardTitle>
            <CardDescription>
              Informações enviadas ao serviço externo para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="dados-enviados">
                <AccordionTrigger className="text-md font-medium hover:bg-gray-50 px-4 rounded-md">
                  Ver dados enviados
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  {renderPrettyJson(dadosEnviadosN8n)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Se temos dados brutos mas não conseguimos processar para exibição
  if (resultadosN8n && (!dadosProcessados || erroProcessamento)) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
          
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
            <ServerIcon className="h-3 w-3 mr-1" />
            Processamento Externo Disponível
          </Badge>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200 mb-4">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Atenção:</strong> Os dados foram recebidos do serviço externo, mas não puderam ser 
            processados para visualização detalhada. {erroProcessamento ? `Erro: ${erroProcessamento}` : ''}
            Você pode ver os dados brutos na aba "Dados Brutos do Processamento".
          </AlertDescription>
        </Alert>
        
        <Tabs value="n8n-results" onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="local-results" className="flex-1">
              Resultados Detalhados
            </TabsTrigger>
            <TabsTrigger value="n8n-results" className="flex-1">
              Dados Brutos do Processamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="local-results">
            <div className="text-center py-8">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Aviso:</strong> Não foi possível processar os dados para visualização detalhada.
                  Verifique os dados brutos na aba "Dados Brutos do Processamento".
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="n8n-results">
            {renderN8nResults()}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Agora podemos renderizar os resultados
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
        
        {resultadosN8n && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
            <ServerIcon className="h-3 w-3 mr-1" />
            Processamento Externo Disponível
          </Badge>
        )}
      </div>
      
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="local-results" className="flex-1">
            Resultados Detalhados
          </TabsTrigger>
          {resultadosN8n && (
            <TabsTrigger value="n8n-results" className="flex-1">
              Dados Brutos do Processamento
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="local-results">
          {/* Se temos primeiroAno e é um objeto válido, podemos exibir o resumo */}
          {primeiroAno && typeof primeiroAno === 'object' ? (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">
                Resumo dos Resultados para {primeiroAno.ano ? primeiroAno.ano : "Simulação"}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <ArrowDown className="h-5 w-5" />
                      Cenário 1: Necessidade de Redução de Custo
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      Para manter o mesmo preço final e lucro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-sm text-gray-600">Redução de custo necessária:</div>
                      <div className="text-xl font-semibold text-blue-700">
                        {formatPercent(primeiroAno.reducao_custo_pct)}
                      </div>
                      
                      <div className="text-sm text-gray-600">Custo atual:</div>
                      <div className="font-semibold">{formatCurrency(primeiroAno.custo_atual)}</div>
                      
                      <div className="text-sm text-gray-600">Custo necessário:</div>
                      <div className="font-semibold">{formatCurrency(primeiroAno.custo_necessario)}</div>
                      
                      <div className="text-sm text-gray-600">Diferença:</div>
                      <div className="font-semibold">
                        {primeiroAno.custo_atual !== undefined && primeiroAno.custo_necessario !== undefined 
                          ? formatCurrency(primeiroAno.custo_atual - primeiroAno.custo_necessario)
                          : 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-800 flex items-center gap-2">
                      <ArrowUp className="h-5 w-5" />
                      Cenário 2: Necessidade de Aumento de Preço
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Para manter o mesmo custo e lucro
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-sm text-gray-600">Aumento de preço necessário:</div>
                      <div className="text-xl font-semibold text-amber-700">
                        {formatPercent(primeiroAno.aumento_preco_pct)}
                      </div>
                      
                      <div className="text-sm text-gray-600">Preço atual:</div>
                      <div className="font-semibold">{formatCurrency(primeiroAno.preco_com_impostos_atual)}</div>
                      
                      <div className="text-sm text-gray-600">Novo preço:</div>
                      <div className="font-semibold">{formatCurrency(primeiroAno.preco_com_impostos_novo)}</div>
                      
                      <div className="text-sm text-gray-600">Diferença:</div>
                      <div className="font-semibold">
                        {primeiroAno.preco_com_impostos_novo !== undefined && 
                         primeiroAno.preco_com_impostos_atual !== undefined 
                          ? formatCurrency(primeiroAno.preco_com_impostos_novo - primeiroAno.preco_com_impostos_atual)
                          : 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Alert className="bg-gray-50 border-gray-200">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">Alíquotas em {primeiroAno.ano || "Simulação"}:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-600">Impostos Atuais:</p>
                        <p className="font-semibold">
                          {primeiroAno.impostos_atuais !== undefined && primeiroAno.impostos_atuais !== null
                            ? formatPercent(primeiroAno.impostos_atuais * 100)
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          IBS Original:
                          <TooltipProvider>
                            <TooltipUI>
                              <TooltipTrigger asChild>
                                <HelpCircle className="inline ml-1 h-3 w-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px]">
                                  Alíquota original do IBS no período. Em alguns anos da transição, pode ser 0%.
                                </p>
                              </TooltipContent>
                            </TooltipUI>
                          </TooltipProvider>
                        </p>
                        <p className="font-semibold">{formatPercent(primeiroAno.aliquota_ibs * 100)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          CBS Original:
                          <TooltipProvider>
                            <TooltipUI>
                              <TooltipTrigger asChild>
                                <HelpCircle className="inline ml-1 h-3 w-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px]">
                                  Alíquota original do CBS no período.
                                </p>
                              </TooltipContent>
                            </TooltipUI>
                          </TooltipProvider>
                        </p>
                        <p className="font-semibold">{formatPercent(primeiroAno.aliquota_cbs * 100)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          IVA Total Efetivo:
                          <TooltipProvider>
                            <TooltipUI>
                              <TooltipTrigger asChild>
                                <HelpCircle className="inline ml-1 h-3 w-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[240px]">
                                  Alíquota efetiva total após aplicar a redução (IBS + CBS). 
                                  {primeiroAno.aliquota_ibs === 0 
                                    ? ' Como o IBS é zero neste período, a redução é aplicada ao CBS.' 
                                    : ' A redução é aplicada apenas ao IBS.'}
                                </p>
                              </TooltipContent>
                            </TooltipUI>
                          </TooltipProvider>
                        </p>
                        <p className="font-semibold">{formatPercent(primeiroAno.aliquota_efetiva_total * 100)}</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
              
              {temAnoComIBSZero && (
                <div className="mt-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <InfoIcon className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Importante:</strong> Em alguns anos da transição tributária, o IBS tem alíquota zero. 
                      Nesses casos, a redução é aplicada sobre a alíquota do CBS, resultando em 
                      um cálculo diferente do período com IBS.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ) : (
            // Caso não tenhamos o primeiroAno definido
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <InfoIcon className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Atenção:</strong> Os dados de resultado não estão no formato esperado. 
                Verifique os dados brutos na aba "Dados Brutos do Processamento".
              </AlertDescription>
            </Alert>
          )}
          
          {/* Se temos dados para o gráfico, podemos exibir as abas de cenários */}
          {dadosGrafico.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reduzir-custo">Cenário: Reduzir Custo</TabsTrigger>
                <TabsTrigger value="aumentar-preco">Cenário: Aumentar Preço</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reduzir-custo">
                <Card className="p-0 overflow-hidden">
                  <CardHeader className="bg-blue-50 border-b">
                    <CardTitle>Redução de Custo Necessária ao Longo dos Anos</CardTitle>
                    <CardDescription>
                      Este gráfico mostra o quanto você precisa reduzir seus custos para manter o mesmo preço e lucro.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dadosGrafico}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis 
                            yAxisId="left" 
                            orientation="left" 
                            label={{ value: 'Redução de Custo (%)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip formatter={(value: any) => [`${value}%`, 'Redução de Custo']} />
                          <Legend />
                          <Bar 
                            yAxisId="left" 
                            dataKey="reducao_custo_pct" 
                            name="Redução de Custo (%)" 
                            fill="#0E76FD" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md space-y-4">
                          <h4 className="font-medium text-gray-800">Como Entender Este Cenário</h4>
                          <p className="text-sm text-gray-600">
                            Para manter o mesmo preço final e o mesmo lucro, você precisará reduzir seus custos 
                            conforme a reforma tributária for implementada. Este cenário é ideal se você estiver 
                            em um mercado competitivo onde aumentar preços não é viável.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md space-y-4">
                          <h4 className="font-medium text-gray-800">Estratégias para Redução de Custos</h4>
                          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>Renegociação com fornecedores</li>
                            <li>Otimização de processos operacionais</li>
                            <li>Economia de escala</li>
                            <li>Redução de desperdícios</li>
                            <li>Automação e tecnologia</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 overflow-x-auto">
                  <Table>
                    <TableCaption>Detalhamento de custos por ano</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ano</TableHead>
                        <TableHead>Custo Atual</TableHead>
                        <TableHead>Custo Necessário</TableHead>
                        <TableHead>Diferença</TableHead>
                        <TableHead>Redução Necessária</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultados.map((resultado) => (
                        <TableRow key={`custo-${resultado.ano}`}>
                          <TableCell className="font-medium">{resultado.ano}</TableCell>
                          <TableCell>{formatCurrency(resultado.custo_atual)}</TableCell>
                          <TableCell>{formatCurrency(resultado.custo_necessario)}</TableCell>
                          <TableCell>{formatCurrency(resultado.custo_atual - resultado.custo_necessario)}</TableCell>
                          <TableCell>{formatPercent(resultado.reducao_custo_pct)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="aumentar-preco">
                <Card className="p-0 overflow-hidden">
                  <CardHeader className="bg-amber-50 border-b">
                    <CardTitle>Aumento de Preço Necessário ao Longo dos Anos</CardTitle>
                    <CardDescription>
                      Este gráfico mostra o quanto você precisa aumentar seus preços para manter o mesmo custo e lucro.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dadosGrafico}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis 
                            yAxisId="left" 
                            orientation="left"
                            label={{ value: 'Aumento de Preço (%)', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip formatter={(value: any) => [`${value}%`, 'Aumento de Preço']} />
                          <Legend />
                          <Bar 
                            yAxisId="left" 
                            dataKey="aumento_preco_pct" 
                            name="Aumento de Preço (%)" 
                            fill="#F59E0B" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md space-y-4">
                          <h4 className="font-medium text-gray-800">Como Entender Este Cenário</h4>
                          <p className="text-sm text-gray-600">
                            Para manter o mesmo custo e lucro, você precisará aumentar seus preços
                            conforme a reforma tributária for implementada. Este cenário é recomendado
                            quando você não tem mais como reduzir custos, mas tem flexibilidade para 
                            ajustar preços.
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md space-y-4">
                          <h4 className="font-medium text-gray-800">Estratégias para Ajuste de Preços</h4>
                          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                            <li>Comunicação clara com clientes sobre a reforma</li>
                            <li>Ajustes graduais nos preços</li>
                            <li>Agregação de valor ao produto/serviço</li>
                            <li>Diferenciação competitiva</li>
                            <li>Revisão da política comercial</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 overflow-x-auto">
                  <Table>
                    <TableCaption>Detalhamento de preços por ano</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ano</TableHead>
                        <TableHead>Preço Atual</TableHead>
                        <TableHead>Novo Preço</TableHead>
                        <TableHead>Diferença</TableHead>
                        <TableHead>Aumento Necessário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultados.map((resultado) => (
                        <TableRow key={`preco-${resultado.ano}`}>
                          <TableCell className="font-medium">{resultado.ano}</TableCell>
                          <TableCell>{formatCurrency(resultado.preco_com_impostos_atual)}</TableCell>
                          <TableCell>{formatCurrency(resultado.preco_com_impostos_novo)}</TableCell>
                          <TableCell>{formatCurrency(resultado.preco_com_impostos_novo - resultado.preco_com_impostos_atual)}</TableCell>
                          <TableCell>{formatPercent(resultado.aumento_preco_pct)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Aviso:</strong> Não foi possível gerar os gráficos com os dados recebidos.
                Verifique os dados brutos na aba "Dados Brutos do Processamento".
              </AlertDescription>
            </Alert>
          )}
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comparativo de Alíquotas</CardTitle>
              <CardDescription>Evolução das alíquotas de impostos ao longo dos anos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dadosGrafico}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [value.toFixed(2) + "%", name]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="impostos_atuais_pct"
                      name="Impostos Atuais (%)"
                      stroke="#6C757D"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aliquota_efetiva_pct"
                      name="Alíquota IVA Efetiva (%)"
                      stroke="#0E76FD"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aliquota_ibs_pct"
                      name="IBS Original (%)"
                      stroke="#38BDF8"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aliquota_cbs_pct"
                      name="CBS Original (%)"
                      stroke="#F59E0B"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <Table>
                  <TableCaption>Detalhamento das alíquotas por ano</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ano</TableHead>
                      <TableHead>Impostos Atuais</TableHead>
                      <TableHead>IBS</TableHead>
                      <TableHead>CBS</TableHead>
                      <TableHead>IVA Efetiva</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((resultado) => (
                      <TableRow key={`aliquota-${resultado.ano}`}>
                        <TableCell className="font-medium">{resultado.ano}</TableCell>
                        <TableCell>{formatPercent(resultado.impostos_atuais ? resultado.impostos_atuais * 100 : null)}</TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_ibs ? resultado.aliquota_ibs * 100 : null)}</TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_cbs ? resultado.aliquota_cbs * 100 : null)}</TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_efetiva_total ? resultado.aliquota_efetiva_total * 100 : null)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="n8n-results">
          {renderN8nResults()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimuladorResultados;
