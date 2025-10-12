import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Calculator,
  FileText,
  Users,
  ShieldCheck,
  Database,
  Calendar,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { name: "TrendingUp", Icon: TrendingUp, label: "Crescimento" },
  { name: "Calculator", Icon: Calculator, label: "Cálculo" },
  { name: "FileText", Icon: FileText, label: "Documento" },
  { name: "Users", Icon: Users, label: "Equipe" },
  { name: "ShieldCheck", Icon: ShieldCheck, label: "Segurança" },
  { name: "Database", Icon: Database, label: "Dados" },
  { name: "Calendar", Icon: Calendar, label: "Prazo" },
  { name: "BarChart3", Icon: BarChart3, label: "Análise" },
  { name: "Lightbulb", Icon: Lightbulb, label: "Ideia" },
  { name: "CheckCircle2", Icon: CheckCircle2, label: "Concluído" },
  { name: "AlertTriangle", Icon: AlertTriangle, label: "Atenção" },
  { name: "Target", Icon: Target, label: "Meta" },
  { name: "Zap", Icon: Zap, label: "Ação" },
];

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string | undefined) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = ICON_OPTIONS.filter(
    (icon) =>
      icon.label.toLowerCase().includes(search.toLowerCase()) ||
      icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
            title="Remover ícone"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <ScrollArea className="h-[280px]">
        <div className="grid grid-cols-4 gap-2 p-1">
          {filteredIcons.map((icon) => {
            const isSelected = value === icon.name;
            return (
              <Button
                key={icon.name}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-auto flex-col gap-1.5 p-3",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => onChange(icon.name)}
                title={icon.label}
              >
                <icon.Icon className="h-5 w-5" />
                <span className="text-xs leading-none">{icon.label}</span>
              </Button>
            );
          })}
        </div>
        
        {filteredIcons.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            Nenhum ícone encontrado
          </div>
        )}
      </ScrollArea>

      <Separator />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Ícones disponíveis: {filteredIcons.length}</span>
        {value && <span className="font-medium">Selecionado: {value}</span>}
      </div>
    </div>
  );
};
