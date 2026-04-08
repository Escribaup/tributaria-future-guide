import { corsHeaders } from '@supabase/supabase-js/cors'

const GOV_API = "https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/api/calculadora";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { tipo, siglaUf } = await req.json();

    let url: string;
    if (tipo === 'ufs') {
      url = `${GOV_API}/dados-abertos/ufs`;
    } else if (tipo === 'municipios' && siglaUf) {
      url = `${GOV_API}/dados-abertos/ufs/municipios?siglaUf=${siglaUf}`;
    } else {
      return new Response(JSON.stringify({ error: 'Parâmetros inválidos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
