import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ImplementationTask } from '@/types/plano';
import { AlertCircle, Circle, CheckCircle2 } from 'lucide-react';

interface TaskChecklistProps {
  tasks: ImplementationTask[];
  onToggleTask: (taskId: string, isCompleted: boolean) => void;
  isUpdating: boolean;
}

const TaskChecklist: React.FC<TaskChecklistProps> = ({ 
  tasks, 
  onToggleTask, 
  isUpdating 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Circle className="h-3 w-3" />;
      case 'low': return <CheckCircle2 className="h-3 w-3" />;
      default: return null;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'ALTA';
      case 'medium': return 'MÉDIA';
      case 'low': return 'BAIXA';
      default: return priority.toUpperCase();
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
            task.is_completed 
              ? 'bg-muted/50 border-muted' 
              : 'bg-background border-border hover:border-primary/50'
          }`}
        >
          <Checkbox
            id={task.id}
            checked={task.is_completed}
            onCheckedChange={(checked) => 
              onToggleTask(task.id, checked as boolean)
            }
            disabled={isUpdating}
            className="mt-1"
          />
          <div className="flex-1 space-y-1">
            <label
              htmlFor={task.id}
              className={`text-sm font-medium cursor-pointer ${
                task.is_completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.task_name}
            </label>
            {task.task_description && (
              <p className="text-xs text-muted-foreground">
                {task.task_description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant={getPriorityColor(task.priority)}
                className="text-xs flex items-center gap-1"
              >
                {getPriorityIcon(task.priority)}
                {getPriorityLabel(task.priority)}
              </Badge>
              {task.responsible && (
                <Badge variant="outline" className="text-xs">
                  {task.responsible}
                </Badge>
              )}
              {task.completed_at && (
                <span className="text-xs text-muted-foreground">
                  Concluída em {new Date(task.completed_at).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskChecklist;
