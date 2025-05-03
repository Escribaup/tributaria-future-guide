
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
  
  // CORREÇÃO: Para impostos "por dentro", a fórmula correta é: 
  // preço sem imposto = preço com imposto / (1 + taxa) -> ERRADO!
  // 
  // A fórmula correta é:
  // preço sem imposto = preço com imposto * (1 - taxa) -> ERRADO!
  //
  // A fórmula realmente correta para "por dentro" é:
  // preço sem imposto = preço com imposto / (1 + taxa) -> para impostos "por fora"
  // preço sem imposto = preço com imposto * (1 - taxa) -> ERRADO!
  //
  // Para impostos "por dentro":
  // preço com imposto = preço sem imposto / (1 - taxa)
  // preço sem imposto = preço com imposto * (1 - taxa)
  
  // No caso do Brasil, os impostos são calculados "por dentro", ou seja:
  // O imposto faz parte do preço do produto
  // Então, para obter o preço sem imposto a partir do preço com imposto:
  const precoAtualSemImpostos = dados.impostos_atuais.preco_atual * (1 - impostoAtualTotal);
  
  const resultadosCalc: ResultadoSimulacao[] = [];
  const precosVenda: number[] = [];
  const custosMaximos: number[] = [];
  const margensLiquidas: number[] = [];
  
  anos.forEach(ano => {
    const aliquota = aliquotas.find(a => a.ano === ano);
    if (!aliquota) return;
    
    const aliquotaIBS = aliquota.aliquota_ibs;
    const aliquotaCBS = aliquota.aliquota_cbs;
    const aliquotaTotal = aliquotaIBS + aliquotaCBS;
    
    // Preço sem imposto mantém-se o mesmo
    const precoSemImposto = precoAtualSemImpostos;
    
    // Custo máximo é calculado como uma percentagem do preço sem imposto
    // Se a margem desejada é de 30%, então o custo máximo é 70% do preço sem imposto
    const custoMaximo = precoSemImposto * (1 - dados.margem_desejada/100); 
    
    // Margem líquida real baseada no custo total versus o preço sem imposto
    const margemLiquida = ((precoSemImposto - custoTotal) / precoSemImposto) * 100;
    
    precosVenda.push(precoSemImposto);
    custosMaximos.push(custoMaximo);
    margensLiquidas.push(margemLiquida);
    
    resultadosCalc.push({
      ano,
      aliquota_ibs: aliquotaIBS,
      aliquota_cbs: aliquotaCBS,
      preco_sem_imposto: precoSemImposto,
      custo_maximo: custoMaximo,
      margem_liquida: margemLiquida,
      impostos_atuais: impostoAtualTotal
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
