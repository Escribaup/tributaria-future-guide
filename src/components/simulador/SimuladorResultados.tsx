import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface SimuladorResultadosProps {
  resultados: any;
  resultadosN8n?: any;
  dadosEnviadosN8n?: any;
  onRetry?: () => void;
  erro?: string | null;
}

interface ResultadoAno {
  ano: number;
  custo_atual: number;
  custo_necessario: number;
  reducao_custo_pct: number;
  preco_com_impostos_atual: number;
  preco_sem_impostos_atual: number;
  impostos_atuais: number;
  lucro_atual: number;
  preco_com_impostos_novo: number;
  aumento_preco_pct: number;
}

const formatCurrency = (valor: number | undefined) => {
  if (valor === undefined || valor === null || isNaN(valor)) return 'N/A';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatPercent = (valor: number | undefined) => {
  if (valor === undefined || valor === null || isNaN(valor)) return 'N/A';
  return `${valor.toFixed(2)}%`;
};

function extrairResultadosRelatorio(dados: any): ResultadoAno[] {
  if (!dados) return [];
  // Se vier como array de objetos com campo 'resultados'
  if (Array.isArray(dados) && dados.length > 0 && dados[0].resultados) {
    return dados[0].resultados;
  }
  // Se vier como array de objetos com campo 'response'
  if (Array.isArray(dados) && dados.length > 0 && dados[0].response) {
    let resp = dados[0].response;
    // Se for string, tentar fazer o parse
    if (typeof resp === 'string') {
      try {
        resp = JSON.parse(resp);
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(resp)) {
      return resp;
    }
  }
  // Se vier direto como array de resultados
  if (Array.isArray(dados) && dados[0].ano !== undefined) {
    return dados;
  }
  // Se vier como objeto com campo 'resultados'
  if (dados.resultados && Array.isArray(dados.resultados)) {
    return dados.resultados;
  }
  // Se vier como objeto com campo 'response'
  if (dados.response && Array.isArray(dados.response)) {
    return dados.response;
  }
  // Se vier como objeto com campo 'response' em string
  if (dados.response && typeof dados.response === 'string') {
    try {
      const arr = JSON.parse(dados.response);
      if (Array.isArray(arr)) return arr;
    } catch (e) { return []; }
  }
  return [];
}

const TabelaCenario: React.FC<{ titulo: string; dados: ResultadoAno[]; tipo: 'reducao' | 'preco'; }> = ({ titulo, dados, tipo }) => (
  <Card className="mb-8">
    <CardContent>
      <h3 className={`text-lg font-bold mb-4 text-center ${tipo === 'reducao' ? 'text-blue-700' : 'text-amber-700'}`}>{titulo}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ano</TableHead>
              <TableHead>Preço com Impostos</TableHead>
              <TableHead>Impostos</TableHead>
              <TableHead>Preço sem Impostos</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Lucro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map((r) => {
              const precoComImpostos = tipo === 'reducao' ? r.preco_com_impostos_atual : r.preco_com_impostos_novo;
              const impostosValor = precoComImpostos - r.preco_sem_impostos_atual;
              return (
                <TableRow key={r.ano}>
                  <TableCell>{r.ano}</TableCell>
                  <TableCell>{formatCurrency(precoComImpostos)}</TableCell>
                  <TableCell>{formatCurrency(impostosValor)}</TableCell>
                  <TableCell>{formatCurrency(r.preco_sem_impostos_atual)}</TableCell>
                  <TableCell>{
                    tipo === 'reducao'
                      ? formatCurrency(r.custo_necessario)
                      : formatCurrency(r.custo_atual)
                  }</TableCell>
                  <TableCell>{formatCurrency(r.lucro_atual)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const SimuladorResultados: React.FC<SimuladorResultadosProps> = ({ resultados, resultadosN8n, erro }) => {
  // Prioriza resultadosN8n se existir
  const dados = resultadosN8n || resultados;
  const resultadosRelatorio = extrairResultadosRelatorio(dados);

  if (erro) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <span className="text-red-500 text-2xl font-bold">Erro na simulação</span>
          <p className="text-gray-500 max-w-md">{erro}</p>
        </div>
      </div>
    );
  }

  if (!resultadosRelatorio || resultadosRelatorio.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nenhum resultado disponível. Realize uma simulação para ver os resultados.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pt-6 pb-2">
        <h2 className="text-2xl font-bold text-center mb-2">Resumo dos Ajustes Necessários</h2>
      </div>
      <TabelaCenario
        titulo="Cenário 1: Redução de Custos (para manter o mesmo preço final e lucro)"
        dados={resultadosRelatorio}
        tipo="reducao"
      />
      <TabelaCenario
        titulo="Cenário 2: Reajuste de Preço (para manter o mesmo custo e lucro)"
        dados={resultadosRelatorio}
        tipo="preco"
      />
    </div>
  );
};

export default SimuladorResultados;
