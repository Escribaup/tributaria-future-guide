

## Plano: Habilitar Auto-Confirmação de Email (opcional para teste)

O fluxo de autenticação está funcionando corretamente. O único bloqueio é que o email precisa ser confirmado antes do login funcionar.

### Opção 1: Habilitar auto-confirm (para facilitar testes)
- Usar a ferramenta `cloud--configure_auth` para habilitar `autoconfirm` nos signups por email
- Isso permitirá que novos registros façam login imediatamente sem confirmar o email
- **Não recomendado para produção** pois reduz a segurança

### Opção 2: Manter como está (recomendado para produção)
- O fluxo está correto e seguro
- Usuários devem confirmar o email antes de fazer login
- Verificar a caixa de entrada do email `comercial@idvl.com.br` para o link de confirmação

### Problemas adicionais encontrados
- A descrição do registro diz "Crie uma nova conta de administrador" — isso é enganoso, deveria dizer algo como "Crie uma nova conta" já que usuários comuns também se registram
- Não há dados nas tabelas de referência (UFs, alíquotas, cenários) — o simulador e outras funcionalidades que dependem desses dados não vão funcionar até os dados serem inseridos

### Próximos passos recomendados
1. Decidir se quer habilitar auto-confirm ou manter confirmação por email
2. Inserir dados iniciais nas tabelas (UFs, alíquotas de transição, cenários)
3. Configurar um usuário como admin na tabela `admins`

