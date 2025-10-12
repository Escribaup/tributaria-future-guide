import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TimelineItemCard } from "./TimelineItemCard";
import { toast } from "@/hooks/use-toast";

interface TimelineItem {
  year: string;
  bullets: Array<{
    icon?: string;
    text: string;
  }>;
}

interface TimelineEditorProps {
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
}

export const TimelineEditor = ({ items, onChange }: TimelineEditorProps) => {
  const handleAddNewItem = () => {
    onChange([...items, { year: "", bullets: [{ text: "" }] }]);
    toast({
      title: "Novo período adicionado",
      description: "Preencha os dados do novo período da timeline",
    });
  };

  const handleUpdate = (index: number, item: TimelineItem) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };

  const handleDelete = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
      toast({
        title: "Período removido",
        description: "O período foi removido da timeline",
      });
    } else {
      toast({
        title: "Ação não permitida",
        description: "A timeline precisa ter pelo menos um período",
        variant: "destructive",
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onChange(newItems);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      onChange(newItems);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <TimelineItemCard
          key={index}
          item={item}
          index={index}
          total={items.length}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
        />
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddNewItem}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Novo Período da Timeline
      </Button>
    </div>
  );
};
