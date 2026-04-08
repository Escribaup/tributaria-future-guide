

## Plano: Calculadora da Reforma Tributária com API Oficial

Implementar uma nova calculadora que se conecta diretamente à API oficial do governo (`consumo.tributos.gov.br`) para calcular tributos CBS/IBS automaticamente. O usuário precisa informar apenas a descrição do produto/serviço e o preço -- o sistema busca automaticamente NCM/NBS, classificações tributárias, alíquotas e reduções.

### Arquitetura

```text
┌──────────────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
│  CalculadoraForm     │────▶│  Edge Function       │────▶│  API Gov (tributos)  │
│  (descrição + preço  │     │  calcular-tributos   │     │  - NCM/NBS lookup    │
│   + UF/município)    │     │  - AI classifica NCM │     │  - classificações    │
│                      │◀────│  - chama API gov     │◀────│  - regime-geral      │
│  CalculadoraResult   │     │  - retorna resultado │     │  - alíquotas UF/Mun  │
└──────────────────────┘     └─────────────────────┘     └──────────────────────┘
```

### Fluxo de Automação

1. Usuário informa: **descrição do produto/serviço**, **preço de venda**, **UF** e **município**
2. Edge function usa **Lovable AI (Gemini)** para inferir o código NCM (mercadoria) ou NBS (serviço) a partir da descrição
3. Edge function consulta API Gov para obter dados do NCM/NBS (IS, reduções)
4. Edge function busca classificações tributárias CBS/IBS correspondentes
5. Edge function busca alíquotas da União, UF e município
6. Edge function monta o payload `OperacaoInput` e chama `POST /calculadora/regime-geral`
7. Resultado retornado com detalhamento completo: CBS, IBS UF, IBS Mun, IS, reduções
8. Frontend exibe resultado em tabela similar ao simulador atual, comparando preço antes/depois

### Componentes a Criar

**1. Edge Function: `supabase/functions/calcular-tributos/index.ts`**
- Recebe: descrição, preço, UF, município, ano (opcional, default 2026)
- Usa Lovable AI Gateway para classificar NCM/NBS via prompt
- Chama endpoints da API Gov em sequência:
  - `GET /dados-abertos/ufs` e `/ufs/municipios` (para resolver códigos)
  - `GET /dados-abertos/ncm?ncm=X&data=Y` ou `/nbs?nbs=X&data=Y`
  - `GET /dados-abertos/classificacoes-tributarias/cbs-ibs?data=Y`
  - `GET /dados-abertos/aliquota-uniao`, `/aliquota-uf`, `/aliquota-municipio`
  - `POST /calculadora/regime-geral` com payload montado
- Retorna resultado estruturado com todos os tributos calculados

**2. Página: `src/pages/Calculadora.tsx`**
- Nova rota `/calculadora` (protegida)
- Layout conforme imagem: formulário limpo com campos de entrada

**3. Formulário: `src/components/calculadora/CalculadoraForm.tsx`**
- Campo principal: **Descrição do produto/serviço** (textarea)
- **Preço de venda** (R$)
- **UF** (select, carregado da API Gov)
- **Município** (select dependente da UF, carregado da API Gov)
- **Ano do fato gerador** (select: 2026-2033, default 2026)
- Campos auto-preenchidos (readonly, mostrados após busca): NCM/NBS, CST, cClassTrib, alíquotas, reduções
- Botão "Calcular"

**4. Resultados: `src/components/calculadora/CalculadoraResultados.tsx`**
- Tabela com colunas: Tributo, Alíquota, Redução, Alíquota Efetiva, Valor
- Linhas: CBS, IBS UF, IBS Municipal, IBS Total, IS (se aplicável), Total
- Seção de comparação: preço sem tributos vs. preço com tributos novos
- Reutiliza o estilo visual das tabelas do simulador existente

**5. Rota no App.tsx**
- Adicionar `/calculadora` como rota protegida
- Adicionar link no Header

### Detalhes Técnicos

- A API Gov é pública (sem autenticação), mas será chamada via edge function para evitar CORS e centralizar a lógica
- Base URL da API: `https://consumo.tributos.gov.br/servico/calcular-tributos-consumo/api`
- O endpoint `POST /calculadora/regime-geral` requer: `id`, `versao`, `dhFatoGerador`, `municipio`, `uf`, e array `itens` com `numero`, `ncm/nbs`, `cst`, `cClassTrib`, `baseCalculo`
- Para classificação automática via AI: prompt pedirá o código NCM (8 dígitos) para mercadorias ou NBS (9 dígitos) para serviços
- CST padrão: "000" (tributação integral) a menos que a classificação indique outro

### Resultado Esperado

Uma calculadora intuitiva onde o usuário digita apenas a descrição do produto e o preço, seleciona a localização, e recebe automaticamente todos os tributos da reforma calculados pela API oficial do governo.

