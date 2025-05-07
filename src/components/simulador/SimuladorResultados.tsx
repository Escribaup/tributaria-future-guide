
import React, { useState } from 'react';
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

interface SimuladorResultadosProps {
  resultados: ResultadoSimulacao[];
  resultadosN8n?: any;
  dadosEnviadosN8n?: any;
}

const formatCurrency = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

const formatPercent = (valor: number) => {
  return valor.toFixed(2) + '%';
};

const SimuladorResultados: React.FC<SimuladorResultadosProps> = ({ 
  resultados, 
  resultadosN8n,
  dadosEnviadosN8n 
}) => {
  const [activeTab, setActiveTab] = useState<string>("reduzir-custo");
  const [activeMainTab, setActiveMainTab] = useState<string>(resultadosN8n ? "n8n-results" : "local-results");

  if (!resultados.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado disponível. Realize uma simulação para ver os resultados.</p>
      </div>
    );
  }
  
  // Pegando os dados do primeiro ano para o resumo inicial
  const primeiroAno = resultados[0];
  
  // Formatar dados para os gráficos
  const dadosGrafico = resultados.map(r => ({
    ...r,
    ano: r.ano.toString(),
    aliquota_efetiva_pct: Number((r.aliquota_efetiva_total * 100).toFixed(2)),
    aliquota_ibs_pct: Number((r.aliquota_ibs * 100).toFixed(2)),
    aliquota_ibs_efetiva_pct: Number((r.aliquota_ibs_efetiva * 100).toFixed(2)),
    aliquota_cbs_pct: Number((r.aliquota_cbs * 100).toFixed(2)),
    aliquota_cbs_efetiva_pct: Number((r.aliquota_cbs_efetiva * 100).toFixed(2)),
    impostos_atuais_pct: Number((r.impostos_atuais * 100).toFixed(2)),
    reducao_custo_pct: Number(r.reducao_custo_pct.toFixed(2)),
    aumento_preco_pct: Number(r.aumento_preco_pct.toFixed(2)),
  }));

  // Determinar se há algum ano com IBS zero para exibir informação específica
  const temAnoComIBSZero = resultados.some(r => r.aliquota_ibs === 0);

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
                          <p className="py-2">{resultadosN8n[key].toString()}</p>
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
            Resultados Locais
          </TabsTrigger>
          {resultadosN8n && (
            <TabsTrigger value="n8n-results" className="flex-1">
              Resultados Externos (n8n)
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="local-results">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Resumo dos Resultados para {primeiroAno.ano}</h3>
            
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
                    <div className="font-semibold">{formatCurrency(primeiroAno.custo_atual - primeiroAno.custo_necessario)}</div>
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
                    <div className="font-semibold">{formatCurrency(primeiroAno.preco_com_impostos_novo - primeiroAno.preco_com_impostos_atual)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Alert className="bg-gray-50 border-gray-200">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium">Alíquotas em {primeiroAno.ano}:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">Impostos Atuais:</p>
                      <p className="font-semibold">{formatPercent(primeiroAno.impostos_atuais * 100)}</p>
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
                      <TableHead>IBS (%)</TableHead>
                      <TableHead>CBS (%)</TableHead>
                      <TableHead>Redução Aplicada</TableHead>
                      <TableHead>Alíquota Efetiva (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((resultado) => (
                      <TableRow key={`aliquotas-${resultado.ano}`}>
                        <TableCell className="font-medium">{resultado.ano}</TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_ibs * 100)}</TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_cbs * 100)}</TableCell>
                        <TableCell>
                          {resultado.aliquota_ibs === 0 
                            ? `Redução no CBS: ${formatPercent((1 - resultado.aliquota_cbs_efetiva / resultado.aliquota_cbs) * 100)}`
                            : `Redução no IBS: ${formatPercent((1 - resultado.aliquota_ibs_efetiva / resultado.aliquota_ibs) * 100)}`
                          }
                        </TableCell>
                        <TableCell>{formatPercent(resultado.aliquota_efetiva_total * 100)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <h3 className="text-lg font-semibold mb-4">Como Funciona o IVA</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Como funciona o novo sistema</h4>
                <p className="text-sm text-gray-600 mb-4">
                  O novo Imposto sobre Valor Agregado (IVA) é composto pelo IBS (Imposto sobre Bens e Serviços) 
                  e CBS (Contribuição sobre Bens e Serviços). Diferente dos impostos atuais, o IVA é calculado por fora
                  do preço do produto, sendo adicionado ao valor final.
                </p>
                
                <Alert variant="default" className="bg-blue-50 mb-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Por dentro vs. Por fora</strong>: Nos impostos atuais, o imposto faz parte do preço (está "por dentro"). 
                    No modelo do IVA, o imposto é adicionado ao preço (fica "por fora"), como em países europeus.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextIcon className="h-4 w-4 text-gray-600" />
                    <p className="text-sm font-semibold">Exemplo de cálculo:</p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-600">Custo do produto:</div>
                    <div>R$ 70,00</div>
                    
                    <div className="text-gray-600">Preço com impostos atuais (21,25%):</div>
                    <div>R$ 100,00</div>
                    
                    <div className="text-gray-600">Preço sem impostos:</div>
                    <div>R$ 75,61 (100,00 ÷ 1,2125)</div>
                    
                    <div className="text-gray-600">IVA (IBS+CBS = 26,50%):</div>
                    <div>R$ 20,04 (75,61 × 26,50%)</div>
                    
                    <div className="text-gray-600 font-medium">Preço final com IVA:</div>
                    <div className="font-medium">R$ 95,65 (75,61 + 20,04)</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Impactos da Reforma</h4>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2 mb-4">
                  <li>
                    <strong>Transparência tributária</strong>: O consumidor saberá exatamente quanto está 
                    pagando de imposto.
                  </li>
                  <li>
                    <strong>Simplicidade</strong>: Substituição de diversos tributos por um único imposto.
                  </li>
                  <li>
                    <strong>Não-cumulatividade</strong>: O imposto incide apenas sobre o valor agregado em 
                    cada etapa da cadeia produtiva.
                  </li>
                  <li>
                    <strong>Transição gradual</strong>: A implementação será gradativa ao longo dos anos.
                  </li>
                </ul>
                
                <div className="mt-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <InfoIcon className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Importante:</strong> Durante a transição tributária, o IBS e o CBS são implementados gradualmente.
                      Em alguns anos, o IBS tem alíquota zero e apenas o CBS está em vigor. Nestas situações,
                      a redução percentual é aplicada ao CBS.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="n8n-results">
          {renderN8nResults()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimuladorResultados;
