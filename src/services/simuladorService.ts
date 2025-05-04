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
  // Valores padrão atualizados conforme exemplo fornecido (21,25%)
  const aliquotaICMS = dados.impostos_atuais.aliquota_icms || 0.12; // 12%
  const aliquotaISS = dados.impostos_atuais.aliquota_iss || 0;
  const aliquotaPIS = dados.impostos_atuais.aliquota_pis || 0.0165; // 1.65%
  const aliquotaCOFINS = dados.impostos_atuais.aliquota_cofins || 0.076; // 7.6%
  
  const impostoAtualTotal = aliquotaICMS + aliquotaISS + aliquotaPIS + aliquotaCOFINS;
  
  // Para impostos "por dentro", a fórmula correta é: 
  // preço sem imposto = preço com imposto / (1 + taxa)
  const precoAtualComImpostos = dados.impostos_atuais.preco_atual;
  const precoAtualSemImpostos = precoAtualComImpostos / (1 + impostoAtualTotal);
  
  // Calcular lucro atual baseado na margem desejada
  const lucroAtual = precoAtualSemImpostos * (dados.margem_desejada / 100);
  
  // Taxa de redução do IVA (usando o valor informado ou padrão de 70%)
  const reducaoIVA = dados.cenario.reducao_ibs !== undefined ? dados.cenario.reducao_ibs / 100 : 0.7;
  
  const resultadosCalc: ResultadoSimulacao[] = [];
  const precosVenda: number[] = [];
  const custosMaximos: number[] = [];
  const margensLiquidas: number[] = [];
  
  anos.forEach(ano => {
    const aliquota = aliquotas.find(a => a.ano === ano);
    if (!aliquota) return;
    
    // Valores atualizados para IBS e CBS conforme o exemplo (26,50% total)
    // Se estiver no supabase, usamos os valores do banco, caso contrário, usamos valores padrão
    const aliquotaIBS = aliquota.aliquota_ibs || 0.177; // 17,7%
    const aliquotaCBS = aliquota.aliquota_cbs || 0.088; // 8,8%
    const aliquotaIVA = aliquotaIBS + aliquotaCBS;
    
    // IMPLEMENTAÇÃO DO ALGORITMO FORNECIDO:
    // 1. Soma das alíquotas vigentes - já calculada como impostoAtualTotal
    
    // 2. Preço "sem impostos" originais - já calculada como precoAtualSemImpostos
    
    // 3. Alíquota efetiva de IVA após redução/isenção
    const aliquotaIVAEfetiva = aliquotaIVA * (1 - reducaoIVA);
    
    // 4. Novo preço com IVA "por fora"
    const precoComNovoIVA = precoAtualSemImpostos * (1 + aliquotaIVAEfetiva);
    
    // Cenário 1: Manter preço final e lucro (necessário reduzir custo)
    // Se queremos manter o preço final igual ao atual, precisamos calcular o custo necessário
    // Partindo do preço com impostos atual, calculamos o preço sem impostos futuro
    // usando o mesmo valor de preço com impostos mas dividindo pela nova taxa IVA efetiva
    const precoSemImpostosFuturo = precoAtualComImpostos / (1 + aliquotaIVAEfetiva);
    const custoNecessario = precoSemImpostosFuturo - lucroAtual;
    
    // Percentual de redução de custo necessário
    // Se for negativo, significa que não precisa reduzir custo
    const reducaoCustoPct = custoTotal > custoNecessario ? 
      ((custoTotal - custoNecessario) / custoTotal) * 100 : 0;
    
    // Cenário 2: Manter custo e lucro (necessário aumentar preço)
    // Preço sem impostos fixo (custo + lucro)
    const precoSemImpostosFixo = custoTotal + lucroAtual;
    
    // Novo preço com impostos = preço sem impostos * (1 + alíquota efetiva)
    const precoComImpostosNovo = precoSemImpostosFixo * (1 + aliquotaIVAEfetiva);
    
    // Percentual de aumento no preço
    const aumentoPrecoPct = ((precoComImpostosNovo - precoAtualComImpostos) / precoAtualComImpostos) * 100;
    
    precosVenda.push(precoSemImpostosFuturo);
    custosMaximos.push(custoNecessario);
    margensLiquidas.push(dados.margem_desejada); // A margem desejada é mantida
    
    resultadosCalc.push({
      ano,
      aliquota_ibs: aliquotaIBS,
      aliquota_cbs: aliquotaCBS,
      aliquota_ibs_efetiva: aliquotaIVAEfetiva, // Renomeada, mas agora é a alíquota total efetiva
      aliquota_efetiva_total: aliquotaIVAEfetiva, // Mantida para compatibilidade
      
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
