import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import CalculadoraForm from '@/components/calculadora/CalculadoraForm';
import CalculadoraResultados from '@/components/calculadora/CalculadoraResultados';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Calculadora = () => {
  const [loadingClassificar, setLoadingClassificar] = useState(false);
  const [loadingCalcular, setLoadingCalcular] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [classificacao, setClassificacao] = useState<any>(null);
  const [preco, setPreco] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClassificar = async (data: { descricao: string; ano: number }) => {
    setLoadingClassificar(true);
    setErro(null);
    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('calcular-tributos', {
        body: { modo: 'classificar', descricao: data.descricao, ano: data.ano },
      });

      if (funcError) throw new Error(funcError.message || 'Erro ao classificar');
      if (funcData?.error) throw new Error(funcData.error);

      toast({
        title: "Classificação realizada",
        description: `Código ${funcData.classificacao.tipo.toUpperCase()}: ${funcData.classificacao.codigo}`,
      });

      return funcData;
    } catch (e: any) {
      const msg = e?.message || 'Erro ao classificar produto';
      setErro(msg);
      toast({ title: "Erro na classificação", description: msg, variant: "destructive" });
      return null;
    } finally {
      setLoadingClassificar(false);
    }
  };

  const handleCalcular = async (data: {
    tipo: string;
    codigo: string;
    cst: string;
    cClassTrib: string;
    preco: number;
    uf: string;
    codigoUf: number;
    codigoMunicipio: number;
    ano: number;
  }) => {
    setLoadingCalcular(true);
    setErro(null);
    setResultado(null);
    setClassificacao(null);
    setPreco(data.preco);

    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('calcular-tributos', {
        body: { modo: 'calcular', ...data },
      });

      if (funcError) throw new Error(funcError.message || 'Erro ao calcular tributos');
      if (funcData?.error) throw new Error(funcData.error);

      setResultado(funcData.resultado);
      setClassificacao(funcData.classificacao);

      toast({
        title: "Cálculo realizado com sucesso",
        description: `Tributos calculados para ${data.tipo.toUpperCase()}: ${data.codigo}`,
      });
    } catch (e: any) {
      const msg = e?.message || 'Erro desconhecido ao calcular tributos';
      setErro(msg);
      toast({ title: "Erro no cálculo", description: msg, variant: "destructive" });
    } finally {
      setLoadingCalcular(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageHeader
        title="Calculadora da Reforma Tributária"
        description="Calcule automaticamente CBS, IBS e Imposto Seletivo usando a API oficial do governo. Informe a descrição do produto, classifique e calcule."
      />
      <main className="flex-grow container-custom py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <CalculadoraForm
            onClassificar={handleClassificar}
            onCalcular={handleCalcular}
            loadingClassificar={loadingClassificar}
            loadingCalcular={loadingCalcular}
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
