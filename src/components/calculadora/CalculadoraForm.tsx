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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2, Search, Calculator, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface UF {
  sigla: string;
  nome: string;
  codigo: number;
}

interface Municipio {
  codigo: number;
  nome: string;
}

interface ClassificacaoResult {
  classificacao: {
    tipo: "ncm" | "nbs";
    codigo: string;
    cst_sugerido: string;
    descricao_classificacao: string;
    ncmNbsData: any;
  };
  listas: {
    csts: { codigo: string; descricao: string }[];
    classificacoesTributarias: any[];
  };
}

interface CalculadoraFormProps {
  onClassificar: (data: { descricao: string; ano: number }) => Promise<ClassificacaoResult | null>;
  onCalcular: (data: {
    tipo: string;
    codigo: string;
    cst: string;
    cClassTrib: string;
    preco: number;
    uf: string;
    codigoUf: number;
    codigoMunicipio: number;
    ano: number;
  }) => void;
  loadingClassificar: boolean;
  loadingCalcular: boolean;
}

const ANOS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"];

const CalculadoraForm: React.FC<CalculadoraFormProps> = ({
  onClassificar,
  onCalcular,
  loadingClassificar,
  loadingCalcular,
}) => {
  // Left panel state
  const [descricao, setDescricao] = useState('');
  const [ano, setAno] = useState('2026');
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [codigoNcmNbs, setCodigoNcmNbs] = useState('');

  // Right panel state
  const [tipoBem, setTipoBem] = useState<'ncm' | 'nbs'>('ncm');
  const [cst, setCst] = useState('');
  const [cClassTrib, setCClassTrib] = useState('');
  const [preco, setPreco] = useState('');

  // Lists
  const [ufs, setUfs] = useState<UF[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cstList, setCstList] = useState<{ codigo: string; descricao: string }[]>([]);
  const [classTribs, setClassTribs] = useState<any[]>([]);
  const [loadingUfs, setLoadingUfs] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Classification state
  const [classificado, setClassificado] = useState(false);
  const [descricaoClassificacao, setDescricaoClassificacao] = useState('');

  // Load UFs
  useEffect(() => {
    const fetchUfs = async () => {
      setLoadingUfs(true);
      try {
        const { data, error } = await supabase.functions.invoke('buscar-localidades', {
          body: { tipo: 'ufs' },
        });
        if (error) throw error;
        setUfs(Array.isArray(data) ? data.sort((a: UF, b: UF) => a.nome.localeCompare(b.nome)) : []);
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
        const { data, error } = await supabase.functions.invoke('buscar-localidades', {
          body: { tipo: 'municipios', siglaUf: uf },
        });
        if (error) throw error;
        setMunicipios(Array.isArray(data) ? data.sort((a: Municipio, b: Municipio) => a.nome.localeCompare(b.nome)) : []);
      } catch (e) {
        console.error("Error loading municipios:", e);
      } finally {
        setLoadingMunicipios(false);
      }
    };
    fetchMunicipios();
  }, [uf]);

  const selectedUf = ufs.find(u => u.sigla === uf);

  const handleClassificar = async () => {
    const result = await onClassificar({ descricao, ano: parseInt(ano) });
    if (result) {
      const { classificacao, listas } = result;
      setTipoBem(classificacao.tipo);
      setCodigoNcmNbs(classificacao.codigo);
      setCst(classificacao.cst_sugerido || '000');
      setDescricaoClassificacao(classificacao.descricao_classificacao || '');
      setCstList(listas.csts || []);
      setClassTribs(listas.classificacoesTributarias || []);
      // Try to find a matching cClassTrib
      if (listas.classificacoesTributarias?.length > 0) {
        setCClassTrib(listas.classificacoesTributarias[0].cClassTrib || '000001');
      } else {
        setCClassTrib('000001');
      }
      setClassificado(true);
    }
  };

  const handleCalcular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoNcmNbs || !preco || !uf || !municipio) return;

    onCalcular({
      tipo: tipoBem,
      codigo: codigoNcmNbs,
      cst,
      cClassTrib,
      preco: parseFloat(preco.replace(',', '.')),
      uf,
      codigoUf: selectedUf?.codigo || 0,
      codigoMunicipio: parseInt(municipio),
      ano: parseInt(ano),
    });
  };

  const loading = loadingClassificar || loadingCalcular;

  return (
    <form onSubmit={handleCalcular} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left Panel: Operação de Consumo ── */}
        <div className="rounded-xl bg-muted p-6 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-foreground border-b pb-2">Operação de Consumo</h3>

          <div className="space-y-2">
            <Label htmlFor="ano">Data do Fato Gerador (Ano)</Label>
            <Select value={ano} onValueChange={setAno} disabled={loading}>
              <SelectTrigger id="ano" className="h-10">
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

          <div className="space-y-2">
            <Label>Local da Operação</Label>
            <div className="grid grid-cols-2 gap-3">
              <Select value={uf} onValueChange={setUf} disabled={loading || loadingUfs}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={loadingUfs ? "Carregando..." : "UF"} />
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
              <Select value={municipio} onValueChange={setMunicipio} disabled={loading || loadingMunicipios || !uf}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={!uf ? "UF primeiro" : loadingMunicipios ? "Carregando..." : "Município"} />
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

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Produto/Serviço</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => { setDescricao(e.target.value); setClassificado(false); }}
              placeholder="Ex: Cerveja artesanal IPA 500ml, Consultoria em TI..."
              className="min-h-[70px]"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ncmnbs">
              {tipoBem === 'ncm' ? 'NCM' : 'NBS'} (código)
            </Label>
            <Input
              id="ncmnbs"
              value={codigoNcmNbs}
              onChange={(e) => setCodigoNcmNbs(e.target.value.replace(/\D/g, ''))}
              placeholder={tipoBem === 'ncm' ? '8 dígitos' : '9 dígitos'}
              className="h-10 font-mono"
              disabled={loading}
            />
            {descricaoClassificacao && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {descricaoClassificacao}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleClassificar}
            disabled={loading || !descricao}
          >
            {loadingClassificar ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Classificando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {classificado ? 'Reclassificar' : 'Classificar Automaticamente'}
              </>
            )}
          </Button>
        </div>

        {/* ── Right Panel: Tributação ── */}
        <div className="rounded-xl bg-muted p-6 shadow-sm space-y-5">
          <h3 className="text-xl font-bold text-foreground border-b pb-2">Tributação</h3>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup
              value={tipoBem}
              onValueChange={(v) => { setTipoBem(v as 'ncm' | 'nbs'); setCodigoNcmNbs(''); setClassificado(false); }}
              className="flex gap-4"
              disabled={loading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ncm" id="tipo-ncm" />
                <Label htmlFor="tipo-ncm" className="font-normal cursor-pointer">Bem (NCM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nbs" id="tipo-nbs" />
                <Label htmlFor="tipo-nbs" className="font-normal cursor-pointer">Serviço (NBS)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cst">Situação Tributária (CST)</Label>
            {cstList.length > 0 ? (
              <Select value={cst} onValueChange={setCst} disabled={loading}>
                <SelectTrigger id="cst" className="h-10">
                  <SelectValue placeholder="Selecione o CST" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>CSTs disponíveis</SelectLabel>
                    {cstList.map(c => (
                      <SelectItem key={c.codigo} value={c.codigo}>
                        {c.codigo} - {c.descricao}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="cst"
                value={cst}
                onChange={(e) => setCst(e.target.value)}
                placeholder="Ex: 000"
                className="h-10 font-mono"
                disabled={loading}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cClassTrib">Classificação Tributária (cClassTrib)</Label>
            {classTribs.length > 0 ? (
              <Select value={cClassTrib} onValueChange={setCClassTrib} disabled={loading}>
                <SelectTrigger id="cClassTrib" className="h-10">
                  <SelectValue placeholder="Selecione a classificação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classificações</SelectLabel>
                    {classTribs.slice(0, 100).map((c: any, i: number) => (
                      <SelectItem key={c.cClassTrib || i} value={c.cClassTrib || String(i)}>
                        {c.cClassTrib} - {c.descricao?.substring(0, 60) || 'Sem descrição'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="cClassTrib"
                value={cClassTrib}
                onChange={(e) => setCClassTrib(e.target.value)}
                placeholder="Ex: 000001"
                className="h-10 font-mono"
                disabled={loading}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Base de Cálculo (R$)</Label>
            <Input
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="100.00"
              className="h-10"
              disabled={loading}
            />
          </div>

          {classificado && (
            <Alert variant="default" className="bg-accent/50 border-secondary/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-sm">
                Classificação preenchida automaticamente. Revise e ajuste se necessário antes de calcular.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-bold"
            disabled={loading || !codigoNcmNbs || !preco || !uf || !municipio}
          >
            {loadingCalcular ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculando tributos...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Calcular Tributos
              </>
            )}
          </Button>
        </div>
      </div>

      <Alert variant="default" className="bg-accent border-secondary/20 text-foreground">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Cálculo oficial:</strong> Os tributos são calculados pela API oficial do governo (Calculadora da Reforma Tributária), considerando CBS, IBS e Imposto Seletivo.
        </AlertDescription>
      </Alert>
    </form>
  );
};

export default CalculadoraForm;
