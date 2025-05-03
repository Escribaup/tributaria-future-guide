
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SimuladorForm from './SimuladorForm';
import SimuladorResultados from './SimuladorResultados';
import { 
  calcularResultadosSimulacao,
  salvarCenario, 
  salvarSimulacao 
} from '@/services/simuladorService';
import { 
  Produto, 
  Fornecedor, 
  UF, 
  AliquotaTransicao, 
  CenarioSimulacao, 
  ResultadoSimulacao 
} from '@/types/simulador';

interface SimuladorContainerProps {
  produtos: Produto[];
  fornecedores: Fornecedor[];
  ufs: UF[];
  aliquotas: AliquotaTransicao[];
  cenarios: CenarioSimulacao[];
  userId?: string;
  loading: boolean;
}

const SimuladorContainer: React.FC<SimuladorContainerProps> = ({
  produtos,
  fornecedores,
  ufs,
  aliquotas,
  cenarios,
  userId,
  loading
}) => {
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('simulador');

  const handleSubmitSimulacao = async (dados: {
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
      
      if (!cenarioId && userId) {
        const { data, error } = await salvarCenario(dados.cenario, userId);
        
        if (error) throw error;
        cenarioId = data.id;
      }
      
      if (!cenarioId) {
        cenarioId = -1;
      }
      
      const { 
        resultados: resultadosCalc, 
        precosVenda, 
        custosMaximos, 
        margensLiquidas 
      } = calcularResultadosSimulacao(dados, aliquotas);
      
      // Se o usuário estiver autenticado, salvamos a simulação no banco
      if (userId && cenarioId > 0) {
        await salvarSimulacao(
          userId, 
          cenarioId, 
          dados.margem_desejada, 
          precosVenda, 
          custosMaximos, 
          margensLiquidas
        );
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
  );
};

export default SimuladorContainer;
