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
import { Loader2 } from 'lucide-react';
import { ImplementationTask } from '@/types/plano';

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phaseId: string;
  onCreate: (phaseId: string, taskData: Partial<ImplementationTask>) => void;
  isCreating: boolean;
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

const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  open,
  onOpenChange,
  phaseId,
  onCreate,
  isCreating,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [responsible, setResponsible] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  useEffect(() => {
    if (!open) {
      setTaskName('');
      setTaskDescription('');
      setPriority('medium');
      setResponsible('');
      setTargetYear('');
      setTargetMonth('');
      setEstimatedHours('');
    }
  }, [open]);

  const handleCreate = () => {
    if (!taskName.trim()) return;

    const taskData: Partial<ImplementationTask> = {
      task_name: taskName,
      task_description: taskDescription || undefined,
      priority,
      responsible: responsible || undefined,
      target_year: targetYear ? parseInt(targetYear) : undefined,
      target_month: targetMonth ? parseInt(targetMonth) : undefined,
      estimated_hours: estimatedHours ? parseFloat(estimatedHours) : undefined,
    };

    onCreate(phaseId, taskData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Crie uma nova tarefa para esta fase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">
              Nome da Tarefa <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-name"
              placeholder="Ex: Mapear processos atuais"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Descrição</Label>
            <Textarea
              id="task-description"
              placeholder="Descreva os detalhes da tarefa"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                placeholder="Nome"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-year-task">Ano Alvo</Label>
              <Input
                id="target-year-task"
                type="number"
                placeholder="2025"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                min="2024"
                max="2030"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-month-task">Mês Alvo</Label>
              <Select value={targetMonth} onValueChange={setTargetMonth}>
                <SelectTrigger id="target-month-task">
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
            <Label htmlFor="estimated-hours">Horas Estimadas</Label>
            <Input
              id="estimated-hours"
              type="number"
              placeholder="8"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!taskName.trim() || isCreating}>
            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Criar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateModal;
