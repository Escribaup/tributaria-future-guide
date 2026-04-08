

## Plano: Criar Todas as Tabelas no Lovable Cloud

O banco de dados do Lovable Cloud está vazio. Preciso recriar todas as tabelas que o projeto utiliza para resolver os erros de build.

### Tabelas a Criar (1 migração SQL)

**1. `admins`** - Controle de administradores
- `id` UUID (PK, referencia auth.users)

**2. `ufs`** - Unidades Federativas
- `id` SERIAL PK, `sigla` TEXT, `nome` TEXT

**3. `aliquotas_transicao`** - Alíquotas de transição tributária
- `id` SERIAL PK, `ano` INTEGER, `aliquota_ibs` NUMERIC, `aliquota_cbs` NUMERIC

**4. `fornecedores`** - Fornecedores
- `id` SERIAL PK, `nome` TEXT, `perfil` TEXT, `uf_id` INTEGER (FK para ufs)

**5. `produtos`** - Produtos
- `id` SERIAL PK, `gtin` TEXT, `nome` TEXT, `categoria` TEXT, `perfil_fornecedor` TEXT

**6. `homepage_content`** - Conteúdo da homepage
- `id` UUID PK, `section` TEXT, `title` TEXT, `content` TEXT, `updated_at` TIMESTAMPTZ, `updated_by` UUID

**7. `features`** - Recursos/funcionalidades da homepage
- `id` UUID PK, `title` TEXT, `description` TEXT, `icon` TEXT, `order_number` INTEGER, `updated_at` TIMESTAMPTZ, `updated_by` UUID

**8. `cenarios`** - Cenários de simulação
- `id` SERIAL PK, `nome` TEXT, `descricao` TEXT, `ano_inicial` INTEGER, `ano_final` INTEGER, `reducao_ibs` NUMERIC

**9. `simulacoes`** - Simulações executadas
- `id` UUID PK, `cenario_id` INTEGER (FK para cenarios), `margem_desejada` NUMERIC, `preco_venda_ano` JSONB, `preco_compra_maximo` JSONB, `margem_liquida_ano` JSONB, `dados_enviados_n8n` JSONB, `resultados_n8n` JSONB, `data_execucao` TIMESTAMPTZ

**10. `implementation_plans`** - Planos de implementação
- `id` UUID PK, `user_id` UUID (NOT NULL), `company_name` TEXT, `created_at`/`updated_at` TIMESTAMPTZ

**11. `implementation_phases`** - Fases do plano
- `id` UUID PK, `plan_id` UUID (FK), `phase_number` INTEGER, `phase_name` TEXT, `phase_description` TEXT, dates, durations, `created_at` TIMESTAMPTZ

**12. `implementation_tasks`** - Tarefas das fases
- `id` UUID PK, `phase_id` UUID (FK), `task_name` TEXT, `task_description` TEXT, `is_completed` BOOLEAN, `priority` TEXT, `responsible` TEXT, `order_index` INTEGER, dates, hours, notes, `created_at` TIMESTAMPTZ

**13. `implementation_checkpoints`** - Checkpoints/OKRs
- `id` UUID PK, `phase_id` UUID (FK), `task_id` UUID, `checkpoint_name` TEXT, types, metrics, values, status, `order_index` INTEGER, `created_at`/`updated_at` TIMESTAMPTZ

**14. `implementation_progress_history`** - Histórico de progresso
- `id` UUID PK, `checkpoint_id` UUID (FK), `recorded_value` NUMERIC, `progress_percentage` NUMERIC, `notes` TEXT, `recorded_by` UUID, `recorded_at` TIMESTAMPTZ

### RLS Policies
- `admins`: SELECT para authenticated (verificar próprio ID)
- `aliquotas_transicao`, `ufs`, `produtos`, `fornecedores`: SELECT público; INSERT/UPDATE/DELETE para admins
- `homepage_content`, `features`: SELECT público; UPDATE/INSERT/DELETE para admins
- `cenarios`, `simulacoes`: SELECT/INSERT para authenticated
- `implementation_*`: Full CRUD para authenticated, filtrado por user_id

### Resultado Esperado
Todos os erros de build serão resolvidos pois as tabelas existirão no banco e os tipos serão regenerados automaticamente.

