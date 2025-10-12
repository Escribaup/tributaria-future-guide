import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImplementationTask } from '@/types/plano';
import { AlertCircle, Circle, CheckCircle2, Edit3 } from 'lucide-react';

interface TaskChecklistProps {
  tasks: ImplementationTask[];
  onToggleTask: (taskId: string, isCompleted: boolean) => void;
  onEditTask?: (task: ImplementationTask) => void;
  isUpdating: boolean;
}

const TaskChecklist: React.FC<TaskChecklistProps> = ({ 
  tasks, 
  onToggleTask, 
  onEditTask,
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
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={task.id}
                className={`text-sm font-medium cursor-pointer flex-1 ${
                  task.is_completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.task_name}
              </label>
              {onEditTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTask(task)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
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
              {task.target_date && (
                <span className="text-xs text-muted-foreground">
                  Prazo: {new Date(task.target_date).toLocaleDateString('pt-BR')}
                </span>
              )}
              {task.estimated_hours && (
                <span className="text-xs text-muted-foreground">
                  Est: {task.estimated_hours}h
                </span>
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
