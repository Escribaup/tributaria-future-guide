
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
  produto_id?: number;
  fornecedor_id?: number;
  uf_id?: number;
  ano_inicial?: number;
  ano_final?: number;
};

export type ResultadoSimulacao = {
  ano: number;
  aliquota_ibs: number;
  aliquota_cbs: number;
  preco_sem_imposto: number;  // Preço sem imposto
  custo_maximo: number;
  margem_liquida: number;
  impostos_atuais?: number;   // Valor dos impostos atuais
};
