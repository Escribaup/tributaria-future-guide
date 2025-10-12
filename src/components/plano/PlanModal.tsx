import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (companyName: string) => void;
  isCreating: boolean;
}

const PlanModal: React.FC<PlanModalProps> = ({
  open,
  onOpenChange,
  onCreatePlan,
  isCreating,
}) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onCreatePlan(companyName.trim());
      setCompanyName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Plano de Implementação</DialogTitle>
            <DialogDescription>
              Crie um plano completo de implementação da Reforma Tributária para sua empresa.
              O plano incluirá 6 fases com tarefas detalhadas.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">
                Nome da Empresa
              </Label>
              <Input
                id="company-name"
                placeholder="Digite o nome da empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !companyName.trim()}>
              {isCreating ? 'Criando...' : 'Criar Plano'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
