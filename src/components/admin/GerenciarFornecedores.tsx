
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Fornecedor, UF } from '@/pages/Simulador';
import { Pencil, Trash2 } from "lucide-react";

const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome do fornecedor é obrigatório"),
  perfil: z.string().optional(),
  uf_id: z.string().optional()
});

const GerenciarFornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [ufs, setUFs] = useState<UF[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoFornecedor, setEditandoFornecedor] = useState<Fornecedor | null>(null);
  
  const form = useForm<z.infer<typeof fornecedorSchema>>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: "",
      perfil: "",
      uf_id: ""
    }
  });
  
  // Buscar fornecedores e UFs
  const fetchDados = async () => {
    setLoading(true);
    try {
      const [fornecedoresRes, ufsRes] = await Promise.all([
        supabase
          .from('fornecedores')
          .select('*, ufs(id, sigla, nome)')
          .order('nome'),
        supabase
          .from('ufs')
          .select('*')
          .order('nome')
      ]);
        
      if (fornecedoresRes.error) throw fornecedoresRes.error;
      if (ufsRes.error) throw ufsRes.error;
      
      setFornecedores(fornecedoresRes.data || []);
      setUFs(ufsRes.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os fornecedores e estados."
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDados();
  }, []);
  
  // Abrir diálogo para edição
  const handleEditar = (fornecedor: Fornecedor) => {
    setEditandoFornecedor(fornecedor);
    form.reset({
      nome: fornecedor.nome,
      perfil: fornecedor.perfil || "",
      uf_id: fornecedor.uf_id?.toString() || ""
    });
    setDialogOpen(true);
  };
  
  // Abrir diálogo para novo fornecedor
  const handleNovoFornecedor = () => {
    setEditandoFornecedor(null);
    form.reset({
      nome: "",
      perfil: "",
      uf_id: ""
    });
    setDialogOpen(true);
  };
  
  // Excluir fornecedor
  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    
    try {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso."
      });
      
      fetchDados();
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o fornecedor."
      });
    }
  };
  
  // Salvar fornecedor (novo ou edição)
  const handleSubmit = async (values: z.infer<typeof fornecedorSchema>) => {
    try {
      const uf_id = values.uf_id ? parseInt(values.uf_id) : null;
      
      if (editandoFornecedor) {
        // Atualizar fornecedor existente
        const { error } = await supabase
          .from('fornecedores')
          .update({
            nome: values.nome,
            perfil: values.perfil,
            uf_id
          })
          .eq('id', editandoFornecedor.id);
          
        if (error) throw error;
        
        toast({
          title: "Fornecedor atualizado",
          description: `O fornecedor "${values.nome}" foi atualizado com sucesso.`
        });
      } else {
        // Criar novo fornecedor
        const { error } = await supabase
          .from('fornecedores')
          .insert([{
            nome: values.nome,
            perfil: values.perfil,
            uf_id
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Fornecedor criado",
          description: `O fornecedor "${values.nome}" foi criado com sucesso.`
        });
      }
      
      // Fechar diálogo e recarregar dados
      setDialogOpen(false);
      fetchDados();
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o fornecedor."
      });
    }
  };
  
  // Função auxiliar para encontrar o nome do estado pelo ID
  const getUfNome = (uf_id: number | undefined | null) => {
    if (!uf_id) return "-";
    const uf = ufs.find(u => u.id === uf_id);
    return uf ? `${uf.sigla} - ${uf.nome}` : "-";
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Fornecedores</h2>
        <Button onClick={handleNovoFornecedor} className="bg-idvl-blue-dark hover:bg-idvl-blue-light">
          Novo Fornecedor
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
                <TableHead>Nome</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Estado (UF)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.length > 0 ? (
                fornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                    <TableCell>{fornecedor.perfil || "-"}</TableCell>
                    <TableCell>{getUfNome(fornecedor.uf_id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditar(fornecedor)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleExcluir(fornecedor.id)} 
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum fornecedor cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo para adicionar/editar fornecedor */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoFornecedor ? `Editar fornecedor: ${editandoFornecedor.nome}` : "Novo Fornecedor"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fornecedor</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do fornecedor" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Perfil do fornecedor" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uf_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ufs.map((uf) => (
                          <SelectItem key={uf.id} value={uf.id.toString()}>
                            {uf.sigla} - {uf.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-idvl-blue-dark hover:bg-idvl-blue-light"
                >
                  {editandoFornecedor ? "Atualizar" : "Criar"} Fornecedor
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarFornecedores;
