
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
    aliquota_total: Number((r.aliquota_ibs + r.aliquota_cbs).toFixed(4)) * 100
  }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
      
      <div className="bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Gráfico de Margens e Alíquotas</h3>
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
              <Tooltip />
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
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Custo Máximo</TableHead>
              <TableHead>Margem Líquida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultados.map((resultado) => (
              <TableRow key={resultado.ano}>
                <TableCell className="font-medium">{resultado.ano}</TableCell>
                <TableCell>{(resultado.aliquota_ibs * 100).toFixed(2)}%</TableCell>
                <TableCell>{(resultado.aliquota_cbs * 100).toFixed(2)}%</TableCell>
                <TableCell>{formatCurrency(resultado.preco_venda)}</TableCell>
                <TableCell>{formatCurrency(resultado.custo_maximo)}</TableCell>
                <TableCell>{formatPercent(resultado.margem_liquida)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SimuladorResultados;
