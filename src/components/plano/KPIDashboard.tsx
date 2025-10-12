import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Clock, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PlanWithPhases } from '@/types/plano';

interface KPIDashboardProps {
  plan: PlanWithPhases;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ plan }) => {
  const currentPhase = plan.phases.find(p => p.status === 'in-progress') || 
                       plan.phases.find(p => p.status === 'pending');
  
  const totalTasks = plan.phases.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const completedTasks = plan.phases.reduce(
    (sum, p) => sum + (p.tasks?.filter(t => t.is_completed).length || 0), 
    0
  );
  const pendingTasks = totalTasks - completedTasks;

  // Calcular dias aproximados restantes (assumindo 30 dias por fase pendente)
  const remainingPhases = plan.phases.filter(p => p.status !== 'completed').length;
  const estimatedDays = remainingPhases * 30;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Progresso Geral */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground">Progresso Geral</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {plan.overallProgress}%
            </div>
            <Progress value={plan.overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fase Atual */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Fase Atual</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              Fase {currentPhase?.phase_number || 1}
            </div>
            <p className="text-sm font-medium line-clamp-2">
              {currentPhase?.phase_name || 'Aguardando início'}
            </p>
            {currentPhase && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Progress value={currentPhase.progress} className="h-1 flex-1" />
                <span>{currentPhase.progress}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tarefas Pendentes */}
      <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Tarefas Pendentes</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-500">
              {pendingTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingPhases} fases restantes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prazo Estimado */}
      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Prazo Estimado</h3>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-500">
              {estimatedDays}
            </div>
            <p className="text-xs text-muted-foreground">
              dias restantes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIDashboard;
