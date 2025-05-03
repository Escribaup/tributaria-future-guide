
import { supabase } from '@/integrations/supabase/client';
import { ResultadoSimulacao, AliquotaTransicao, CenarioSimulacao } from '@/types/simulador';

export const calcularResultadosSimulacao = (
  dados: {
    cenario: CenarioSimulacao,
    custos: {
      custo_compra: number,
      custo_frete: number,
      custo_armazenagem: number
    },
    impostos_atuais: {
      aliquota_icms: number,
      aliquota_iss: number,
      aliquota_pis: number,
      aliquota_cofins: number,
      preco_atual: number
    },
    margem_desejada: number
  },
  aliquotas: AliquotaTransicao[]
): {
  resultados: ResultadoSimulacao[],
  precosVenda: number[],
  custosMaximos: number[],
  margensLiquidas: number[]
} => {
  // Calcular os resultados da simulação
  const anoInicial = dados.cenario.ano_inicial || 2024;
  const anoFinal = dados.cenario.ano_final || 2032;
  const anos = aliquotas
    .filter(a => a.ano >= anoInicial && a.ano <= anoFinal)
    .map(a => a.ano);
    
  const custoTotal = dados.custos.custo_compra + 
    dados.custos.custo_frete + 
    dados.custos.custo_armazenagem;
    
  // Extração dos impostos atuais
  const impostoAtualTotal = dados.impostos_atuais.aliquota_icms + 
    dados.impostos_atuais.aliquota_iss + 
    dados.impostos_atuais.aliquota_pis + 
    dados.impostos_atuais.aliquota_cofins;
  
  // Para impostos "por dentro", a fórmula correta é: 
  // preço sem imposto = preço com imposto / (1 + taxa)
  const precoAtualComImpostos = dados.impostos_atuais.preco_atual;
  const precoAtualSemImpostos = precoAtualComImpostos / (1 + impostoAtualTotal);
  
  // Calcular lucro atual baseado na margem desejada
  const lucroAtual = precoAtualSemImpostos * (dados.margem_desejada / 100);
  
  // Taxa de redução do IBS (usando o valor informado ou padrão de 70%)
  // CORREÇÃO: aplicamos a redução apenas ao IBS, não ao CBS
  const reducaoIBS = dados.cenario.reducao_ibs !== undefined ? dados.cenario.reducao_ibs / 100 : 0.7;
  
  const resultadosCalc: ResultadoSimulacao[] = [];
  const precosVenda: number[] = [];
  const custosMaximos: number[] = [];
  const margensLiquidas: number[] = [];
  
  anos.forEach(ano => {
    const aliquota = aliquotas.find(a => a.ano === ano);
    if (!aliquota) return;
    
    const aliquotaIBS = aliquota.aliquota_ibs;
    const aliquotaCBS = aliquota.aliquota_cbs;
    
    // CORREÇÃO: Aplicar redução apenas na alíquota do IBS
    const aliquotaIBSEfetiva = aliquotaIBS * (1 - reducaoIBS);
    
    // CORREÇÃO: Alíquota efetiva total é a soma da alíquota IBS efetiva (reduzida) + CBS (sem redução)
    const aliquotaEfetivaTotal = aliquotaIBSEfetiva + aliquotaCBS;
    
    // Cenário 1: Manter preço final e lucro (necessário reduzir custo)
    // CORREÇÃO: Preço sem impostos futuro (considerando que o preço com impostos será o mesmo)
    const precoSemImpostosFuturo = precoAtualComImpostos / (1 + aliquotaEfetivaTotal);
    
    // Custo necessário para manter o preço final e o lucro atual
    const custoNecessario = precoSemImpostosFuturo - lucroAtual;
    
    // CORREÇÃO: Percentual de redução de custo necessário
    // Se for negativo, significa que não precisa reduzir custo
    const reducaoCustoPct = custoTotal > custoNecessario ? 
      ((custoTotal - custoNecessario) / custoTotal) * 100 : 0;
    
    // Cenário 2: Manter custo e lucro (necessário aumentar preço)
    // Preço sem impostos fixo (custo + lucro)
    const precoSemImpostosFixo = custoTotal + lucroAtual;
    
    // CORREÇÃO: Novo preço com impostos = preço sem impostos * (1 + alíquota efetiva total)
    const precoComImpostosNovo = precoSemImpostosFixo * (1 + aliquotaEfetivaTotal);
    
    // CORREÇÃO: Percentual de aumento no preço
    const aumentoPrecoPct = ((precoComImpostosNovo - precoAtualComImpostos) / precoAtualComImpostos) * 100;
    
    precosVenda.push(precoSemImpostosFuturo);
    custosMaximos.push(custoNecessario);
    margensLiquidas.push(dados.margem_desejada); // A margem desejada é mantida
    
    resultadosCalc.push({
      ano,
      aliquota_ibs: aliquotaIBS,
      aliquota_cbs: aliquotaCBS,
      aliquota_ibs_efetiva: aliquotaIBSEfetiva,
      aliquota_efetiva_total: aliquotaEfetivaTotal,
      
      // Valores atuais
      preco_com_impostos_atual: precoAtualComImpostos,
      preco_sem_impostos_atual: precoAtualSemImpostos,
      impostos_atuais: impostoAtualTotal,
      custo_atual: custoTotal,
      lucro_atual: lucroAtual,
      
      // Cenário 1: Manter preço final e lucro
      custo_necessario: custoNecessario,
      reducao_custo_pct: reducaoCustoPct,
      
      // Cenário 2: Manter custo e lucro
      preco_com_impostos_novo: precoComImpostosNovo,
      aumento_preco_pct: aumentoPrecoPct
    });
  });

  return {
    resultados: resultadosCalc,
    precosVenda,
    custosMaximos,
    margensLiquidas
  };
};

export const salvarSimulacao = async (
  userId: string | undefined,
  cenarioId: number,
  margem_desejada: number,
  precosVenda: number[],
  custosMaximos: number[],
  margensLiquidas: number[]
) => {
  if (!userId || cenarioId <= 0) return;
  
  return await supabase
    .from('simulacoes')
    .insert([{
      cenario_id: cenarioId,
      margem_desejada,
      preco_venda_ano: precosVenda,
      preco_compra_maximo: custosMaximos,
      margem_liquida_ano: margensLiquidas
    }]);
};

export const salvarCenario = async (
  cenario: CenarioSimulacao,
  userId: string | undefined
) => {
  if (!userId) return { data: { id: -1 }, error: null };
  
  return await supabase
    .from('cenarios')
    .insert([cenario])
    .select('id')
    .single();
};
