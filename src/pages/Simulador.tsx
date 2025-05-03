
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import SimuladorForm from '@/components/simulador/SimuladorForm';
import SimuladorResultados from '@/components/simulador/SimuladorResultados';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

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
  preco_venda: number;
  custo_maximo: number;
  margem_liquida: number;
};

const Simulador = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [ufs, setUFs] = useState<UF[]>([]);
  const [aliquotas, setAliquotas] = useState<AliquotaTransicao[]>([]);
  const [cenarios, setCenarios] = useState<CenarioSimulacao[]>([]);
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('simulador');
  
  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const [produtosRes, fornecedoresRes, ufsRes, aliquotasRes, cenariosRes] = await Promise.all([
          supabase.from('produtos').select('*'),
          supabase.from('fornecedores').select('*'),
          supabase.from('ufs').select('*'),
          supabase.from('aliquotas_transicao').select('*').order('ano'),
          user ? supabase.from('cenarios').select('*') : { data: [] }
        ]);
        
        setProdutos(produtosRes.data || []);
        setFornecedores(fornecedoresRes.data || []);
        setUFs(ufsRes.data || []);
        setAliquotas(aliquotasRes.data || []);
        setCenarios(cenariosRes.data || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações necessárias para o simulador."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, [user]);
  
  const handleSubmitSimulacao = async (dados: {
    cenario: CenarioSimulacao,
    custos: {
      custo_compra: number,
      custo_frete: number,
      custo_armazenagem: number
    },
    margem_desejada: number
  }) => {
    if (!aliquotas || aliquotas.length === 0) {
      toast({
        variant: "destructive",
        title: "Dados insuficientes",
        description: "Não foi possível obter as alíquotas de transição para realizar a simulação."
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Salvar o cenário se for novo ou atualizar se já existir
      let cenarioId = dados.cenario.id;
      
      if (!cenarioId && user) {
        const { data, error } = await supabase
          .from('cenarios')
          .insert([dados.cenario])
          .select('id')
          .single();
          
        if (error) throw error;
        cenarioId = data.id;
      }
      
      if (!cenarioId) {
        // Se não temos um cenário salvo, usamos um ID temporário para a simulação
        cenarioId = -1;
      }
      
      // Calcular os resultados da simulação
      const anoInicial = dados.cenario.ano_inicial || 2024;
      const anoFinal = dados.cenario.ano_final || 2032;
      const anos = aliquotas
        .filter(a => a.ano >= anoInicial && a.ano <= anoFinal)
        .map(a => a.ano);
        
      const custoTotal = dados.custos.custo_compra + 
        dados.custos.custo_frete + 
        dados.custos.custo_armazenagem;
        
      const resultadosCalc: ResultadoSimulacao[] = [];
      const precosVenda: number[] = [];
      const custosMaximos: number[] = [];
      const margensLiquidas: number[] = [];
      
      anos.forEach(ano => {
        const aliquota = aliquotas.find(a => a.ano === ano);
        if (!aliquota) return;
        
        const aliquotaIBS = aliquota.aliquota_ibs;
        const aliquotaCBS = aliquota.aliquota_cbs;
        
        // Cálculos conforme a lógica fornecida
        const precoVenda = custoTotal / (1 - dados.margem_desejada/100) / (1 - aliquotaIBS - aliquotaCBS);
        const custoMaximo = precoVenda * (1 - aliquotaIBS - aliquotaCBS) * (1 - dados.margem_desejada/100);
        const margemLiquida = (precoVenda - custoTotal * (1 + aliquotaIBS + aliquotaCBS)) / precoVenda * 100;
        
        precosVenda.push(precoVenda);
        custosMaximos.push(custoMaximo);
        margensLiquidas.push(margemLiquida);
        
        resultadosCalc.push({
          ano,
          aliquota_ibs: aliquotaIBS,
          aliquota_cbs: aliquotaCBS,
          preco_venda: precoVenda,
          custo_maximo: custoMaximo,
          margem_liquida: margemLiquida
        });
      });
      
      // Se o usuário estiver autenticado, salvamos a simulação no banco
      if (user && cenarioId > 0) {
        await supabase
          .from('simulacoes')
          .insert([{
            cenario_id: cenarioId,
            margem_desejada: dados.margem_desejada,
            preco_venda_ano: precosVenda,
            preco_compra_maximo: custosMaximos,
            margem_liquida_ano: margensLiquidas
          }]);
      }
      
      setResultados(resultadosCalc);
      setActiveTab('resultados');
      
      toast({
        title: "Simulação realizada com sucesso",
        description: "Os resultados da simulação foram calculados e estão disponíveis para visualização."
      });
    } catch (error) {
      console.error('Erro ao realizar simulação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao realizar simulação",
        description: "Ocorreu um erro ao processar os dados da simulação."
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PageHeader 
          title="Simulador da Reforma Tributária" 
          description="Simule os impactos da reforma tributária para sua empresa"
        />
        
        <div className="container-custom py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simulador">Simulador</TabsTrigger>
              <TabsTrigger value="resultados" disabled={resultados.length === 0}>
                Resultados
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simulador">
              <Card className="p-6">
                <SimuladorForm 
                  produtos={produtos}
                  fornecedores={fornecedores}
                  ufs={ufs}
                  aliquotas={aliquotas}
                  cenarios={cenarios}
                  onSubmit={handleSubmitSimulacao}
                  loading={loading}
                  submitting={submitting}
                />
              </Card>
            </TabsContent>
            <TabsContent value="resultados">
              <Card className="p-6">
                <SimuladorResultados resultados={resultados} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Simulador;
