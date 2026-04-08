import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangleIcon, CheckCircle2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TributoDetalhe {
  aliquota: number;
  valor: number;
  reducao?: {
    pRedAliq?: number;
    pAliqEfetiva?: number;
  } | null;
}

interface ResultadoCalculo {
  baseCalculo: number;
  cbs: TributoDetalhe;
  ibsUf: TributoDetalhe;
  ibsMun: TributoDetalhe;
  ibsTotal: number;
  is: { aliquota: number; valor: number } | null;
}

interface Classificacao {
  tipo: string;
  codigo: string;
  cst: string;
  cClassTrib: string;
  descricao_ncm_nbs?: any;
}

interface CalculadoraResultadosProps {
  resultado: ResultadoCalculo | null;
  classificacao: Classificacao | null;
  preco: number;
  erro?: string | null;
}

const formatCurrency = (valor: number | undefined) => {
  if (valor === undefined || valor === null || isNaN(valor)) return 'R$ 0,00';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatPercent = (valor: number | undefined) => {
  if (valor === undefined || valor === null || isNaN(valor)) return '0,00%';
  return `${(valor * 100).toFixed(2)}%`;
};

const formatPercentDirect = (valor: number | undefined) => {
  if (valor === undefined || valor === null || isNaN(valor)) return '0,00%';
  return `${valor.toFixed(2)}%`;
};

const CalculadoraResultados: React.FC<CalculadoraResultadosProps> = ({ resultado, classificacao, preco, erro }) => {
  if (erro) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertTriangleIcon className="w-12 h-12 text-destructive" />
            <h3 className="text-xl font-bold text-destructive">Erro no Cálculo</h3>
            <p className="text-muted-foreground max-w-md">{erro}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!resultado) return null;

  const totalTributos = (resultado.cbs.valor || 0) + (resultado.ibsUf.valor || 0) + (resultado.ibsMun.valor || 0) + (resultado.is?.valor || 0);
  const precoSemTributos = preco - totalTributos;
  const cargaTributariaPercent = preco > 0 ? (totalTributos / preco) * 100 : 0;

  const tributos = [
    {
      nome: 'CBS (Contribuição sobre Bens e Serviços)',
      sigla: 'CBS',
      ...resultado.cbs,
      cor: 'bg-blue-500',
    },
    {
      nome: 'IBS Estadual',
      sigla: 'IBS UF',
      ...resultado.ibsUf,
      cor: 'bg-emerald-500',
    },
    {
      nome: 'IBS Municipal',
      sigla: 'IBS Mun',
      ...resultado.ibsMun,
      cor: 'bg-amber-500',
    },
  ];

  if (resultado.is) {
    tributos.push({
      nome: 'Imposto Seletivo',
      sigla: 'IS',
      aliquota: resultado.is.aliquota,
      valor: resultado.is.valor,
      reducao: null,
      cor: 'bg-red-500',
    });
  }

  return (
    <div className="space-y-6">
      {/* Classificação */}
      {classificacao && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-foreground">Classificação Fiscal Identificada</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="text-sm">
                {classificacao.tipo.toUpperCase()}: {classificacao.codigo}
              </Badge>
              <Badge variant="outline" className="text-sm">CST: {classificacao.cst}</Badge>
              <Badge variant="outline" className="text-sm">cClassTrib: {classificacao.cClassTrib}</Badge>
              {classificacao.descricao_ncm_nbs?.tributadoPeloImpostoSeletivo && (
                <Badge variant="destructive" className="text-sm">Sujeito ao IS</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-secondary/30">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Preço de Venda</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(preco)}</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total de Tributos</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalTributos)}</p>
            <p className="text-sm text-muted-foreground">{cargaTributariaPercent.toFixed(2)}% do preço</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/30">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Preço sem Tributos</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(precoSemTributos)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-foreground mb-4 text-center">Detalhamento dos Tributos</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tributo</TableHead>
                  <TableHead className="text-right">Alíquota</TableHead>
                  <TableHead className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 ml-auto">
                          Redução <Info className="w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Percentual de redução aplicado à alíquota conforme classificação tributária
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right">Alíquota Efetiva</TableHead>
                  <TableHead className="text-right">Base de Cálculo</TableHead>
                  <TableHead className="text-right">Valor do Tributo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tributos.map((t) => {
                  const reducaoPct = t.reducao?.pRedAliq || 0;
                  const aliquotaEfetiva = reducaoPct > 0
                    ? t.aliquota * (1 - reducaoPct)
                    : t.reducao?.pAliqEfetiva || t.aliquota;

                  return (
                    <TableRow key={t.sigla}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${t.cor}`} />
                          <div>
                            <span className="font-medium">{t.sigla}</span>
                            <span className="text-xs text-muted-foreground ml-1 hidden md:inline">
                              ({t.nome})
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatPercent(t.aliquota)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {reducaoPct > 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            -{formatPercentDirect(reducaoPct * 100)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatPercent(aliquotaEfetiva)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(resultado.baseCalculo)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatCurrency(t.valor)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* IBS Total */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={5}>IBS Total (UF + Municipal)</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(resultado.ibsTotal)}</TableCell>
                </TableRow>
                {/* Grand Total */}
                <TableRow className="bg-primary/5 font-bold text-lg">
                  <TableCell colSpan={5}>Total de Tributos</TableCell>
                  <TableCell className="text-right font-mono text-destructive">{formatCurrency(totalTributos)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculadoraResultados;
