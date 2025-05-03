
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import SimuladorContainer from '@/components/simulador/SimuladorContainer';
import { useSimuladorData } from '@/hooks/useSimuladorData';

const Simulador = () => {
  const { user } = useAuth();
  const { 
    produtos, 
    fornecedores, 
    ufs, 
    aliquotas, 
    cenarios, 
    loading 
  } = useSimuladorData(user?.id);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <PageHeader 
          title="Simulador da Reforma Tributária" 
          description="Simule os impactos da reforma tributária em seus preços e margens"
        />
        
        <SimuladorContainer 
          produtos={produtos}
          fornecedores={fornecedores}
          ufs={ufs}
          aliquotas={aliquotas}
          cenarios={cenarios}
          userId={user?.id}
          loading={loading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Simulador;
