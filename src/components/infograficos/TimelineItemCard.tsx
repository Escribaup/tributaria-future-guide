import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react";
import { useState } from "react";

interface TimelineItem {
  year: string;
  bullets: string[];
}

interface TimelineItemCardProps {
  item: TimelineItem;
  index: number;
  total: number;
  onUpdate: (index: number, item: TimelineItem) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const TimelineItemCard = ({
  item,
  index,
  total,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: TimelineItemCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleYearChange = (newYear: string) => {
    onUpdate(index, { ...item, year: newYear });
  };

  const handleBulletChange = (bulletIndex: number, newValue: string) => {
    const newBullets = [...item.bullets];
    newBullets[bulletIndex] = newValue;
    onUpdate(index, { ...item, bullets: newBullets });
  };

  const handleAddBullet = () => {
    onUpdate(index, { ...item, bullets: [...item.bullets, ""] });
  };

  const handleRemoveBullet = (bulletIndex: number) => {
    if (item.bullets.length > 1) {
      const newBullets = item.bullets.filter((_, i) => i !== bulletIndex);
      onUpdate(index, { ...item, bullets: newBullets });
    }
  };

  return (
    <Card className="p-4 animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <Badge variant="outline">#{index + 1}</Badge>
            <span className="font-medium text-sm truncate max-w-[300px]">
              {item.year || "Novo período"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {index > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveUp(index)}
                title="Mover para cima"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            {index < total - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMoveDown(index)}
                title="Mover para baixo"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              className="text-destructive hover:text-destructive"
              title="Remover período"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Ano/Título
              </label>
              <Input
                value={item.year}
                onChange={(e) => handleYearChange(e.target.value)}
                placeholder="Ex: 2025 – Preparação Estratégica"
                className={!item.year.trim() ? "border-destructive" : ""}
              />
              {!item.year.trim() && (
                <p className="text-xs text-destructive mt-1">Campo obrigatório</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Pontos-chave
              </label>
              <div className="space-y-2">
                {item.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <span className="text-sm text-muted-foreground pt-2 w-6">
                      {bulletIndex + 1}.
                    </span>
                    <Input
                      value={bullet}
                      onChange={(e) => handleBulletChange(bulletIndex, e.target.value)}
                      placeholder="Digite um ponto-chave"
                      className="flex-1"
                    />
                    {item.bullets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBullet(bulletIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBullet}
                className="mt-2 w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ponto
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
