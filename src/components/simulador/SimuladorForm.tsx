
import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Produto, Fornecedor, UF, AliquotaTransicao, CenarioSimulacao } from '@/pages/Simulador';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface SimuladorFormProps {
  produtos: Produto[];
  fornecedores: Fornecedor[];
  ufs: UF[];
  aliquotas: AliquotaTransicao[];
  cenarios: CenarioSimulacao[];
  onSubmit: (data: any) => void;
  loading: boolean;
  submitting: boolean;
}

const formularioSchema = z.object({
  nome_cenario: z.string().min(3, "Nome do cenário deve ter pelo menos 3 caracteres"),
  descricao_cenario: z.string().optional(),
  produto_id: z.string().optional(),
  fornecedor_id: z.string().optional(),
  uf_id: z.string().optional(),
  ano_inicial: z.string().min(1, "Ano inicial é obrigatório"),
  ano_final: z.string().min(1, "Ano final é obrigatório"),
  custo_compra: z.string().min(1, "Custo de compra é obrigatório"),
  custo_frete: z.string().optional(),
  custo_armazenagem: z.string().optional(),
  margem_desejada: z.string().min(1, "Margem desejada é obrigatória")
});

const SimuladorForm: React.FC<SimuladorFormProps> = ({
  produtos,
  fornecedores,
  ufs,
  aliquotas,
  cenarios,
  onSubmit,
  loading,
  submitting
}) => {
  const form = useForm<z.infer<typeof formularioSchema>>({
    resolver: zodResolver(formularioSchema),
    defaultValues: {
      nome_cenario: "",
      descricao_cenario: "",
      produto_id: "",
      fornecedor_id: "",
      uf_id: "",
      ano_inicial: "2024",
      ano_final: "2032",
      custo_compra: "",
      custo_frete: "0",
      custo_armazenagem: "0",
      margem_desejada: "30"
    }
  });
  
  const [cenarioSelecionado, setCenarioSelecionado] = useState<string>("");
  
  // Anos disponíveis baseados nas alíquotas de transição
  const anos = aliquotas.map(a => a.ano.toString());
  
  // Quando o usuário seleciona um cenário existente
  const handleCenarioChange = (cenarioId: string) => {
    setCenarioSelecionado(cenarioId);
    
    if (cenarioId) {
      const cenario = cenarios.find(c => c.id === parseInt(cenarioId));
      if (cenario) {
        form.setValue("nome_cenario", cenario.nome);
        form.setValue("descricao_cenario", cenario.descricao || "");
        form.setValue("produto_id", cenario.produto_id?.toString() || "");
        form.setValue("fornecedor_id", cenario.fornecedor_id?.toString() || "");
        form.setValue("uf_id", cenario.uf_id?.toString() || "");
        form.setValue("ano_inicial", cenario.ano_inicial?.toString() || "2024");
        form.setValue("ano_final", cenario.ano_final?.toString() || "2032");
      }
    }
  };
  
  const handleNovoClick = () => {
    form.reset();
    setCenarioSelecionado("");
  };
  
  const handleSubmitForm = (values: z.infer<typeof formularioSchema>) => {
    // Converter strings para números onde aplicável
    const produto_id = values.produto_id ? parseInt(values.produto_id) : undefined;
    const fornecedor_id = values.fornecedor_id ? parseInt(values.fornecedor_id) : undefined;
    const uf_id = values.uf_id ? parseInt(values.uf_id) : undefined;
    const ano_inicial = parseInt(values.ano_inicial);
    const ano_final = parseInt(values.ano_final);
    const custo_compra = parseFloat(values.custo_compra);
    const custo_frete = values.custo_frete ? parseFloat(values.custo_frete) : 0;
    const custo_armazenagem = values.custo_armazenagem ? parseFloat(values.custo_armazenagem) : 0;
    const margem_desejada = parseFloat(values.margem_desejada);
    
    // Construir o objeto de cenário
    const cenario: CenarioSimulacao = {
      nome: values.nome_cenario,
      descricao: values.descricao_cenario,
      produto_id,
      fornecedor_id,
      uf_id,
      ano_inicial,
      ano_final
    };
    
    // Se um cenário existente foi selecionado, incluir o ID
    if (cenarioSelecionado) {
      cenario.id = parseInt(cenarioSelecionado);
    }
    
    // Chamar o callback de submit com os dados formatados
    onSubmit({
      cenario,
      custos: {
        custo_compra,
        custo_frete,
        custo_armazenagem
      },
      margem_desejada
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)}>
        <div className="space-y-6">
          {/* Seleção de cenário existente */}
          {cenarios.length > 0 && (
            <div className="flex flex-wrap gap-4 items-end mb-6">
              <div className="flex-grow">
                <Label htmlFor="cenario_id">Selecionar cenário existente</Label>
                <Select value={cenarioSelecionado} onValueChange={handleCenarioChange}>
                  <SelectTrigger id="cenario_id" className="w-full">
                    <SelectValue placeholder="Selecione um cenário..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cenários salvos</SelectLabel>
                      {cenarios.map((cenario) => (
                        <SelectItem key={cenario.id} value={cenario.id?.toString() || ""}>
                          {cenario.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="button" 
                onClick={handleNovoClick}
                variant="outline"
              >
                Novo Cenário
              </Button>
            </div>
          )}
          
          {/* Dados do cenário */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cenário</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_cenario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cenário</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Produto X em 2025" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao_cenario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descrição do cenário" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="produto_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Produtos</SelectLabel>
                          {produtos.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fornecedor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fornecedores</SelectLabel>
                          {fornecedores.map((fornecedor) => (
                            <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                              {fornecedor.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uf_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Estados</SelectLabel>
                          {ufs.map((uf) => (
                            <SelectItem key={uf.id} value={uf.id.toString()}>
                              {uf.sigla} - {uf.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ano_inicial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano Inicial</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ano inicial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Anos</SelectLabel>
                          {anos.map((ano) => (
                            <SelectItem key={ano} value={ano}>
                              {ano}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ano_final"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano Final</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ano final" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Anos</SelectLabel>
                          {anos.map((ano) => (
                            <SelectItem key={ano} value={ano}>
                              {ano}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Dados de custo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados de Custo e Margem</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="custo_compra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo de Compra (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00"
                        disabled={submitting} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="custo_frete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo de Frete (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="custo_armazenagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo de Armazenagem (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="max-w-md">
              <FormField
                control={form.control}
                name="margem_desejada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margem Desejada (%)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="100" 
                        placeholder="30.00" 
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Alert variant="default" className="bg-blue-50">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Os cálculos da simulação consideram as alíquotas de transição do IBS e CBS para cada
              ano conforme a reforma tributária.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="bg-idvl-blue-dark hover:bg-idvl-blue-light"
              disabled={submitting || loading}
            >
              {submitting ? "Processando..." : "Realizar Simulação"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SimuladorForm;
