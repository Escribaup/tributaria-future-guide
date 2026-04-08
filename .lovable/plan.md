

## Plano: Redesenhar Interface da Calculadora no Padrão da API Gov

Redesenhar a calculadora para espelhar o layout da imagem de referência (API Gov), com dois painéis lado a lado e um fluxo em duas etapas: primeiro classificar, depois calcular.

### Fluxo em Duas Etapas

1. **Classificar**: Usuário preenche descrição, seleciona UF/município e data. Clica em "Classificar" → sistema chama a edge function apenas para classificar (AI + API Gov) e retorna NCM/NBS, CST e cClassTrib.
2. **Revisar e Ajustar**: Usuário vê os campos NCM/NBS, CST e cClassTrib preenchidos automaticamente, mas pode editá-los antes de calcular.
3. **Calcular**: Com a classificação confirmada, usuário informa o preço e clica em "Calcular Tributos" → sistema envia tudo para a edge function que chama o regime-geral.

### Layout (conforme imagem de referência)

```text
┌─────────────────────────────┬──────────────────────────────┐
│  Operação de Consumo        │  Tributação                  │
│                             │                              │
│  Data do Fato Gerador       │  Tipo: ○ Bem  ● Serviço     │
│  [01/01/2027]               │                              │
│                             │  Situação Tributária (CST)   │
│  Local da Operação          │  [200 - Alíquota reduzida ▼] │
│  UF [PR ▼]  Município [▼]  │                              │
│                             │  Classificação (cClassTrib)  │
│  NCM/NBS: [código]         │  [200052 - Prestação... ▼]   │
│  Descrição: [texto]        │                              │
│                             │  Base de Cálculo             │
│  [Classificar]              │  R$ [100.00]                 │
│                             │  [Calcular Tributos]         │
└─────────────────────────────┴──────────────────────────────┘
```

### Alterações

**1. Edge Function `calcular-tributos/index.ts`**
- Adicionar modo `classificar`: recebe apenas descrição e retorna NCM/NBS, CST sugerido, lista de classificações tributárias disponíveis
- Modo `calcular`: mantém o fluxo atual, mas aceita NCM/NBS, CST e cClassTrib do usuário (não mais inferidos)
- Buscar lista de CSTs e classificações tributárias da API Gov para popular os selects

**2. Componente `CalculadoraForm.tsx`** - Redesenho completo
- Layout em dois painéis (grid 2 colunas):
  - **Esquerda - Operação de Consumo**: Data do fato gerador, UF, município, campo descrição (textarea), NCM/NBS (editável após classificação)
  - **Direita - Tributação**: Radio "Bem/Serviço", Select de CST (preenchido pela AI, editável), Select de cClassTrib (preenchido pela AI, editável), Base de cálculo (preço)
- Botão "Classificar" (etapa 1) e botão "Calcular" (etapa 2, habilitado só após classificação)
- Campos NCM/NBS, CST e cClassTrib editáveis pelo usuário

**3. Página `Calculadora.tsx`**
- Adicionar handler `handleClassificar` separado do `handleCalcular`
- Gerenciar estados intermediários (classificação pendente, classificação confirmada)

**4. `CalculadoraResultados.tsx`** - Sem alterações estruturais (tabela já está boa)

### Detalhes Técnicos
- A edge function buscará listas de CSTs e classificações tributárias (`/dados-abertos/classificacoes-tributarias/cbs-ibs`) para popular os selects
- O campo NCM/NBS será um Input editável (não readonly) após a classificação automática
- O tipo Bem/Serviço será inferido pela AI mas editável via radio buttons
- Quando o usuário altera o tipo (Bem↔Serviço), o campo NCM/NBS limpa para reclassificação

