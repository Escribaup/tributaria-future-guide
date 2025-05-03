
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AliquotaTransicao } from '@/types/simulador';
import { Pencil } from "lucide-react";

const aliquotaSchema = z.object({
  ano: z.string().min(1, "Ano é obrigatório")
    .refine((val) => !isNaN(parseInt(val)), "Ano deve ser um número")
    .refine((val) => parseInt(val) >= 2024 && parseInt(val) <= 2040, "Ano deve estar entre 2024 e 2040"),
  aliquota_ibs: z.string().min(1, "Alíquota IBS é obrigatória")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 1, 
      "Alíquota deve estar entre 0 e 1 (ex: 0.15 para 15%)"
    ),
  aliquota_cbs: z.string().min(1, "Alíquota CBS é obrigatória")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 1, 
      "Alíquota deve estar entre 0 e 1 (ex: 0.15 para 15%)"
    )
});

const GerenciarAliquotas: React.FC = () => {
  const [aliquotas, setAliquotas] = useState<AliquotaTransicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoAliquota, setEditandoAliquota] = useState<AliquotaTransicao | null>(null);
  
  const form = useForm<z.infer<typeof aliquotaSchema>>({
    resolver: zodResolver(aliquotaSchema),
    defaultValues: {
      ano: "",
      aliquota_ibs: "",
      aliquota_cbs: ""
    }
  });
  
  // Buscar alíquotas
  const fetchAliquotas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aliquotas_transicao')
        .select('*')
        .order('ano');
        
      if (error) throw error;
      
      setAliquotas(data || []);
    } catch (error) {
      console.error('Erro ao buscar alíquotas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar alíquotas",
        description: "Não foi possível carregar as alíquotas de transição."
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAliquotas();
  }, []);
  
  // Abrir diálogo para edição
  const handleEditar = (aliquota: AliquotaTransicao) => {
    setEditandoAliquota(aliquota);
    form.reset({
      ano: aliquota.ano.toString(),
      aliquota_ibs: aliquota.aliquota_ibs.toString(),
      aliquota_cbs: aliquota.aliquota_cbs.toString()
    });
    setDialogOpen(true);
  };
  
  // Abrir diálogo para nova alíquota
  const handleNovaAliquota = () => {
    setEditandoAliquota(null);
    form.reset({
      ano: "",
      aliquota_ibs: "",
      aliquota_cbs: ""
    });
    setDialogOpen(true);
  };
  
  // Salvar alíquota (nova ou edição)
  const handleSubmit = async (values: z.infer<typeof aliquotaSchema>) => {
    const ano = parseInt(values.ano);
    const aliquota_ibs = parseFloat(values.aliquota_ibs);
    const aliquota_cbs = parseFloat(values.aliquota_cbs);
    
    try {
      // Verificar se já existe uma alíquota para este ano
      if (!editandoAliquota) {
        const { data } = await supabase
          .from('aliquotas_transicao')
          .select('id')
          .eq('ano', ano);
          
        if (data && data.length > 0) {
          toast({
            variant: "destructive",
            title: "Ano duplicado",
            description: `Já existe uma alíquota cadastrada para o ano ${ano}.`
          });
          return;
        }
      }
      
      if (editandoAliquota) {
        // Atualizar alíquota existente
        const { error } = await supabase
          .from('aliquotas_transicao')
          .update({
            aliquota_ibs,
            aliquota_cbs
          })
          .eq('id', editandoAliquota.id);
          
        if (error) throw error;
        
        toast({
          title: "Alíquota atualizada",
          description: `As alíquotas para o ano ${ano} foram atualizadas com sucesso.`
        });
      } else {
        // Criar nova alíquota
        const { error } = await supabase
          .from('aliquotas_transicao')
          .insert([{
            ano,
            aliquota_ibs,
            aliquota_cbs
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Alíquota criada",
          description: `As alíquotas para o ano ${ano} foram cadastradas com sucesso.`
        });
      }
      
      // Fechar diálogo e recarregar dados
      setDialogOpen(false);
      fetchAliquotas();
    } catch (error) {
      console.error('Erro ao salvar alíquotas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alíquotas."
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alíquotas de Transição</h2>
        <Button onClick={handleNovaAliquota} className="bg-idvl-blue-dark hover:bg-idvl-blue-light">
          Nova Alíquota
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-idvl-blue-dark"></div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ano</TableHead>
                <TableHead>Alíquota IBS</TableHead>
                <TableHead>Alíquota CBS</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aliquotas.length > 0 ? (
                aliquotas.map((aliquota) => (
                  <TableRow key={aliquota.id}>
                    <TableCell className="font-medium">{aliquota.ano}</TableCell>
                    <TableCell>{(aliquota.aliquota_ibs * 100).toFixed(2)}%</TableCell>
                    <TableCell>{(aliquota.aliquota_cbs * 100).toFixed(2)}%</TableCell>
                    <TableCell>{((aliquota.aliquota_ibs + aliquota.aliquota_cbs) * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditar(aliquota)}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhuma alíquota cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo para adicionar/editar alíquota */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoAliquota 
                ? `Editar alíquotas para ${editandoAliquota.ano}` 
                : "Novas Alíquotas de Transição"
              }
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ano" 
                        disabled={!!editandoAliquota}
                        type="number"
                        min="2024"
                        max="2040"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aliquota_ibs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíquota IBS</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ex: 0.125 (para 12.5%)" 
                        type="number"
                        step="0.0001"
                        min="0"
                        max="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aliquota_cbs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíquota CBS</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ex: 0.125 (para 12.5%)" 
                        type="number"
                        step="0.0001"
                        min="0"
                        max="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-idvl-blue-dark hover:bg-idvl-blue-light"
                >
                  {editandoAliquota ? "Atualizar" : "Criar"} Alíquotas
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarAliquotas;
