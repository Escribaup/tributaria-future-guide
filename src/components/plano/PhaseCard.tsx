import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Circle, CheckCircle2, Clock } from 'lucide-react';
import { PhaseWithProgress, ImplementationTask } from '@/types/plano';
import TaskChecklist from './TaskChecklist';

interface PhaseCardProps {
  phase: PhaseWithProgress;
  onToggleTask: (taskId: string, isCompleted: boolean) => void;
  onEditTask?: (task: ImplementationTask) => void;
  isUpdating: boolean;
  defaultOpen?: boolean;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  onToggleTask, 
  onEditTask,
  isUpdating,
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const getStatusIcon = () => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (phase.status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Concluída</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-500">Em Progresso</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const completedTasks = phase.tasks?.filter(t => t.is_completed).length || 0;
  const totalTasks = phase.tasks?.length || 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`transition-all duration-200 ${
        isOpen ? 'ring-2 ring-primary/20' : ''
      }`}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 text-left">
                {getStatusIcon()}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-lg">
                      Fase {phase.phase_number}: {phase.phase_name}
                    </CardTitle>
                    {getStatusBadge()}
                  </div>
                  {phase.phase_description && (
                    <p className="text-sm text-muted-foreground">
                      {phase.phase_description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <Progress value={phase.progress} className="h-2 flex-1 max-w-xs" />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {completedTasks}/{totalTasks} tarefas ({phase.progress}%)
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-muted-foreground transition-transform ml-2 flex-shrink-0 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {phase.tasks && phase.tasks.length > 0 ? (
              <TaskChecklist 
                tasks={phase.tasks} 
                onToggleTask={onToggleTask}
                onEditTask={onEditTask}
                isUpdating={isUpdating}
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma tarefa cadastrada para esta fase
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PhaseCard;
