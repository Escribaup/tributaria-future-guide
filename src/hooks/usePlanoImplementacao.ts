import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { 
  ImplementationPlan, 
  ImplementationPhase, 
  ImplementationTask,
  PhaseWithProgress,
  PlanWithPhases,
  PhaseStatus,
  DEFAULT_PHASES_TEMPLATE
} from '@/types/plano';
import { toast } from 'sonner';

export const usePlanoImplementacao = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Calcular progresso de uma fase
  const calculatePhaseProgress = (tasks: ImplementationTask[]): number => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.is_completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Determinar status da fase
  const getPhaseStatus = (progress: number): PhaseStatus => {
    if (progress === 0) return 'pending';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  // Buscar plano do usuário
  const { data: plan, isLoading: isPlanLoading, error: planError } = useQuery({
    queryKey: ['implementation-plan', user?.id],
    queryFn: async (): Promise<PlanWithPhases | null> => {
      if (!user?.id) return null;

      // Buscar plano
      const { data: planData, error: planError } = await supabase
        .from('implementation_plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (planError) {
        if (planError.code === 'PGRST116') return null; // Nenhum plano encontrado
        throw planError;
      }

      // Buscar fases
      const { data: phasesData, error: phasesError } = await supabase
        .from('implementation_phases')
        .select('*')
        .eq('plan_id', planData.id)
        .order('phase_number');

      if (phasesError) throw phasesError;

      // Buscar tarefas de todas as fases
      const phaseIds = phasesData.map(p => p.id);
      const { data: tasksData, error: tasksError } = await supabase
        .from('implementation_tasks')
        .select('*')
        .in('phase_id', phaseIds)
        .order('order_index');

      if (tasksError) throw tasksError;

      // Agrupar tarefas por fase
      const phasesWithTasks: PhaseWithProgress[] = phasesData.map(phase => {
        const phaseTasks = tasksData.filter(t => t.phase_id === phase.id) as ImplementationTask[];
        const progress = calculatePhaseProgress(phaseTasks);
        
        return {
          ...phase,
          tasks: phaseTasks,
          progress,
          status: getPhaseStatus(progress)
        };
      });

      // Calcular progresso geral
      const totalTasks = tasksData.length;
      const completedTasks = tasksData.filter(t => t.is_completed).length;
      const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...planData,
        phases: phasesWithTasks,
        overallProgress
      };
    },
    enabled: !!user?.id,
  });

  // Criar novo plano
  const createPlanMutation = useMutation({
    mutationFn: async (companyName: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Criar plano
      const { data: planData, error: planError } = await supabase
        .from('implementation_plans')
        .insert({
          user_id: user.id,
          company_name: companyName
        })
        .select()
        .single();

      if (planError) throw planError;

      // Criar fases e tarefas do template
      for (const phaseTemplate of DEFAULT_PHASES_TEMPLATE) {
        const { data: phaseData, error: phaseError } = await supabase
          .from('implementation_phases')
          .insert({
            plan_id: planData.id,
            phase_number: phaseTemplate.phase_number,
            phase_name: phaseTemplate.phase_name,
            phase_description: phaseTemplate.phase_description
          })
          .select()
          .single();

        if (phaseError) throw phaseError;

        // Criar tarefas da fase
        const tasksToInsert = phaseTemplate.tasks.map(task => ({
          phase_id: phaseData.id,
          task_name: task.task_name,
          priority: task.priority,
          order_index: task.order_index
        }));

        const { error: tasksError } = await supabase
          .from('implementation_tasks')
          .insert(tasksToInsert);

        if (tasksError) throw tasksError;
      }

      return planData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
      toast.success('Plano de implementação criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar plano:', error);
      toast.error('Erro ao criar plano de implementação');
    }
  });

  // Atualizar tarefa
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('implementation_tasks')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  });

  // Atualizar detalhes completos da tarefa (temporal e documentação)
  const updateTaskDetailsMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<ImplementationTask> }) => {
      const { error } = await supabase
        .from('implementation_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  });

  // Criar checkpoint
  const createCheckpointMutation = useMutation({
    mutationFn: async (checkpointData: any) => {
      const { error } = await supabase
        .from('implementation_checkpoints')
        .insert(checkpointData);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
      toast.success('Checkpoint criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar checkpoint:', error);
      toast.error('Erro ao criar checkpoint');
    }
  });

  // Atualizar checkpoint
  const updateCheckpointMutation = useMutation({
    mutationFn: async ({ 
      checkpointId, 
      updates 
    }: { 
      checkpointId: string; 
      updates: { current_value: number; status: string; notes: string } 
    }) => {
      // Calcular progresso
      const { data: checkpoint } = await supabase
        .from('implementation_checkpoints')
        .select('target_value')
        .eq('id', checkpointId)
        .single();

      const progress_percentage = checkpoint?.target_value
        ? Math.min(100, (updates.current_value / checkpoint.target_value) * 100)
        : 0;

      // Atualizar checkpoint
      const { error: updateError } = await supabase
        .from('implementation_checkpoints')
        .update({
          current_value: updates.current_value,
          status: updates.status,
          notes: updates.notes,
          progress_percentage,
          achieved_date: updates.status === 'achieved' ? new Date().toISOString() : null
        })
        .eq('id', checkpointId);

      if (updateError) throw updateError;

      // Registrar no histórico se o usuário adicionou notas
      if (updates.notes && user?.id) {
        const { error: historyError } = await supabase
          .from('implementation_progress_history')
          .insert({
            checkpoint_id: checkpointId,
            recorded_value: updates.current_value,
            progress_percentage,
            notes: updates.notes,
            recorded_by: user.id
          });

        if (historyError) throw historyError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
      toast.success('Checkpoint atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar checkpoint:', error);
      toast.error('Erro ao atualizar checkpoint');
    }
  });

  // Atualizar nome da empresa
  const updateCompanyNameMutation = useMutation({
    mutationFn: async ({ planId, companyName }: { planId: string; companyName: string }) => {
      const { error } = await supabase
        .from('implementation_plans')
        .update({ company_name: companyName })
        .eq('id', planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['implementation-plan'] });
      toast.success('Nome da empresa atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar empresa:', error);
      toast.error('Erro ao atualizar nome da empresa');
    }
  });

  return {
    plan,
    isPlanLoading,
    planError,
    createPlan: createPlanMutation.mutate,
    isCreatingPlan: createPlanMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdatingTask: updateTaskMutation.isPending,
    updateTaskDetails: updateTaskDetailsMutation.mutate,
    isUpdatingTaskDetails: updateTaskDetailsMutation.isPending,
    createCheckpoint: createCheckpointMutation.mutate,
    isCreatingCheckpoint: createCheckpointMutation.isPending,
    updateCheckpoint: updateCheckpointMutation.mutate,
    isUpdatingCheckpoint: updateCheckpointMutation.isPending,
    updateCompanyName: updateCompanyNameMutation.mutate,
  };
};
