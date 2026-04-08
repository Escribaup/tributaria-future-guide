import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UF {
  sigla: string;
  nome: string;
  codigo: number;
}

interface Municipio {
  codigo: number;
  nome: string;
}

interface CalculadoraFormProps {
  onSubmit: (data: {
    descricao: string;
    preco: number;
    uf: string;
    codigoUf: number;
    municipio: string;
    codigoMunicipio: number;
    ano: number;
  }) => void;
  loading: boolean;
  classificacao?: {
    tipo: string;
    codigo: string;
    cst: string;
    cClassTrib: string;
  } | null;
}

const GOV_API = "https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/api/calculadora";

const ANOS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];

const CalculadoraForm: React.FC<CalculadoraFormProps> = ({ onSubmit, loading, classificacao }) => {
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [ano, setAno] = useState('2026');

  const [ufs, setUfs] = useState<UF[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingUfs, setLoadingUfs] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Load UFs on mount
  useEffect(() => {
    const fetchUfs = async () => {
      setLoadingUfs(true);
      try {
        const res = await fetch(`${GOV_API}/dados-abertos/ufs`);
        if (res.ok) {
          const data = await res.json();
          setUfs(Array.isArray(data) ? data.sort((a: UF, b: UF) => a.nome.localeCompare(b.nome)) : []);
        }
      } catch (e) {
        console.error("Error loading UFs:", e);
      } finally {
        setLoadingUfs(false);
      }
    };
    fetchUfs();
  }, []);

  // Load municipios when UF changes
  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      setMunicipio('');
      return;
    }

    const fetchMunicipios = async () => {
      setLoadingMunicipios(true);
      setMunicipio('');
      try {
        const res = await fetch(`${GOV_API}/dados-abertos/ufs/municipios?siglaUf=${uf}`);
        if (res.ok) {
          const data = await res.json();
          setMunicipios(Array.isArray(data) ? data.sort((a: Municipio, b: Municipio) => a.nome.localeCompare(b.nome)) : []);
        }
      } catch (e) {
        console.error("Error loading municipios:", e);
      } finally {
        setLoadingMunicipios(false);
      }
    };
    fetchMunicipios();
  }, [uf]);

  const selectedUf = ufs.find(u => u.sigla === uf);
  const selectedMunicipio = municipios.find(m => m.codigo.toString() === municipio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !preco || !uf || !municipio) return;

    onSubmit({
      descricao,
      preco: parseFloat(preco.replace(',', '.')),
      uf,
      codigoUf: selectedUf?.codigo || 0,
      municipio: selectedMunicipio?.nome || '',
      codigoMunicipio: parseInt(municipio),
      ano: parseInt(ano),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Descrição do Produto */}
      <div className="rounded-xl bg-muted p-6 shadow-sm space-y-5">
        <h3 className="text-xl font-bold text-foreground">Dados do Produto/Serviço</h3>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição do Produto ou Serviço</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Cerveja artesanal IPA 500ml, Consultoria em tecnologia da informação, Arroz branco tipo 1..."
            className="min-h-[80px] text-base"
            disabled={loading}
          />
          <p className="text-sm text-muted-foreground">
            Descreva o produto ou serviço. O sistema identificará automaticamente a classificação fiscal (NCM/NBS).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preco">Preço de Venda (R$)</Label>
            <Input
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="100.00"
              className="h-12 text-base"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ano">Ano do Fato Gerador</Label>
            <Select value={ano} onValueChange={setAno} disabled={loading}>
              <SelectTrigger id="ano" className="h-12 text-base">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Período de transição</SelectLabel>
                  {ANOS.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="rounded-xl bg-muted p-6 shadow-sm space-y-5">
        <h3 className="text-xl font-bold text-foreground">Localização da Operação</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="uf">Estado (UF)</Label>
            <Select value={uf} onValueChange={setUf} disabled={loading || loadingUfs}>
              <SelectTrigger id="uf" className="h-12 text-base">
                <SelectValue placeholder={loadingUfs ? "Carregando..." : "Selecione o estado"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {ufs.map(u => (
                    <SelectItem key={u.sigla} value={u.sigla}>{u.nome} ({u.sigla})</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="municipio">Município</Label>
            <Select value={municipio} onValueChange={setMunicipio} disabled={loading || loadingMunicipios || !uf}>
              <SelectTrigger id="municipio" className="h-12 text-base">
                <SelectValue placeholder={!uf ? "Selecione a UF primeiro" : loadingMunicipios ? "Carregando..." : "Selecione o município"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Municípios</SelectLabel>
                  {municipios.map(m => (
                    <SelectItem key={m.codigo} value={m.codigo.toString()}>{m.nome}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Classificação automática (readonly, shown after calculation) */}
      {classificacao && (
        <div className="rounded-xl bg-accent p-6 shadow-sm space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5" />
            Classificação Fiscal Automática
          </h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {classificacao.tipo.toUpperCase()}: {classificacao.codigo}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              CST: {classificacao.cst}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              cClassTrib: {classificacao.cClassTrib}
            </Badge>
          </div>
        </div>
      )}

      <Alert variant="default" className="bg-accent border-secondary/20 text-foreground">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Cálculo oficial:</strong> Os tributos são calculados pela API oficial do governo (Calculadora da Reforma Tributária), considerando CBS, IBS (UF e Municipal) e Imposto Seletivo quando aplicável.
        </AlertDescription>
      </Alert>

      <Button
        type="submit"
        className="w-full h-14 text-lg font-bold"
        disabled={loading || !descricao || !preco || !uf || !municipio}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculando tributos...
          </>
        ) : (
          <>
            <Search className="mr-2 h-5 w-5" />
            Calcular Tributos
          </>
        )}
      </Button>
    </form>
  );
};

export default CalculadoraForm;
