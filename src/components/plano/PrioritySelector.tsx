import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Circle, CheckCircle2 } from 'lucide-react';

interface PrioritySelectorProps {
  currentPriority: 'high' | 'medium' | 'low';
  taskId: string;
  onUpdate: (taskId: string, priority: 'high' | 'medium' | 'low') => void;
  disabled?: boolean;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  currentPriority,
  taskId,
  onUpdate,
  disabled = false,
}) => {
  const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'ALTA',
          variant: 'destructive' as const,
        };
      case 'medium':
        return {
          icon: <Circle className="h-3 w-3" />,
          label: 'MÉDIA',
          variant: 'default' as const,
        };
      case 'low':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          label: 'BAIXA',
          variant: 'secondary' as const,
        };
    }
  };

  const currentConfig = getPriorityConfig(currentPriority);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Badge 
          variant={currentConfig.variant}
          className="text-xs flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {currentConfig.icon}
          {currentConfig.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => onUpdate(taskId, 'high')}
          className="cursor-pointer"
        >
          <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
          ALTA
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdate(taskId, 'medium')}
          className="cursor-pointer"
        >
          <Circle className="h-4 w-4 mr-2" />
          MÉDIA
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdate(taskId, 'low')}
          className="cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
          BAIXA
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PrioritySelector;
