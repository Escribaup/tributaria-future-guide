import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { usePlanoImplementacao } from '@/hooks/usePlanoImplementacao';
import KPIDashboard from '@/components/plano/KPIDashboard';
import PhaseCard from '@/components/plano/PhaseCard';
import PlanModal from '@/components/plano/PlanModal';

const PlanoImplementacao = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    plan, 
    isPlanLoading, 
    createPlan, 
    isCreatingPlan, 
    updateTask,
    isUpdatingTask 
  } = usePlanoImplementacao();

  const handleCreatePlan = (companyName: string) => {
    createPlan(companyName);
    setIsModalOpen(false);
  };

  const handleToggleTask = (taskId: string, isCompleted: boolean) => {
    updateTask({ taskId, isCompleted });
  };

  if (isPlanLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando plano de implementação...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        <PageHeader 
          title="Plano de Implementação"
          description="Gerencie a implementação da Reforma Tributária em sua empresa"
        />

        <section className="py-12 bg-background">
          <div className="container-custom">
            {!plan ? (
              // Estado vazio - sem plano criado
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">
                    Nenhum Plano Criado
                  </CardTitle>
                  <CardDescription>
                    Crie um plano de implementação da Reforma Tributária personalizado para sua empresa.
                    O plano inclui 6 fases estruturadas com tarefas detalhadas e acompanhamento de progresso.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-left space-y-2">
                    <p className="font-semibold">O plano inclui:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Diagnóstico e Planejamento</li>
                      <li>Capacitação e Treinamento</li>
                      <li>Adequação de Sistemas</li>
                      <li>Revisão de Processos</li>
                      <li>Simulação e Testes</li>
                      <li>Implementação e Go-Live</li>
                    </ul>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Criar Plano de Implementação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Estado com plano criado
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{plan.company_name}</h2>
                    <p className="text-muted-foreground text-sm">
                      Criado em {new Date(plan.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <KPIDashboard plan={plan} />

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Fases de Implementação</h3>
                  {plan.phases.map((phase, index) => (
                    <PhaseCard
                      key={phase.id}
                      phase={phase}
                      onToggleTask={handleToggleTask}
                      isUpdating={isUpdatingTask}
                      defaultOpen={phase.status === 'in-progress' || (index === 0 && phase.status === 'pending')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <PlanModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreatePlan={handleCreatePlan}
        isCreating={isCreatingPlan}
      />
    </div>
  );
};

export default PlanoImplementacao;
