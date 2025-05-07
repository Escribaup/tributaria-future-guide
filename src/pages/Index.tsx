
import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Timeline from '@/components/home/Timeline';
import CallToAction from '@/components/home/CallToAction';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useSimuladorData } from '@/hooks/useSimuladorData';
import { enviarDadosParaN8n } from '@/services/simuladorService';

const Index = () => {
  const { aliquotas, loading } = useSimuladorData(undefined);
  const [enviandoDados, setEnviandoDados] = React.useState(false);

  // Função para testar o webhook com dados de exemplo
  const testarWebhook = async () => {
    if (loading || !aliquotas || aliquotas.length === 0) {
      toast({
        variant: "destructive",
        title: "Dados insuficientes",
        description: "Aguarde o carregamento das alíquotas para testar o webhook."
      });
      return;
    }

    setEnviandoDados(true);
    try {
      // Dados de exemplo para teste
      const dadosTeste = {
        cenario: {
          nome: "Teste Webhook",
          descricao: "Simulação para teste do webhook",
          ano_inicial: 2026,
          ano_final: 2033,
          reducao_ibs: 70
        },
        custos: {
          custo_compra: 100,
          custo_frete: 10,
          custo_armazenagem: 5
        },
        impostos_atuais: {
          aliquota_icms: 0.18,
          aliquota_iss: 0.05,
          aliquota_pis: 0.0165,
          aliquota_cofins: 0.076,
          preco_atual: 200
        },
        margem_desejada: 30
      };

      await enviarDadosParaN8n(dadosTeste, aliquotas);

      toast({
        title: "Teste realizado com sucesso",
        description: "Os dados de teste foram enviados para o webhook do n8n."
      });
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        variant: "destructive",
        title: "Erro no teste",
        description: "Não foi possível enviar os dados para o webhook. Verifique o console para mais detalhes."
      });
    } finally {
      setEnviandoDados(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 md:pt-16"> {/* Adjusted padding for mobile */}
        <Hero />
        <Features />
        <Timeline />
        <CallToAction />
        
        {/* Botão de teste do webhook - Visível apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="container mx-auto my-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Área de Desenvolvimento</h3>
            <Button 
              onClick={testarWebhook} 
              disabled={loading || enviandoDados}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {enviandoDados ? "Enviando..." : "Testar Webhook do n8n"}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
