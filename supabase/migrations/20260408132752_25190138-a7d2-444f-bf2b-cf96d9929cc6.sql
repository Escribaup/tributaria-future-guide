
-- 1. Admins table
CREATE TABLE public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE id = _user_id
  )
$$;

CREATE POLICY "Users can check own admin status" ON public.admins
  FOR SELECT TO authenticated USING (id = auth.uid());

-- 2. UFs table
CREATE TABLE public.ufs (
  id SERIAL PRIMARY KEY,
  sigla TEXT NOT NULL,
  nome TEXT NOT NULL
);
ALTER TABLE public.ufs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ufs" ON public.ufs FOR SELECT USING (true);
CREATE POLICY "Admins manage ufs" ON public.ufs FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 3. Aliquotas transicao
CREATE TABLE public.aliquotas_transicao (
  id SERIAL PRIMARY KEY,
  ano INTEGER NOT NULL,
  aliquota_ibs NUMERIC NOT NULL DEFAULT 0,
  aliquota_cbs NUMERIC NOT NULL DEFAULT 0
);
ALTER TABLE public.aliquotas_transicao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read aliquotas" ON public.aliquotas_transicao FOR SELECT USING (true);
CREATE POLICY "Admins manage aliquotas" ON public.aliquotas_transicao FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 4. Fornecedores
CREATE TABLE public.fornecedores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  perfil TEXT,
  uf_id INTEGER REFERENCES public.ufs(id)
);
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fornecedores" ON public.fornecedores FOR SELECT USING (true);
CREATE POLICY "Admins manage fornecedores" ON public.fornecedores FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5. Produtos
CREATE TABLE public.produtos (
  id SERIAL PRIMARY KEY,
  gtin TEXT NOT NULL DEFAULT '',
  nome TEXT NOT NULL,
  categoria TEXT DEFAULT '',
  perfil_fornecedor TEXT DEFAULT ''
);
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read produtos" ON public.produtos FOR SELECT USING (true);
CREATE POLICY "Admins manage produtos" ON public.produtos FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 6. Homepage content
CREATE TABLE public.homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read homepage_content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins manage homepage_content" ON public.homepage_content FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 7. Features
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT '',
  order_number INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read features" ON public.features FOR SELECT USING (true);
CREATE POLICY "Admins manage features" ON public.features FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 8. Cenarios
CREATE TABLE public.cenarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ano_inicial INTEGER DEFAULT 2026,
  ano_final INTEGER DEFAULT 2033,
  reducao_ibs NUMERIC DEFAULT 0
);
ALTER TABLE public.cenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cenarios" ON public.cenarios FOR SELECT USING (true);
CREATE POLICY "Authenticated insert cenarios" ON public.cenarios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage cenarios" ON public.cenarios FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 9. Simulacoes
CREATE TABLE public.simulacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cenario_id INTEGER REFERENCES public.cenarios(id),
  margem_desejada NUMERIC DEFAULT 0,
  preco_venda_ano JSONB,
  preco_compra_maximo JSONB,
  margem_liquida_ano JSONB,
  dados_enviados_n8n JSONB,
  resultados_n8n JSONB,
  data_execucao TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read simulacoes" ON public.simulacoes FOR SELECT USING (true);
CREATE POLICY "Authenticated insert simulacoes" ON public.simulacoes FOR INSERT TO authenticated WITH CHECK (true);

-- 10. Implementation plans
CREATE TABLE public.implementation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.implementation_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plans" ON public.implementation_plans FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 11. Implementation phases
CREATE TABLE public.implementation_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.implementation_plans(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL DEFAULT 1,
  phase_name TEXT NOT NULL DEFAULT '',
  phase_description TEXT,
  start_date DATE,
  end_date DATE,
  target_year INTEGER,
  target_month INTEGER,
  actual_start_date DATE,
  actual_end_date DATE,
  estimated_duration_days INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.implementation_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own phases" ON public.implementation_phases FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.implementation_plans p WHERE p.id = plan_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.implementation_plans p WHERE p.id = plan_id AND p.user_id = auth.uid()));

-- 12. Implementation tasks
CREATE TABLE public.implementation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES public.implementation_phases(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL DEFAULT '',
  task_description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  priority TEXT NOT NULL DEFAULT 'medium',
  responsible TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  target_year INTEGER,
  target_month INTEGER,
  target_date DATE,
  actual_start_date DATE,
  actual_completion_date DATE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  planning_notes TEXT,
  completion_notes TEXT,
  challenges_faced TEXT,
  lessons_learned TEXT,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.implementation_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON public.implementation_tasks FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.implementation_phases ph
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE ph.id = phase_id AND p.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.implementation_phases ph
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE ph.id = phase_id AND p.user_id = auth.uid()
  ));

-- 13. Implementation checkpoints
CREATE TABLE public.implementation_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES public.implementation_phases(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.implementation_tasks(id) ON DELETE SET NULL,
  checkpoint_name TEXT NOT NULL DEFAULT '',
  checkpoint_description TEXT,
  checkpoint_type TEXT NOT NULL DEFAULT 'milestone',
  metric_name TEXT,
  metric_unit TEXT,
  target_value NUMERIC,
  current_value NUMERIC NOT NULL DEFAULT 0,
  baseline_value NUMERIC,
  target_date DATE,
  achieved_date DATE,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress_percentage NUMERIC NOT NULL DEFAULT 0,
  responsible TEXT,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.implementation_checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own checkpoints" ON public.implementation_checkpoints FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.implementation_phases ph
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE ph.id = phase_id AND p.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.implementation_phases ph
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE ph.id = phase_id AND p.user_id = auth.uid()
  ));

-- 14. Implementation progress history
CREATE TABLE public.implementation_progress_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkpoint_id UUID NOT NULL REFERENCES public.implementation_checkpoints(id) ON DELETE CASCADE,
  recorded_value NUMERIC NOT NULL DEFAULT 0,
  progress_percentage NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  recorded_by UUID,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.implementation_progress_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress history" ON public.implementation_progress_history FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.implementation_checkpoints cp
    JOIN public.implementation_phases ph ON ph.id = cp.phase_id
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE cp.id = checkpoint_id AND p.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.implementation_checkpoints cp
    JOIN public.implementation_phases ph ON ph.id = cp.phase_id
    JOIN public.implementation_plans p ON p.id = ph.plan_id
    WHERE cp.id = checkpoint_id AND p.user_id = auth.uid()
  ));
