import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Flag, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { ImplementationCheckpoint } from '@/types/plano';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckpointCardProps {
  checkpoint: ImplementationCheckpoint;
  onUpdate: (checkpointId: string) => void;
  onViewHistory: (checkpointId: string) => void;
}

const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  onUpdate,
  onViewHistory
}) => {
  const getTypeIcon = () => {
    switch (checkpoint.checkpoint_type) {
      case 'objective':
        return <Target className="h-4 w-4" />;
      case 'key_result':
        return <TrendingUp className="h-4 w-4" />;
      case 'milestone':
        return <Flag className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (checkpoint.checkpoint_type) {
      case 'objective':
        return 'Objetivo';
      case 'key_result':
        return 'Resultado-Chave';
      case 'milestone':
        return 'Marco';
    }
  };

  const getStatusColor = () => {
    switch (checkpoint.status) {
      case 'achieved':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'at_risk':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'blocked':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  const getStatusIcon = () => {
    switch (checkpoint.status) {
      case 'achieved':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'in_progress':
        return <Clock className="h-3 w-3" />;
      case 'at_risk':
      case 'blocked':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (checkpoint.status) {
      case 'not_started':
        return 'Não Iniciado';
      case 'in_progress':
        return 'Em Andamento';
      case 'achieved':
        return 'Alcançado';
      case 'at_risk':
        return 'Em Risco';
      case 'blocked':
        return 'Bloqueado';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="text-primary">{getTypeIcon()}</div>
            <CardTitle className="text-base font-semibold">
              {checkpoint.checkpoint_name}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {getTypeLabel()}
          </Badge>
        </div>
        {checkpoint.checkpoint_description && (
          <p className="text-sm text-muted-foreground mt-1">
            {checkpoint.checkpoint_description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Métrica */}
        {checkpoint.metric_name && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{checkpoint.metric_name}</span>
              <span className="font-medium">
                {checkpoint.baseline_value !== null && (
                  <span className="text-muted-foreground">{checkpoint.baseline_value} → </span>
                )}
                <span className="text-primary">{checkpoint.current_value}</span>
                {checkpoint.target_value !== null && (
                  <span className="text-muted-foreground"> → {checkpoint.target_value}</span>
                )}
                {checkpoint.metric_unit && (
                  <span className="text-muted-foreground"> {checkpoint.metric_unit}</span>
                )}
              </span>
            </div>
            <Progress value={checkpoint.progress_percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{checkpoint.progress_percentage.toFixed(0)}% completo</span>
            </div>
          </div>
        )}

        {/* Status e Data */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <Badge variant="outline" className={`${getStatusColor()} gap-1`}>
            {getStatusIcon()}
            {getStatusLabel()}
          </Badge>
          {checkpoint.target_date && (
            <span className="text-muted-foreground text-xs">
              Meta: {format(new Date(checkpoint.target_date), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          )}
        </div>

        {/* Responsável */}
        {checkpoint.responsible && (
          <div className="text-xs text-muted-foreground">
            Responsável: <span className="font-medium">{checkpoint.responsible}</span>
          </div>
        )}

        {/* Notas */}
        {checkpoint.notes && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {checkpoint.notes}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onUpdate(checkpoint.id)}
          >
            Atualizar Progresso
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewHistory(checkpoint.id)}
          >
            Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckpointCard;
