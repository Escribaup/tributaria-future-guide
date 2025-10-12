export interface ImplementationPlan {
  id: string;
  user_id: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export interface ImplementationPhase {
  id: string;
  plan_id: string;
  phase_number: number;
  phase_name: string;
  phase_description: string | null;
  start_date: string | null;
  end_date: string | null;
  target_year: number | null;
  target_month: number | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  estimated_duration_days: number | null;
  created_at: string;
  tasks?: ImplementationTask[];
  checkpoints?: ImplementationCheckpoint[];
}

export interface ImplementationCheckpoint {
  id: string;
  phase_id: string;
  task_id: string | null;
  checkpoint_name: string;
  checkpoint_description: string | null;
  checkpoint_type: 'objective' | 'key_result' | 'milestone';
  metric_name: string | null;
  metric_unit: string | null;
  target_value: number | null;
  current_value: number;
  baseline_value: number | null;
  target_date: string | null;
  achieved_date: string | null;
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'blocked';
  progress_percentage: number;
  responsible: string | null;
  notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ImplementationProgressHistory {
  id: string;
  checkpoint_id: string;
  recorded_value: number;
  progress_percentage: number;
  notes: string | null;
  recorded_by: string | null;
  recorded_at: string;
}

export interface ImplementationTask {
  id: string;
  phase_id: string;
  task_name: string;
  task_description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  priority: 'high' | 'medium' | 'low';
  responsible: string | null;
  order_index: number;
  target_year: number | null;
  target_month: number | null;
  target_date: string | null;
  actual_start_date: string | null;
  actual_completion_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  planning_notes: string | null;
  completion_notes: string | null;
  challenges_faced: string | null;
  lessons_learned: string | null;
  attachments: any | null;
  created_at: string;
  checkpoints?: ImplementationCheckpoint[];
}

export type PhaseStatus = 'pending' | 'in-progress' | 'completed';

export interface PhaseWithProgress extends ImplementationPhase {
  progress: number;
  status: PhaseStatus;
  target_year: number | null;
  target_month: number | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  estimated_duration_days: number | null;
  checkpoints?: ImplementationCheckpoint[];
}

export interface PlanWithPhases extends ImplementationPlan {
  phases: PhaseWithProgress[];
  overallProgress: number;
}

export interface TimelineEvent {
  id: string;
  type: 'phase' | 'task' | 'checkpoint';
  name: string;
  year: number;
  month: number;
  date?: string;
  status: string;
  entity: ImplementationPhase | ImplementationTask | ImplementationCheckpoint;
}

export interface MonthlyTimeline {
  year: number;
  month: number;
  monthName: string;
  events: TimelineEvent[];
}

export const DEFAULT_PHASES_TEMPLATE = [
  {
    phase_number: 1,
    phase_name: "Diagnóstico e Planejamento",
    phase_description: "Análise inicial e mapeamento do cenário atual da empresa",
    tasks: [
      { task_name: "Mapear produtos e serviços atuais", priority: "high" as const, order_index: 1 },
      { task_name: "Identificar regime tributário atual de cada produto", priority: "high" as const, order_index: 2 },
      { task_name: "Analisar cadeia de suprimentos e fornecedores", priority: "medium" as const, order_index: 3 },
      { task_name: "Mapear todas as operações interestaduais", priority: "medium" as const, order_index: 4 },
      { task_name: "Avaliar impacto nos preços de venda", priority: "high" as const, order_index: 5 },
      { task_name: "Revisar contratos comerciais vigentes", priority: "medium" as const, order_index: 6 },
    ]
  },
  {
    phase_number: 2,
    phase_name: "Capacitação e Treinamento",
    phase_description: "Preparação da equipe para as mudanças da reforma tributária",
    tasks: [
      { task_name: "Treinar equipe fiscal sobre IBS e CBS", priority: "high" as const, order_index: 1 },
      { task_name: "Capacitar equipe de TI para mudanças sistêmicas", priority: "high" as const, order_index: 2 },
      { task_name: "Educar equipe comercial sobre novos impostos", priority: "medium" as const, order_index: 3 },
      { task_name: "Workshops sobre créditos tributários", priority: "medium" as const, order_index: 4 },
      { task_name: "Treinamento em compliance da reforma", priority: "high" as const, order_index: 5 },
    ]
  },
  {
    phase_number: 3,
    phase_name: "Adequação de Sistemas",
    phase_description: "Atualização dos sistemas para atender aos novos requisitos",
    tasks: [
      { task_name: "Atualizar ERP para IBS/CBS", priority: "high" as const, order_index: 1 },
      { task_name: "Implementar sistema de split payment", priority: "high" as const, order_index: 2 },
      { task_name: "Configurar emissão de notas fiscais eletrônicas", priority: "high" as const, order_index: 3 },
      { task_name: "Integrar com SEFAZ para IBS", priority: "high" as const, order_index: 4 },
      { task_name: "Testar cálculos tributários automatizados", priority: "medium" as const, order_index: 5 },
      { task_name: "Criar dashboards de monitoramento fiscal", priority: "low" as const, order_index: 6 },
    ]
  },
  {
    phase_number: 4,
    phase_name: "Revisão de Processos",
    phase_description: "Adequação dos processos internos aos novos requisitos",
    tasks: [
      { task_name: "Revisar processo de precificação", priority: "high" as const, order_index: 1 },
      { task_name: "Ajustar política de descontos e promoções", priority: "medium" as const, order_index: 2 },
      { task_name: "Atualizar fluxo de aprovação de propostas", priority: "medium" as const, order_index: 3 },
      { task_name: "Revisar processo de devolução/troca", priority: "low" as const, order_index: 4 },
      { task_name: "Adequar processo de importação/exportação", priority: "medium" as const, order_index: 5 },
      { task_name: "Atualizar políticas de garantia", priority: "low" as const, order_index: 6 },
    ]
  },
  {
    phase_number: 5,
    phase_name: "Simulação e Testes",
    phase_description: "Testes e validações antes da implementação final",
    tasks: [
      { task_name: "Realizar simulações com dados reais", priority: "high" as const, order_index: 1 },
      { task_name: "Testar cenários de transição (2026-2033)", priority: "high" as const, order_index: 2 },
      { task_name: "Validar cálculos de IBS e CBS", priority: "high" as const, order_index: 3 },
      { task_name: "Testar integração com fornecedores", priority: "medium" as const, order_index: 4 },
      { task_name: "Simular fechamento fiscal", priority: "high" as const, order_index: 5 },
      { task_name: "Ajustar processos conforme resultados", priority: "medium" as const, order_index: 6 },
    ]
  },
  {
    phase_number: 6,
    phase_name: "Implementação e Go-Live",
    phase_description: "Implementação final e acompanhamento inicial",
    tasks: [
      { task_name: "Implementar mudanças em ambiente de produção", priority: "high" as const, order_index: 1 },
      { task_name: "Comunicar clientes sobre mudanças", priority: "high" as const, order_index: 2 },
      { task_name: "Ativar novos processos fiscais", priority: "high" as const, order_index: 3 },
      { task_name: "Monitorar primeiras operações", priority: "high" as const, order_index: 4 },
      { task_name: "Ajustes finos pós-implementação", priority: "medium" as const, order_index: 5 },
      { task_name: "Documentar lições aprendidas", priority: "low" as const, order_index: 6 },
    ]
  },
];
