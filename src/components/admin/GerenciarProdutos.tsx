
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
import { Produto } from '@/types/simulador';
import { Pencil, Trash2 } from "lucide-react";

const produtoSchema = z.object({
  gtin: z.string().min(1, "GTIN é obrigatório"),
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  categoria: z.string().optional(),
  perfil_fornecedor: z.string().optional()
});

const GerenciarProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoProduto, setEditandoProduto] = useState<Produto | null>(null);
  
  const form = useForm<z.infer<typeof produtoSchema>>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      gtin: "",
      nome: "",
      categoria: "",
      perfil_fornecedor: ""
    }
  });
  
  // Buscar produtos
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');
        
      if (error) throw error;
      
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos."
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProdutos();
  }, []);
  
  // Abrir diálogo para edição
  const handleEditar = (produto: Produto) => {
    setEditandoProduto(produto);
    form.reset({
      gtin: produto.gtin,
      nome: produto.nome,
      categoria: produto.categoria || "",
      perfil_fornecedor: produto.perfil_fornecedor || ""
    });
    setDialogOpen(true);
  };
  
  // Abrir diálogo para novo produto
  const handleNovoProduto = () => {
    setEditandoProduto(null);
    form.reset({
      gtin: "",
      nome: "",
      categoria: "",
      perfil_fornecedor: ""
    });
    setDialogOpen(true);
  };
  
  // Excluir produto
  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso."
      });
      
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o produto."
      });
    }
  };
  
  // Salvar produto (novo ou edição)
  const handleSubmit = async (values: z.infer<typeof produtoSchema>) => {
    try {
      if (editandoProduto) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('produtos')
          .update({
            gtin: values.gtin,
            nome: values.nome,
            categoria: values.categoria,
            perfil_fornecedor: values.perfil_fornecedor
          })
          .eq('id', editandoProduto.id);
          
        if (error) throw error;
        
        toast({
          title: "Produto atualizado",
          description: `O produto "${values.nome}" foi atualizado com sucesso.`
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('produtos')
          .insert([{
            gtin: values.gtin,
            nome: values.nome,
            categoria: values.categoria,
            perfil_fornecedor: values.perfil_fornecedor
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Produto criado",
          description: `O produto "${values.nome}" foi criado com sucesso.`
        });
      }
      
      // Fechar diálogo e recarregar dados
      setDialogOpen(false);
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto."
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <Button onClick={handleNovoProduto} className="bg-idvl-blue-dark hover:bg-idvl-blue-light">
          Novo Produto
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
                <TableHead>GTIN</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Perfil Fornecedor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length > 0 ? (
                produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>{produto.gtin}</TableCell>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.categoria || "-"}</TableCell>
                    <TableCell>{produto.perfil_fornecedor || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditar(produto)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleExcluir(produto.id)} 
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
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo para adicionar/editar produto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editandoProduto ? `Editar produto: ${editandoProduto.nome}` : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="gtin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GTIN</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="GTIN do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Categoria do produto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="perfil_fornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Fornecedor (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Perfil de fornecedor" />
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
                  {editandoProduto ? "Atualizar" : "Criar"} Produto
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarProdutos;
