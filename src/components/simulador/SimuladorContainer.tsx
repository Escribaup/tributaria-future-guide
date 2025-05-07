
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SimuladorForm from './SimuladorForm';
import SimuladorResultados from './SimuladorResultados';
import { 
  calcularResultadosSimulacao,
  salvarCenario, 
  salvarSimulacao,
  enviarDadosParaN8n
} from '@/services/simuladorService';
import { 
  AliquotaTransicao, 
  CenarioSimulacao, 
  ResultadoSimulacao 
} from '@/types/simulador';

interface SimuladorContainerProps {
  aliquotas: AliquotaTransicao[];
  cenarios: CenarioSimulacao[];
  userId?: string;
  loading: boolean;
}

const SimuladorContainer: React.FC<SimuladorContainerProps> = ({
  aliquotas,
  cenarios,
  userId,
  loading
}) => {
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('simulador');
  const [resultadosN8n, setResultadosN8n] = useState<any>(null);
  const [dadosEnviadosN8n, setDadosEnviadosN8n] = useState<any>(null);

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
      
      // Enviar dados para o webhook do n8n
      let dadosWebhook = null;
      let resultadosWebhook = null;
      
      try {
        const webhookResponse = await enviarDadosParaN8n(dados, aliquotas);
        console.log('Resposta do webhook n8n:', webhookResponse);
        
        if (webhookResponse.success) {
          dadosWebhook = webhookResponse.dadosEnviados;
          resultadosWebhook = webhookResponse.resultados;
          
          setDadosEnviadosN8n(dadosWebhook);
          setResultadosN8n(resultadosWebhook);
        }
      } catch (webhookError) {
        console.error('Erro ao enviar dados para o n8n:', webhookError);
        toast({
          variant: "warning",
          title: "Alerta",
          description: "Os cálculos foram realizados, mas houve um problema ao comunicar com o serviço externo."
        });
      }
      
      // Se o usuário estiver autenticado, salvamos a simulação no banco
      if (userId && cenarioId > 0) {
        await salvarSimulacao(
          userId, 
          cenarioId, 
          dados.margem_desejada, 
          precosVenda, 
          custosMaximos, 
          margensLiquidas,
          dadosWebhook,
          resultadosWebhook
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
            <SimuladorResultados 
              resultados={resultados}
              resultadosN8n={resultadosN8n}
              dadosEnviadosN8n={dadosEnviadosN8n} 
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimuladorContainer;
