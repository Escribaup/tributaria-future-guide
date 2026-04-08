import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOV_API = "https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/api/calculadora";

async function govGet(path: string, params: Record<string, string>) {
  const url = new URL(`${GOV_API}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gov API ${path} error ${res.status}: ${text}`);
  }
  return res.json();
}

async function govPost(path: string, body: unknown) {
  const res = await fetch(`${GOV_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gov API POST ${path} error ${res.status}: ${text}`);
  }
  return res.json();
}

async function classifyWithAI(descricao: string): Promise<{ tipo: "ncm" | "nbs"; codigo: string; descricao_classificacao: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em classificação fiscal brasileira. Dado a descrição de um produto ou serviço, retorne o código NCM (para mercadorias, 8 dígitos) ou NBS (para serviços, 9 dígitos).

REGRAS:
- Se for um produto/mercadoria física, retorne o código NCM (8 dígitos numéricos)
- Se for um serviço, retorne o código NBS (9 dígitos numéricos)
- Retorne APENAS o código, sem formatação, pontos ou traços
- Use o código mais específico possível
- Sugira também o CST mais adequado (3 dígitos)`,
        },
        {
          role: "user",
          content: `Classifique fiscalmente: "${descricao}"`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "classify_product",
            description: "Classifica um produto ou serviço com código NCM ou NBS",
            parameters: {
              type: "object",
              properties: {
                tipo: {
                  type: "string",
                  enum: ["ncm", "nbs"],
                  description: "ncm para mercadorias, nbs para serviços",
                },
                codigo: {
                  type: "string",
                  description: "Código NCM (8 dígitos) ou NBS (9 dígitos), apenas números",
                },
                cst_sugerido: {
                  type: "string",
                  description: "CST sugerido (3 dígitos), ex: 000 para tributação integral, 200 para alíquota reduzida",
                },
                descricao_classificacao: {
                  type: "string",
                  description: "Breve descrição do porquê dessa classificação",
                },
              },
              required: ["tipo", "codigo", "cst_sugerido", "descricao_classificacao"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "classify_product" } },
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("Rate limit exceeded. Tente novamente em alguns segundos.");
    if (response.status === 402) throw new Error("Créditos insuficientes.");
    const t = await response.text();
    throw new Error(`AI Gateway error: ${t}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) throw new Error("AI não retornou classificação");

  const args = JSON.parse(toolCall.function.arguments);
  return {
    tipo: args.tipo,
    codigo: args.codigo.replace(/\D/g, ""),
    descricao_classificacao: args.descricao_classificacao,
    cst_sugerido: args.cst_sugerido || "000",
  } as any;
}

// ── Mode: classificar ──
async function handleClassificar(body: any) {
  const { descricao, ano } = body;
  if (!descricao) throw new Error("Descrição é obrigatória");

  const anoRef = ano || 2026;
  const dataRef = `${anoRef}-01-01`;

  // 1. AI classification
  console.log("Classifying:", descricao);
  const aiResult = await classifyWithAI(descricao);
  console.log("AI result:", aiResult);

  // 2. Get NCM/NBS details
  let ncmNbsData: any = null;
  try {
    if (aiResult.tipo === "ncm") {
      ncmNbsData = await govGet("/dados-abertos/ncm", { ncm: aiResult.codigo, data: dataRef });
    } else {
      ncmNbsData = await govGet("/dados-abertos/nbs", { nbs: aiResult.codigo, data: dataRef });
    }
  } catch (e) {
    console.warn("NCM/NBS lookup warning:", e.message);
  }

  // 3. Get list of CSTs and classificações tributárias
  let classificacoesTributarias: any[] = [];
  try {
    classificacoesTributarias = await govGet("/dados-abertos/classificacoes-tributarias/cbs-ibs", { data: dataRef });
  } catch (e) {
    console.warn("ClassTrib list warning:", e.message);
  }

  // 4. Build CST list (common ones)
  const cstList = [
    { codigo: "000", descricao: "Tributação integral" },
    { codigo: "200", descricao: "Alíquota reduzida" },
    { codigo: "300", descricao: "Alíquota zero" },
    { codigo: "400", descricao: "Isento" },
    { codigo: "500", descricao: "Imune" },
    { codigo: "600", descricao: "Suspensão" },
    { codigo: "900", descricao: "Outros" },
  ];

  return {
    classificacao: {
      tipo: aiResult.tipo,
      codigo: aiResult.codigo,
      cst_sugerido: (aiResult as any).cst_sugerido || "000",
      descricao_classificacao: aiResult.descricao_classificacao,
      ncmNbsData,
    },
    listas: {
      csts: cstList,
      classificacoesTributarias: classificacoesTributarias || [],
    },
  };
}

