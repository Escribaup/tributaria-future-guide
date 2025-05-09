
export type Produto = {
  id: number;
  nome: string;
  gtin: string;
  categoria?: string;
  perfil_fornecedor?: string;
};

export type Fornecedor = {
  id: number;
  nome: string;
  perfil?: string;
  uf_id?: number;
};

export type UF = {
  id: number;
  sigla: string;
  nome: string;
};

export type AliquotaTransicao = {
  id: number;
  ano: number;
  aliquota_ibs: number;
  aliquota_cbs: number;
};

export type CenarioSimulacao = {
  id?: number;
  nome: string;
  descricao?: string;
  ano_inicial?: number;
  ano_final?: number;
  reducao_ibs?: number; // Percentual de redução do IBS ou CBS
};

export type ResultadoSimulacao = {
  ano: number;
  aliquota_ibs: number;
  aliquota_cbs: number;
  aliquota_ibs_efetiva: number; // Alíquota IBS após aplicar redução
  aliquota_cbs_efetiva: number; // Alíquota CBS após aplicar redução (quando IBS é 0%)
  aliquota_efetiva_total: number; // Soma das alíquotas efetivas (IBS+CBS)
  
  // Valores atuais
  preco_com_impostos_atual: number;  // Preço com impostos atual
  preco_sem_impostos_atual: number;  // Preço sem impostos atual
  impostos_atuais: number;           // Taxa total dos impostos atuais
  custo_atual: number;               // Custo atual
  lucro_atual: number;               // Lucro atual
  
  // Cenário 1: Manter preço final e lucro (necessário reduzir custo)
  custo_necessario: number;          // Custo necessário para manter preço e lucro
  reducao_custo_pct: number;         // Percentual de redução de custo necessário
  
  // Cenário 2: Manter custo e lucro (necessário aumentar preço)
  preco_com_impostos_novo: number;   // Novo preço com impostos (IVA) 
  aumento_preco_pct: number;         // Percentual de aumento no preço
};

export type ResultadoWebhookN8n = {
  dadosEnviados: any;  // Dados enviados para o webhook
  resultados: any;     // Resultados retornados pelo webhook
  success: boolean;    // Indica se a operação foi bem-sucedida
};
