import React, { useState } from 'react';
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
import { AliquotaTransicao, CenarioSimulacao } from '@/types/simulador';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";

interface SimuladorFormProps {
  aliquotas: AliquotaTransicao[];
  cenarios: CenarioSimulacao[];
  onSubmit: (data: any) => void;
  loading: boolean;
  submitting: boolean;
  error?: string | null;  // Adicionando a propriedade error como opcional
}

const formularioSchema = z.object({
  nome_cenario: z.string().min(3, "Nome do cenário deve ter pelo menos 3 caracteres"),
  descricao_cenario: z.string().optional(),
  ano_inicial: z.string().min(1, "Ano inicial é obrigatório"),
  ano_final: z.string().min(1, "Ano final é obrigatório"),
  custo_compra: z.string().min(1, "Custo de compra é obrigatório"),
  custo_frete: z.string().optional(),
  custo_armazenagem: z.string().optional(),
  margem_desejada: z.string().min(1, "Margem desejada é obrigatória"),
  reducao_ibs: z.string().default("70").optional(),
  // Campos de alíquotas atuais
  aliquota_icms: z.string().optional(),
  aliquota_iss: z.string().optional(),
  aliquota_pis: z.string().optional(),
  aliquota_cofins: z.string().optional(),
  preco_atual: z.string().min(1, "Preço atual de venda é obrigatório"),
});

const SimuladorForm: React.FC<SimuladorFormProps> = ({
  aliquotas,
  cenarios,
  onSubmit,
  loading,
  submitting,
  error
}) => {
  const form = useForm<z.infer<typeof formularioSchema>>({
    resolver: zodResolver(formularioSchema),
    defaultValues: {
      nome_cenario: "",
      descricao_cenario: "",
      ano_inicial: "2024",
      ano_final: "2032",
      custo_compra: "",
      custo_frete: "0",
      custo_armazenagem: "0",
      margem_desejada: "30",
      reducao_ibs: "70",
      aliquota_icms: "18",
      aliquota_iss: "5",
      aliquota_pis: "1.65",
      aliquota_cofins: "7.6",
      preco_atual: "",
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
        form.setValue("ano_inicial", cenario.ano_inicial?.toString() || "2024");
        form.setValue("ano_final", cenario.ano_final?.toString() || "2032");
        form.setValue("reducao_ibs", cenario.reducao_ibs?.toString() || "70");
      }
    }
  };
  
  const handleNovoClick = () => {
    form.reset();
    setCenarioSelecionado("");
  };
  
  const handleSubmitForm = (values: z.infer<typeof formularioSchema>) => {
    // Converter strings para números, aceitando vírgula ou ponto como separador decimal
    const toNumber = (v: string | undefined) => v ? parseFloat(v.replace(',', '.')) : 0;
    const ano_inicial = parseInt(values.ano_inicial);
    const ano_final = parseInt(values.ano_final);
    const custo_compra = toNumber(values.custo_compra);
    const custo_frete = toNumber(values.custo_frete);
    const custo_armazenagem = toNumber(values.custo_armazenagem);
    const margem_desejada = toNumber(values.margem_desejada);
    const preco_atual = toNumber(values.preco_atual);
    const reducao_ibs = values.reducao_ibs ? toNumber(values.reducao_ibs) : 70;
    // Alíquotas atuais - dividir por 100, sem arredondar
    const aliquota_icms = values.aliquota_icms ? toNumber(values.aliquota_icms) / 100 : 0;
    const aliquota_iss = values.aliquota_iss ? toNumber(values.aliquota_iss) / 100 : 0;
    const aliquota_pis = values.aliquota_pis ? toNumber(values.aliquota_pis) / 100 : 0;
    const aliquota_cofins = values.aliquota_cofins ? toNumber(values.aliquota_cofins) / 100 : 0;
    // Construir o objeto de cenário
    const cenario: CenarioSimulacao = {
      nome: values.nome_cenario,
      descricao: values.descricao_cenario,
      ano_inicial,
      ano_final,
      reducao_ibs
    };
    if (cenarioSelecionado) {
      cenario.id = parseInt(cenarioSelecionado);
    }
    onSubmit({
      cenario,
      custos: {
        custo_compra,
        custo_frete,
        custo_armazenagem
      },
      impostos_atuais: {
        aliquota_icms,
        aliquota_iss,
        aliquota_pis,
        aliquota_cofins,
        preco_atual
      },
      margem_desejada
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)}>
        <div className="space-y-8">
          {/* Exibir mensagem de erro, se houver */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Seleção de cenário existente */}
          {cenarios.length > 0 && (
            <div className="flex flex-wrap gap-4 items-end mb-6">
              <div className="flex-grow">
                <Label htmlFor="cenario_id">Selecionar cenário existente</Label>
                <Select value={cenarioSelecionado} onValueChange={handleCenarioChange}>
                  <SelectTrigger id="cenario_id" className="w-full rounded-lg border-gray-300 bg-white h-12 text-base">
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
                className="h-12 rounded-lg"
              >
                Novo Cenário
              </Button>
            </div>
          )}
          
          {/* Dados do cenário */}
          <div className="rounded-xl bg-[#f2f2f2] p-6 shadow-sm space-y-6 mb-2">
            <h3 className="text-xl font-bold text-[#232d42] mb-2">Dados do Cenário</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_cenario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cenário</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="Ex: Produto X em 2025" disabled={submitting} />
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
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="Descrição do cenário" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ano_inicial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano Inicial</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-lg text-base">
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
                        <SelectTrigger className="h-12 rounded-lg text-base">
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
              <FormField
                control={form.control}
                name="reducao_ibs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redução do IBS (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" type="number" step="1" min="0" max="100" placeholder="70" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Separator />
          
          {/* Dados de Custo e Preço Atual */}
          <div className="rounded-xl bg-[#f2f2f2] p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#232d42] mb-2">Dados de Custo e Preço Atual</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="custo_compra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo de Compra (R$)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="0.00" disabled={submitting} />
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
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="0.00" disabled={submitting} />
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
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="0.00" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="margem_desejada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margem Desejada (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="30" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preco_atual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda Atual (com impostos)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="0.00" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-[#232d42]">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> O preço de venda atual deve incluir todos os impostos (ICMS, ISS, PIS, COFINS).<br />
                Este valor será usado como base para calcular o preço sem impostos para a simulação do IVA.
              </AlertDescription>
            </Alert>
          </div>
          
          <Separator />
          
          {/* Impostos Atuais */}
          <div className="rounded-xl bg-[#f2f2f2] p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#232d42] mb-2">Impostos Atuais (%)</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="aliquota_icms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ICMS (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="18" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aliquota_iss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISS (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="5" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aliquota_pis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIS (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="1.65" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aliquota_cofins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>COFINS (%)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-lg text-base" placeholder="7.6" disabled={submitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-[#232d42]">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Simulação simplificada:</strong> O simulador calculará dois cenários importantes:<br />
                • Quanto você precisa reduzir seus custos para manter o mesmo preço final e lucro.<br />
                • Quanto você precisará aumentar o preço para manter o mesmo custo e lucro.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-lg text-base font-bold bg-[#1e6efb] hover:bg-[#232d42] text-white shadow-md transition-colors"
              disabled={submitting || loading}
            >
              {submitting || loading ? 'Processando...' : 'Realizar Simulação'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SimuladorForm;
