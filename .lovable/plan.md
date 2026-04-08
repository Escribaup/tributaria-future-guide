

## Plano: Corrigir busca de UFs e Municípios via Edge Function

### Problema
O formulário da calculadora tenta buscar UFs e municípios **diretamente** da API do governo (`consumo.tributos.gov.br`) pelo navegador, o que falha por **bloqueio de CORS**. A API do governo não permite chamadas cross-origin do browser.

### Solução
Criar uma edge function proxy (`buscar-localidades`) que faz as chamadas à API do governo no servidor e retorna os dados ao frontend sem problemas de CORS.

### Alterações

**1. Nova Edge Function: `supabase/functions/buscar-localidades/index.ts`**
- Endpoint proxy com dois modos:
  - `GET ?tipo=ufs` → retorna lista de UFs da API Gov
  - `GET ?tipo=municipios&siglaUf=RS` → retorna municípios de uma UF
- CORS headers incluídos em todas as respostas

**2. Atualizar `src/components/calculadora/CalculadoraForm.tsx`**
- Substituir chamadas diretas à API Gov por chamadas via `supabase.functions.invoke('buscar-localidades', ...)`
- Remover a constante `GOV_API` do frontend

### Detalhes Técnicos
- A edge function usará `fetch` para chamar `https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/api/calculadora/dados-abertos/ufs` e `/ufs/municipios`
- O frontend passará os parâmetros no body da invocação
- Sem necessidade de autenticação (dados públicos)

