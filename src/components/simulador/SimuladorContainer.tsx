
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SimuladorForm from './SimuladorForm';
import SimuladorResultados from './SimuladorResultados';
import { 
  salvarCenario, 
  salvarSimulacao,
  enviarDadosParaN8n
} from '@/services/simuladorService';
import { 
  AliquotaTransicao, 
  CenarioSimulacao, 
  ResultadoSimulacao, 
  ResultadoWebhookN8n
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
      
      // Enviar dados para o webhook do n8n e usar o resultado retornado
      let webhookResponse: ResultadoWebhookN8n | null = null;
      
      try {
        // Enviar dados para o n8n e obter resultados
        webhookResponse = await enviarDadosParaN8n(dados, aliquotas);
        console.log('Resposta do webhook n8n:', webhookResponse);
        
        if (webhookResponse.success) {
          // Usar os resultados do n8n
          setDadosEnviadosN8n(webhookResponse.dadosEnviados);
          setResultadosN8n(webhookResponse.resultados);
          
          // Se houver um formato específico nos resultados do n8n que corresponde ao ResultadoSimulacao, 
          // usamos isso para exibição. Caso contrário, dependeremos apenas da interface de exibição do resultadosN8n
          if (Array.isArray(webhookResponse.resultados?.simulacao)) {
            setResultados(webhookResponse.resultados.simulacao);
          } else {
            // Se não houver um array de simulação específico, passamos um array vazio para garantir que a interface
            // se concentre em exibir os resultados do n8n diretamente
            setResultados([]);
          }
          
          // Salvar no banco se o usuário estiver autenticado e o cenário for válido
          if (userId && cenarioId > 0) {
            await salvarSimulacao(
              userId, 
              cenarioId, 
              dados.margem_desejada, 
              [], // Não salvamos mais os preços calculados localmente
              [], // Não salvamos mais os custos calculados localmente
              [], // Não salvamos mais as margens calculadas localmente
              webhookResponse.dadosEnviados,
              webhookResponse.resultados
            );
          }
          
          setActiveTab('resultados');
          
          toast({
            title: "Simulação realizada com sucesso",
            description: "Os resultados da simulação foram calculados pelo serviço externo e estão disponíveis para visualização."
          });
        } else {
          throw new Error('O serviço externo retornou um erro.');
        }
      } catch (webhookError) {
        console.error('Erro ao enviar dados para o n8n:', webhookError);
        toast({
          variant: "default", // Corrigido de "warning" para "default"
          title: "Alerta",
          description: "Não foi possível obter os resultados do serviço externo. Verifique sua conexão e tente novamente."
        });
        throw webhookError; // Repropagamos o erro para interromper o fluxo
      }
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
          <TabsTrigger value="resultados" disabled={!resultadosN8n}>
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
