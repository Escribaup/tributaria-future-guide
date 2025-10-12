import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Loader2, Trash2 } from 'lucide-react';
import { PhaseWithProgress, ImplementationPhase } from '@/types/plano';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PhaseEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase?: PhaseWithProgress;
  planId?: string;
  onSave: (phaseId: string | undefined, updates: Partial<ImplementationPhase>) => void;
  onDelete?: (phaseId: string) => void;
  isUpdating: boolean;
}

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const PhaseEditModal: React.FC<PhaseEditModalProps> = ({
  open,
  onOpenChange,
  phase,
  planId,
  onSave,
  onDelete,
  isUpdating,
}) => {
  const [phaseName, setPhaseName] = useState('');
  const [phaseDescription, setPhaseDescription] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isEditing = !!phase;
  const hasTasks = phase?.tasks && phase.tasks.length > 0;

  useEffect(() => {
    if (phase) {
      setPhaseName(phase.phase_name || '');
      setPhaseDescription(phase.phase_description || '');
      setTargetYear(phase.target_year?.toString() || '');
      setTargetMonth(phase.target_month?.toString() || '');
      setEstimatedDuration(phase.estimated_duration_days?.toString() || '');
    } else {
      setPhaseName('');
      setPhaseDescription('');
      setTargetYear('');
      setTargetMonth('');
      setEstimatedDuration('');
    }
  }, [phase, open]);

  const handleSave = () => {
    if (!phaseName.trim()) return;

    const updates: Partial<ImplementationPhase> = {
      phase_name: phaseName,
      phase_description: phaseDescription || undefined,
      target_year: targetYear ? parseInt(targetYear) : undefined,
      target_month: targetMonth ? parseInt(targetMonth) : undefined,
      estimated_duration_days: estimatedDuration ? parseInt(estimatedDuration) : undefined,
    };

    onSave(phase?.id, updates);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (phase?.id && onDelete) {
      onDelete(phase.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Fase' : 'Nova Fase'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite as informações da fase de implementação'
                : 'Crie uma nova fase para o plano de implementação'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phase-name">
                Nome da Fase <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phase-name"
                placeholder="Ex: Diagnóstico e Planejamento"
                value={phaseName}
                onChange={(e) => setPhaseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phase-description">Descrição</Label>
              <Textarea
                id="phase-description"
                placeholder="Descreva os objetivos e atividades desta fase"
                value={phaseDescription}
                onChange={(e) => setPhaseDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-year">Ano Alvo</Label>
                <Input
                  id="target-year"
                  type="number"
                  placeholder="2025"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  min="2024"
                  max="2030"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-month">Mês Alvo</Label>
                <Select value={targetMonth} onValueChange={setTargetMonth}>
                  <SelectTrigger id="target-month">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração Estimada (dias)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={hasTasks || isUpdating}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!phaseName.trim() || isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Salvar' : 'Criar Fase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a fase "{phase?.phase_name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PhaseEditModal;