// ── Mode: calcular ──
async function handleCalcular(body: any) {
  const { tipo, codigo, cst, cClassTrib, preco, uf, codigoUf, codigoMunicipio, ano } = body;

  if (!codigo || !preco) throw new Error("Código NCM/NBS e preço são obrigatórios");

  const anoRef = ano || 2026;
  const dataRef = `${anoRef}-01-01`;
  const dhFatoGerador = `${anoRef}-01-01T12:00:00-03:00`;

  // Get NCM/NBS details for IS check
  let ncmNbsData: any = null;
  try {
    if (tipo === "ncm") {
      ncmNbsData = await govGet("/dados-abertos/ncm", { ncm: codigo, data: dataRef });
    } else {
      ncmNbsData = await govGet("/dados-abertos/nbs", { nbs: codigo, data: dataRef });
    }
  } catch (e) {
    console.warn("NCM/NBS lookup:", e.message);
  }

  // Get tax rates
  const [aliquotaUniao, aliquotaUf, aliquotaMunicipio] = await Promise.all([
    govGet("/dados-abertos/aliquota-uniao", { data: dataRef }).catch(() => null),
    codigoUf ? govGet("/dados-abertos/aliquota-uf", { codigoUf: String(codigoUf), data: dataRef }).catch(() => null) : null,
    codigoMunicipio ? govGet("/dados-abertos/aliquota-municipio", { codigoMunicipio: String(codigoMunicipio), data: dataRef }).catch(() => null) : null,
  ]);

  // Build item
  const useCst = cst || "000";
  const useClassTrib = cClassTrib || "000001";

  const itemPayload: any = {
    numero: 1,
    cst: useCst,
    cClassTrib: useClassTrib,
    baseCalculo: preco,
    quantidade: 1,
  };

  if (tipo === "ncm") {
    itemPayload.ncm = codigo;
  } else {
    itemPayload.nbs = codigo;
  }

  if (ncmNbsData?.tributadoPeloImpostoSeletivo) {
    itemPayload.impostoSeletivo = {
      cst: "000",
      baseCalculo: preco,
      impostoInformado: 0,
      cClassTrib: "000001",
    };
  }

  const operacao = {
    id: crypto.randomUUID().replace(/-/g, ""),
    versao: "0.0.1",
    dhFatoGerador,
    municipio: codigoMunicipio || 4314902,
    uf: uf || "RS",
    itens: [itemPayload],
  };

  console.log("Calling regime-geral:", JSON.stringify(operacao));
  const resultado = await govPost("/regime-geral", operacao);
  console.log("Result:", JSON.stringify(resultado));

  const item = resultado?.objetos?.[0];
  const ibscbs = item?.tribCalc?.IBSCBS;
  const grupo = ibscbs?.gIBSCBS;
  const is = item?.tribCalc?.IS;

  return {
    classificacao: {
      tipo,
      codigo,
      cst: useCst,
      cClassTrib: useClassTrib,
      descricao_ncm_nbs: ncmNbsData,
    },
    aliquotas: {
      uniao: aliquotaUniao,
      uf: aliquotaUf,
      municipio: aliquotaMunicipio,
    },
    resultado: {
      baseCalculo: grupo?.vBC || preco,
      cbs: {
        aliquota: grupo?.gCBS?.pCBS || 0,
        valor: grupo?.gCBS?.vCBS || 0,
        reducao: grupo?.gCBS?.gRed || null,
      },
      ibsUf: {
        aliquota: grupo?.gIBSUF?.pIBSUF || 0,
        valor: grupo?.gIBSUF?.vIBSUF || 0,
        reducao: grupo?.gIBSUF?.gRed || null,
      },
      ibsMun: {
        aliquota: grupo?.gIBSMun?.pIBSMun || 0,
        valor: grupo?.gIBSMun?.vIBSMun || 0,
        reducao: grupo?.gIBSMun?.gRed || null,
      },
      ibsTotal: grupo?.vIBS || 0,
      is: is ? { aliquota: is.pIS || 0, valor: is.vIS || 0 } : null,
    },
    totais: resultado?.total || null,
    respostaBruta: resultado,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const modo = body.modo || "calcular";

    let response: any;
    if (modo === "classificar") {
      response = await handleClassificar(body);
    } else {
      response = await handleCalcular(body);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("calcular-tributos error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
