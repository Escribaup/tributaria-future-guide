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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImplementationTask } from '@/types/plano';
import { Loader2, Calendar } from 'lucide-react';

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ImplementationTask | null;
  onUpdate: (taskId: string, updates: Partial<ImplementationTask>) => void;
  isUpdating: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  onOpenChange,
  task,
  onUpdate,
  isUpdating
}) => {
  const [formData, setFormData] = useState<Partial<ImplementationTask>>({});

  React.useEffect(() => {
    if (task && open) {
      setFormData({
        task_name: task.task_name,
        task_description: task.task_description,
        priority: task.priority,
        responsible: task.responsible,
        target_year: task.target_year,
        target_month: task.target_month,
        target_date: task.target_date,
        estimated_hours: task.estimated_hours,
        actual_hours: task.actual_hours,
        planning_notes: task.planning_notes,
        completion_notes: task.completion_notes,
        challenges_faced: task.challenges_faced,
        lessons_learned: task.lessons_learned,
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    onUpdate(task.id, formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!task) return null;

  const months = [
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
          <DialogDescription>{task.task_name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="temporal">Temporal</TabsTrigger>
              <TabsTrigger value="documentation">Documentação</TabsTrigger>
              <TabsTrigger value="completion">Conclusão</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="task_name">Nome da Tarefa *</Label>
                <Input
                  id="task_name"
                  value={formData.task_name || ''}
                  onChange={(e) => updateField('task_name', e.target.value)}
                  placeholder="Nome da tarefa"
                  disabled={isUpdating}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task_description">Descrição</Label>
                <Textarea
                  id="task_description"
                  value={formData.task_description || ''}
                  onChange={(e) => updateField('task_description', e.target.value)}
                  placeholder="Descreva a tarefa..."
                  rows={4}
                  disabled={isUpdating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority || 'medium'}
                    onValueChange={(value) => updateField('priority', value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
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
                    value={formData.responsible || ''}
                    onChange={(e) => updateField('responsible', e.target.value)}
                    placeholder="Nome do responsável"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="temporal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_year">Ano Alvo</Label>
                  <Input
                    id="target_year"
                    type="number"
                    value={formData.target_year || ''}
                    onChange={(e) => updateField('target_year', parseInt(e.target.value) || null)}
                    placeholder="2026"
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_month">Mês Alvo</Label>
                  <Select
                    value={formData.target_month?.toString() || ''}
                    onValueChange={(value) => updateField('target_month', parseInt(value) || null)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date">Data Alvo Específica</Label>
                <div className="relative">
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date || ''}
                    onChange={(e) => updateField('target_date', e.target.value || null)}
                    disabled={isUpdating}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_hours">Horas Estimadas</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    step="0.5"
                    value={formData.estimated_hours || ''}
                    onChange={(e) => updateField('estimated_hours', parseFloat(e.target.value) || null)}
                    placeholder="40"
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual_hours">Horas Reais</Label>
                  <Input
                    id="actual_hours"
                    type="number"
                    step="0.5"
                    value={formData.actual_hours || ''}
                    onChange={(e) => updateField('actual_hours', parseFloat(e.target.value) || null)}
                    placeholder="45"
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="planning_notes">Notas de Planejamento</Label>
                <Textarea
                  id="planning_notes"
                  value={formData.planning_notes || ''}
                  onChange={(e) => updateField('planning_notes', e.target.value)}
                  placeholder="Descreva o que será feito nesta tarefa..."
                  rows={5}
                  disabled={isUpdating}
                />
                <p className="text-xs text-muted-foreground">
                  O que está sendo planejado para esta tarefa
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges_faced">Desafios Enfrentados</Label>
                <Textarea
                  id="challenges_faced"
                  value={formData.challenges_faced || ''}
                  onChange={(e) => updateField('challenges_faced', e.target.value)}
                  placeholder="Quais desafios foram encontrados durante a execução..."
                  rows={4}
                  disabled={isUpdating}
                />
              </div>
            </TabsContent>

            <TabsContent value="completion" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="completion_notes">Notas de Conclusão</Label>
                <Textarea
                  id="completion_notes"
                  value={formData.completion_notes || ''}
                  onChange={(e) => updateField('completion_notes', e.target.value)}
                  placeholder="Descreva o que foi feito ao concluir esta tarefa..."
                  rows={5}
                  disabled={isUpdating}
                />
                <p className="text-xs text-muted-foreground">
                  O que foi realizado ao concluir a tarefa
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessons_learned">Lições Aprendidas</Label>
                <Textarea
                  id="lessons_learned"
                  value={formData.lessons_learned || ''}
                  onChange={(e) => updateField('lessons_learned', e.target.value)}
                  placeholder="Quais lições foram aprendidas durante a execução..."
                  rows={4}
                  disabled={isUpdating}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
