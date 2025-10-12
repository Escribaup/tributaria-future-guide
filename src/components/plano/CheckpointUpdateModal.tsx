import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImplementationCheckpoint } from '@/types/plano';
import { Loader2 } from 'lucide-react';

interface CheckpointUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkpoint: ImplementationCheckpoint | null;
  onUpdate: (checkpointId: string, updates: {
    current_value: number;
    status: string;
    notes: string;
  }) => void;
  isUpdating: boolean;
}

const CheckpointUpdateModal: React.FC<CheckpointUpdateModalProps> = ({
  open,
  onOpenChange,
  checkpoint,
  onUpdate,
  isUpdating
}) => {
  const [currentValue, setCurrentValue] = useState<string>('');
  const [status, setStatus] = useState<string>('in_progress');
  const [notes, setNotes] = useState<string>('');

  React.useEffect(() => {
    if (checkpoint && open) {
      setCurrentValue(checkpoint.current_value.toString());
      setStatus(checkpoint.status);
      setNotes('');
    }
  }, [checkpoint, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpoint) return;

    onUpdate(checkpoint.id, {
      current_value: parseFloat(currentValue),
      status,
      notes
    });
  };

  if (!checkpoint) return null;

  const progressPercentage = checkpoint.target_value
    ? Math.min(100, (parseFloat(currentValue || '0') / checkpoint.target_value) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Checkpoint</DialogTitle>
          <DialogDescription>
            {checkpoint.checkpoint_name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_value">
              Valor Atual {checkpoint.metric_unit && `(${checkpoint.metric_unit})`}
            </Label>
            <Input
              id="current_value"
              type="number"
              step="0.01"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              disabled={isUpdating}
              required
            />
            {checkpoint.target_value && (
              <p className="text-xs text-muted-foreground">
                Meta: {checkpoint.target_value} {checkpoint.metric_unit}
                {' · '}
                Progresso: {progressPercentage.toFixed(1)}%
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Não Iniciado</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="achieved">Alcançado</SelectItem>
                <SelectItem value="at_risk">Em Risco</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas sobre o Progresso</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o que foi feito, desafios encontrados, etc."
              rows={4}
              disabled={isUpdating}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating} className="flex-1">
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Atualização
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckpointUpdateModal;
