

## Plano: Corrigir Calculadora — Campo de Classificação Tributária e Fluxo

### Problema Identificado

Testei as edge functions diretamente e ambas funcionam corretamente. O problema está no **frontend**:

1. **Campo `cClassTrib` quebrado**: A API Gov retorna classificações com campo `codigo`, mas o formulário tenta ler `cClassTrib`. Isso faz o dropdown mostrar valores `undefined` e enviar dados incorretos ao calcular.

2. **Mapeamento errado nos SelectItems**: Na linha 354, `c.cClassTrib` é `undefined` (o campo correto é `c.codigo`), então o valor cai no fallback `String(i)` (0, 1, 2...) — totalmente errado.

### Alterações

**1. `src/components/calculadora/CalculadoraForm.tsx`**

Corrigir o mapeamento de `classificacoesTributarias`:
- Linha 154: `listas.classificacoesTributarias[0].cClassTrib` → `.codigo`
- Linha 354: `value={c.cClassTrib || ...}` → `value={c.codigo || ...}`  
- Linha 355: `{c.cClassTrib} - {c.descricao}` → `{c.codigo} - {c.descricao}`

Isso resolve o dropdown de classificação tributária, permitindo ao usuário ver e alterar a classificação corretamente antes de calcular.

### Resultado Esperado

- Dropdown de classificação tributária mostra os códigos e descrições corretos (ex: "000001 - Situações tributadas integralmente pelo IBS e CBS")
- Usuário pode alterar CST, cClassTrib e NCM/NBS antes de calcular
- O botão "Calcular Tributos" envia o código correto da classificação

