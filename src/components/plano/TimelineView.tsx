import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlanWithPhases } from '@/types/plano';
import { Calendar, Clock } from 'lucide-react';

interface TimelineViewProps {
  plan: PlanWithPhases;
}

const TimelineView: React.FC<TimelineViewProps> = ({ plan }) => {
  // Agregar eventos por mês/ano
  const timelineData = React.useMemo(() => {
    const events: { [key: string]: any[] } = {};

    plan.phases.forEach(phase => {
      if (phase.target_year && phase.target_month) {
        const key = `${phase.target_year}-${phase.target_month.toString().padStart(2, '0')}`;
        if (!events[key]) events[key] = [];
        events[key].push({
          type: 'phase',
          name: phase.phase_name,
          status: phase.status,
          phase: phase
        });
      }

      phase.tasks.forEach(task => {
        if (task.target_year && task.target_month) {
          const key = `${task.target_year}-${task.target_month.toString().padStart(2, '0')}`;
          if (!events[key]) events[key] = [];
          events[key].push({
            type: 'task',
            name: task.task_name,
            status: task.is_completed ? 'completed' : 'pending',
            task: task
          });
        }
      });
    });

    return Object.entries(events).sort(([a], [b]) => a.localeCompare(b));
  }, [plan]);

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  if (timelineData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline de Implementação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Configure datas nas fases e tarefas para visualizar a timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Timeline de Implementação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineData.map(([monthKey, events]) => (
            <div key={monthKey} className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  {getMonthName(monthKey)}
                </div>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="ml-6 space-y-2">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${event.type === 'phase' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    <span className="text-sm flex-1">{event.name}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(event.status)}`}>
                      {event.type === 'phase' ? '📊 Fase' : '✓ Tarefa'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineView;
