
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ResultadoSimulacao } from '@/pages/Simulador';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, FileTextIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimuladorResultadosProps {
  resultados: ResultadoSimulacao[];
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

const SimuladorResultados: React.FC<SimuladorResultadosProps> = ({ resultados }) => {
  if (!resultados.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado disponível. Realize uma simulação para ver os resultados.</p>
      </div>
    );
  }
  
  const dataFormatted = resultados.map(r => ({
    ...r,
    aliquota_total: Number((r.aliquota_ibs + r.aliquota_cbs).toFixed(4)) * 100,
    valor_iva: r.preco_sem_imposto * (r.aliquota_ibs + r.aliquota_cbs),
    preco_com_iva: r.preco_sem_imposto * (1 + r.aliquota_ibs + r.aliquota_cbs)
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Visão Geral</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Como funcionará o IVA</h4>
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
                
                <div className="text-gray-600">Preço sem impostos:</div>
                <div>R$ 100,00</div>
                
                <div className="text-gray-600">Impostos atuais (21,25%):</div>
                <div>R$ 26,98 (calculados "por dentro")</div>
                
                <div className="text-gray-600">Preço atual com impostos:</div>
                <div>R$ 126,98</div>
                
                <div className="text-gray-600">Preço sem impostos (base IVA):</div>
                <div>R$ 100,00</div>
                
                <div className="text-gray-600">IVA (IBS+CBS = 22,5%):</div>
                <div>R$ 22,50 (calculado "por fora")</div>
                
                <div className="text-gray-600 font-medium">Preço final com IVA:</div>
                <div className="font-medium">R$ 122,50</div>
                
                <div className="text-gray-600">Custo máximo (margem 30%):</div>
                <div>R$ 70,00 (preço sem imposto × 70%)</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Principais Resultados</h4>
            {resultados.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm text-gray-600">Alíquota Total (IBS+CBS) em {resultados[0].ano}:</div>
                  <div className="text-sm font-semibold">
                    {formatPercent((resultados[0].aliquota_ibs + resultados[0].aliquota_cbs) * 100)}
                  </div>
                  
                  <div className="text-sm text-gray-600">Preço sem imposto:</div>
                  <div className="text-sm font-semibold">{formatCurrency(resultados[0].preco_sem_imposto)}</div>
                  
                  <div className="text-sm text-gray-600">Valor do IVA:</div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(resultados[0].preco_sem_imposto * (resultados[0].aliquota_ibs + resultados[0].aliquota_cbs))}
                  </div>
                  
                  <div className="text-sm text-gray-600">Preço final com IVA:</div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(resultados[0].preco_sem_imposto * (1 + resultados[0].aliquota_ibs + resultados[0].aliquota_cbs))}
                  </div>
                  
                  <div className="text-sm text-gray-600">Custo máximo:</div>
                  <div className="text-sm font-semibold">{formatCurrency(resultados[0].custo_maximo)}</div>
                  
                  <div className="text-sm text-gray-600">Margem líquida:</div>
                  <div className="text-sm font-semibold">{formatPercent(resultados[0].margem_liquida)}</div>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Alert className="bg-amber-50 border-amber-200">
                <InfoIcon className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Importante:</strong> O IVA não compõe a base de cálculo do próprio imposto. 
                  Ele é aplicado por fora do preço sem impostos, diferente do modelo atual onde os impostos são calculados por dentro.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 p-4">Gráfico de Margens e Alíquotas</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataFormatted}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "Margem Líquida (%)" || name === "Alíquota Total (%)") {
                    return [value.toFixed(2) + "%", name];
                  }
                  return [formatCurrency(value), name];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="margem_liquida"
                name="Margem Líquida (%)"
                stroke="#0E76FD"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="aliquota_total"
                name="Alíquota Total (%)"
                stroke="#FF8042"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="preco_sem_imposto"
                name="Preço sem Imposto (R$)"
                stroke="#82ca9d"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="preco_com_iva"
                name="Preço Final com IVA (R$)"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Resultados da simulação por ano</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              <TableHead>Alíquota IBS</TableHead>
              <TableHead>Alíquota CBS</TableHead>
              <TableHead>Preço sem Imposto</TableHead>
              <TableHead>Valor IVA</TableHead>
              <TableHead>Preço Final</TableHead>
              <TableHead>Custo Máximo</TableHead>
              <TableHead>Margem Líquida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados.map((resultado) => {
              const valorIva = resultado.preco_sem_imposto * (resultado.aliquota_ibs + resultado.aliquota_cbs);
              const precoFinal = resultado.preco_sem_imposto + valorIva;
              
              return (
                <TableRow key={resultado.ano}>
                  <TableCell className="font-medium">{resultado.ano}</TableCell>
                  <TableCell>{(resultado.aliquota_ibs * 100).toFixed(2)}%</TableCell>
                  <TableCell>{(resultado.aliquota_cbs * 100).toFixed(2)}%</TableCell>
                  <TableCell>{formatCurrency(resultado.preco_sem_imposto)}</TableCell>
                  <TableCell>{formatCurrency(valorIva)}</TableCell>
                  <TableCell>{formatCurrency(precoFinal)}</TableCell>
                  <TableCell>{formatCurrency(resultado.custo_maximo)}</TableCell>
                  <TableCell>{formatPercent(resultado.margem_liquida)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SimuladorResultados;
