import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SimuladorForm from './SimuladorForm';
import SimuladorResultados from './SimuladorResultados';
import ProcessandoSimulacao from './ProcessandoSimulacao';
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
  const [processando, setProcessando] = useState(false);
  const [activeTab, setActiveTab] = useState('simulador');
  const [resultadosN8n, setResultadosN8n] = useState<any>(null);
  const [dadosEnviadosN8n, setDadosEnviadosN8n] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Função auxiliar para extrair dados da resposta do webhook n8n em diferentes formatos possíveis
  const extrairResultadosDaResposta = (response: any): ResultadoSimulacao[] => {
    console.log('Extraindo resultados da resposta com estrutura:', JSON.stringify(response, null, 2));
    
    if (!response) {
      console.warn('Resposta do webhook está vazia');
      return [];
    }
    
    // Verificar se a resposta é um array (caso mais simples)
    if (Array.isArray(response)) {
      console.log('Resposta já é um array com', response.length, 'elementos');
      return response;
    }
    
    // Caso: A resposta tem um campo 'simulacao' que é um array
    if (response.simulacao && Array.isArray(response.simulacao)) {
      console.log('Extraindo do campo .simulacao com', response.simulacao.length, 'elementos');
      return response.simulacao;
    }
    
    // Caso: A resposta tem um campo 'response' que é um array
    if (response.response && Array.isArray(response.response)) {
      console.log('Extraindo do campo .response com', response.response.length, 'elementos');
      return response.response;
    }
    
    // Caso: A resposta tem uma estrutura aninhada com .response[0].response como array
    if (response.response && 
        Array.isArray(response.response[0]?.response)) {
      console.log('Extraindo do campo .response[0].response com', response.response[0].response.length, 'elementos');
      return response.response[0].response;
    }
    
    // Caso: A resposta tem um campo data que é um array ou objeto
    if (response.data) {
      if (Array.isArray(response.data)) {
        console.log('Extraindo do campo .data (array) com', response.data.length, 'elementos');
        return response.data;
      } else if (response.data.simulacao && Array.isArray(response.data.simulacao)) {
        console.log('Extraindo do campo .data.simulacao com', response.data.simulacao.length, 'elementos');
        return response.data.simulacao;
      }
    }
    
    // Caso: A resposta tem um campo result ou results
    if (response.result && Array.isArray(response.result)) {
      console.log('Extraindo do campo .result com', response.result.length, 'elementos');
      return response.result;
    }
    
    if (response.results && Array.isArray(response.results)) {
      console.log('Extraindo do campo .results com', response.results.length, 'elementos');
      return response.results;
    }
    
    // Caso: A resposta é um objeto único e não um array
    if (typeof response === 'object' && response.ano !== undefined) {
      console.log('A resposta parece ser um único objeto de resultado. Convertendo para array.');
      return [response];
    }

    // NOVO: Busca recursiva por arrays de objetos com campo 'ano'
    const buscarArrayComAno = (obj: any): ResultadoSimulacao[] => {
      if (!obj || typeof obj !== 'object') return [];
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'ano' in val[0]) {
          console.log(`Extraindo de campo recursivo '${key}' com`, val.length, 'elementos');
          return val;
        } else if (typeof val === 'object') {
          const found = buscarArrayComAno(val);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    const encontrados = buscarArrayComAno(response);
    if (encontrados.length > 0) {
      return encontrados;
    }
    
    // Se chegamos até aqui, não conseguimos extrair de maneira conhecida
    console.warn('Formato de resposta não reconhecido:', response);
    return [];
  };

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
    setProcessando(true);
    setErro(null);
    
    try {
      // Salvar o cenário se for novo ou atualizar se já existir
      let cenarioId = dados.cenario.id;
      
      if (!cenarioId && userId) {
        const cenarioResponse = await salvarCenario(dados.cenario, userId);
        
        if (cenarioResponse.error) {
          console.error('Erro ao salvar cenário:', cenarioResponse.error);
          throw new Error('Erro ao salvar cenário');
        }
        
        if (cenarioResponse.data && cenarioResponse.data.id) {
          cenarioId = cenarioResponse.data.id;
          console.log('Cenário salvo com sucesso, ID:', cenarioId);
        } else {
          console.warn('Cenário salvo sem retornar ID');
        }
      }
      
      if (!cenarioId) {
        cenarioId = -1;
        console.log('Usando cenário temporário (ID: -1)');
      }
      
      // Enviar dados para o webhook do n8n e usar o resultado retornado
      try {
        console.log('Enviando dados para o webhook n8n...');
        
        toast({
          title: "Processando simulação",
          description: "Enviando dados para processamento. Por favor, aguarde...",
          duration: 5000,
        });
        
        // Enviar dados para o n8n e obter resultados
        const webhookResponse = await enviarDadosParaN8n(dados, aliquotas);
        console.log('Resposta do webhook n8n:', webhookResponse);
        
        if (webhookResponse && webhookResponse.success) {
          // Usar os resultados do n8n
          setDadosEnviadosN8n(webhookResponse.dadosEnviados);
          setResultadosN8n(webhookResponse.resultados);
          
          console.log('Dados enviados para processamento:', webhookResponse.dadosEnviados);
          console.log('Resultados recebidos:', JSON.stringify(webhookResponse.resultados, null, 2));
          
          // Extrair os resultados da simulação da resposta do webhook
          const simulacaoResults = extrairResultadosDaResposta(webhookResponse.resultados);
          
          console.log('Resultados extraídos para exibição:', simulacaoResults);
          setResultados(simulacaoResults);
          
          // Salvar no banco se o usuário estiver autenticado e o cenário for válido
          if (userId && cenarioId > 0) {
            console.log('Salvando simulação no banco de dados...');
            console.log('userId:', userId, 'cenarioId:', cenarioId);
            
            const saveResponse = await salvarSimulacao(
              userId, 
              cenarioId, 
              dados.margem_desejada, 
              [], // Não salvamos mais os preços calculados localmente
              [], // Não salvamos mais os custos calculados localmente
              [], // Não salvamos mais as margens calculadas localmente
              webhookResponse.dadosEnviados,
              webhookResponse.resultados
            );
            
            if (saveResponse?.error) {
              console.error('Erro ao salvar simulação:', saveResponse.error);
              toast({
                variant: "destructive",
                title: "Erro ao salvar simulação",
                description: "Os dados foram processados, mas não puderam ser salvos no histórico."
              });
            } else {
              console.log('Simulação salva com sucesso!', saveResponse);
              toast({
                title: "Dados salvos",
                description: "A simulação foi salva com sucesso no seu histórico.",
                duration: 3000,
              });
            }
          } else {
            console.warn('Usuário não autenticado ou cenário inválido, não salvando no banco');
            if (!userId) {
              toast({
                variant: "default",
                title: "Simulação sem salvar",
                description: "Faça login para salvar suas simulações no histórico.",
                duration: 5000,
              });
            }
          }
          
          // Mudar para a aba de resultados
          setActiveTab('resultados');
          
          toast({
            title: "Simulação concluída",
            description: "Os resultados da simulação foram calculados e estão disponíveis para visualização.",
            duration: 5000,
          });
        } else {
          throw new Error('O serviço externo retornou um erro ou resposta inválida.');
        }
      } catch (webhookError: any) {
        console.error('Erro ao enviar dados para o n8n:', webhookError);
        setErro(webhookError.message || 'Erro na comunicação com o serviço externo');
        toast({
          variant: "destructive",
          title: "Erro na simulação",
          description: "Não foi possível obter os resultados do serviço externo. Verifique sua conexão e tente novamente."
        });
      }
    } catch (error: any) {
      console.error('Erro global ao realizar simulação:', error);
      setErro(error.message || 'Ocorreu um erro ao processar os dados da simulação');
      toast({
        variant: "destructive",
        title: "Erro ao realizar simulação",
        description: "Ocorreu um erro ao processar os dados da simulação."
      });
    } finally {
      setSubmitting(false);
      setProcessando(false);
    }
  };
  
  const handleRetry = () => {
    if (dadosEnviadosN8n) {
      setActiveTab('simulador');
      setErro(null);
      // Não limpa os dados para permitir ajustes no formulário
    }
  };

  return (
    <div className="container-custom py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulador" disabled={processando}>Simulador</TabsTrigger>
          <TabsTrigger value="resultados" disabled={processando || !resultadosN8n}>
            Resultados
          </TabsTrigger>
        </TabsList>
        
        {processando ? (
          <ProcessandoSimulacao />
        ) : (
          <>
            <TabsContent value="simulador">
              <Card className="p-6">
                <SimuladorForm 
                  aliquotas={aliquotas}
                  cenarios={cenarios}
                  onSubmit={handleSubmitSimulacao}
                  loading={loading}
                  submitting={submitting}
                  error={erro}
                />
              </Card>
            </TabsContent>
            <TabsContent value="resultados">
              <Card className="p-6">
                <SimuladorResultados 
                  resultados={resultados}
                  resultadosN8n={resultadosN8n}
                  dadosEnviadosN8n={dadosEnviadosN8n}
                  onRetry={handleRetry}
                  erro={erro} 
                />
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default SimuladorContainer;
