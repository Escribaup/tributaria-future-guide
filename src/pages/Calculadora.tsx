import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import CalculadoraForm from '@/components/calculadora/CalculadoraForm';
import CalculadoraResultados from '@/components/calculadora/CalculadoraResultados';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Calculadora = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [classificacao, setClassificacao] = useState<any>(null);
  const [preco, setPreco] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: {
    descricao: string;
    preco: number;
    uf: string;
    codigoUf: number;
    municipio: string;
    codigoMunicipio: number;
    ano: number;
  }) => {
    setLoading(true);
    setErro(null);
    setResultado(null);
    setClassificacao(null);
    setPreco(data.preco);

    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('calcular-tributos', {
        body: {
          descricao: data.descricao,
          preco: data.preco,
          uf: data.uf,
          codigoUf: data.codigoUf,
          municipio: data.municipio,
          codigoMunicipio: data.codigoMunicipio,
          ano: data.ano,
        },
      });

      if (funcError) {
        throw new Error(funcError.message || 'Erro ao calcular tributos');
      }

      if (funcData?.error) {
        throw new Error(funcData.error);
      }

      setResultado(funcData.resultado);
      setClassificacao(funcData.classificacao);

      toast({
        title: "Cálculo realizado com sucesso",
        description: `Tributos calculados para ${data.descricao}`,
      });
    } catch (e: any) {
      const msg = e?.message || 'Erro desconhecido ao calcular tributos';
      setErro(msg);
      toast({
        title: "Erro no cálculo",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageHeader
        title="Calculadora da Reforma Tributária"
        description="Calcule automaticamente CBS, IBS e Imposto Seletivo usando a API oficial do governo. Informe apenas a descrição do produto e o sistema classifica e calcula tudo."
      />
      <main className="flex-grow container-custom py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <CalculadoraForm
            onSubmit={handleSubmit}
            loading={loading}
            classificacao={classificacao}
          />
          <CalculadoraResultados
            resultado={resultado}
            classificacao={classificacao}
            preco={preco}
            erro={erro}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculadora;
