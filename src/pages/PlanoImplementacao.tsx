import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Loader2, Calendar } from 'lucide-react';
import { usePlanoImplementacao } from '@/hooks/usePlanoImplementacao';
import { ImplementationTask, ImplementationCheckpoint, PhaseWithProgress, ImplementationPhase } from '@/types/plano';
import KPIDashboard from '@/components/plano/KPIDashboard';
import PhaseCard from '@/components/plano/PhaseCard';
import PlanModal from '@/components/plano/PlanModal';
import TimelineView from '@/components/plano/TimelineView';
import TaskDetailModal from '@/components/plano/TaskDetailModal';
import CheckpointUpdateModal from '@/components/plano/CheckpointUpdateModal';
import PhaseEditModal from '@/components/plano/PhaseEditModal';
import TaskCreateModal from '@/components/plano/TaskCreateModal';

const PlanoImplementacao = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ImplementationTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<ImplementationCheckpoint | null>(null);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<PhaseWithProgress | null>(null);
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
  const [selectedPhaseIdForTask, setSelectedPhaseIdForTask] = useState<string | null>(null);
  
  const { 
    plan, 
    isPlanLoading, 
    createPlan, 
    isCreatingPlan, 
    updateTask,
    isUpdatingTask,
    updateTaskDetails,
    isUpdatingTaskDetails,
    updateCheckpoint,
    isUpdatingCheckpoint,
    createPhase,
    isCreatingPhase,
    updatePhase,
    isUpdatingPhase,
    deletePhase,
    isDeletingPhase,
    createTask,
    isCreatingTask,
    deleteTask,
    isDeletingTask,
    updateTaskPriority,
    isUpdatingTaskPriority
  } = usePlanoImplementacao();

  const handleCreatePlan = (companyName: string) => {
    createPlan(companyName);
    setIsModalOpen(false);
  };

  const handleToggleTask = (taskId: string, isCompleted: boolean) => {
    updateTask({ taskId, isCompleted });
  };

  const handleEditTask = (task: ImplementationTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<ImplementationTask>) => {
    try {
      await updateTaskDetails({ taskId, updates });
      // Pequeno delay para o usuário ver o toast de sucesso
      setTimeout(() => {
        setIsTaskModalOpen(false);
      }, 600);
    } catch (error) {
      // Em caso de erro, manter o modal aberto
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleUpdateCheckpoint = (checkpointId: string, updates: {
    current_value: number;
    status: string;
    notes: string;
  }) => {
    updateCheckpoint({ checkpointId, updates });
    setIsCheckpointModalOpen(false);
  };

  const handleEditPhase = (phase: PhaseWithProgress) => {
    setSelectedPhase(phase);
    setIsPhaseModalOpen(true);
  };

  const handleCreatePhase = () => {
    setSelectedPhase(null);
    setIsPhaseModalOpen(true);
  };

  const handleSavePhase = (phaseId: string | undefined, updates: Partial<ImplementationPhase>) => {
    if (phaseId) {
      updatePhase({ phaseId, updates });
    } else if (plan?.id) {
      createPhase({ planId: plan.id, phaseData: updates });
    }
    setIsPhaseModalOpen(false);
  };

  const handleDeletePhase = (phaseId: string) => {
    deletePhase(phaseId);
  };

  const handleCreateTaskClick = (phaseId: string) => {
    setSelectedPhaseIdForTask(phaseId);
    setIsTaskCreateModalOpen(true);
  };

  const handleCreateTask = (phaseId: string, taskData: Partial<ImplementationTask>) => {
    createTask({ phaseId, taskData });
    setIsTaskCreateModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleUpdatePriority = (taskId: string, priority: 'high' | 'medium' | 'low') => {
    updateTaskPriority({ taskId, priority });
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

                <Tabs defaultValue="fases" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fases">Fases e Tarefas</TabsTrigger>
                    <TabsTrigger value="timeline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="fases" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Fases de Implementação</h3>
                      <Button onClick={handleCreatePhase} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Fase
                      </Button>
                    </div>
                    {plan.phases.map((phase, index) => (
                      <PhaseCard
                        key={phase.id}
                        phase={phase}
                        onToggleTask={handleToggleTask}
                        onEditTask={handleEditTask}
                        onEditPhase={handleEditPhase}
                        onDeletePhase={handleDeletePhase}
                        onCreateTask={handleCreateTaskClick}
                        onDeleteTask={handleDeleteTask}
                        onUpdatePriority={handleUpdatePriority}
                        isUpdating={isUpdatingTask || isUpdatingTaskPriority}
                        defaultOpen={phase.status === 'in-progress' || (index === 0 && phase.status === 'pending')}
                      />
                    ))}
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <TimelineView plan={plan} />
                  </TabsContent>
                </Tabs>
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

      <TaskDetailModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        isUpdating={isUpdatingTaskDetails}
      />

      <CheckpointUpdateModal
        open={isCheckpointModalOpen}
        onOpenChange={setIsCheckpointModalOpen}
        checkpoint={selectedCheckpoint}
        onUpdate={handleUpdateCheckpoint}
        isUpdating={isUpdatingCheckpoint}
      />

      <PhaseEditModal
        open={isPhaseModalOpen}
        onOpenChange={setIsPhaseModalOpen}
        phase={selectedPhase || undefined}
        planId={plan?.id}
        onSave={handleSavePhase}
        onDelete={handleDeletePhase}
        isUpdating={isUpdatingPhase || isCreatingPhase}
      />

      <TaskCreateModal
        open={isTaskCreateModalOpen}
        onOpenChange={setIsTaskCreateModalOpen}
        phaseId={selectedPhaseIdForTask || ''}
        onCreate={handleCreateTask}
        isCreating={isCreatingTask}
      />
    </div>
  );
};

export default PlanoImplementacao;
