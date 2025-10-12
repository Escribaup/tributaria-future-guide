-- Create implementation_plans table
CREATE TABLE implementation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create implementation_phases table
CREATE TABLE implementation_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES implementation_plans(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  phase_name TEXT NOT NULL,
  phase_description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create implementation_tasks table
CREATE TABLE implementation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES implementation_phases(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  responsible TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE implementation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementation_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementation_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for implementation_plans
CREATE POLICY "Users can view their own plans"
  ON implementation_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plans"
  ON implementation_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans"
  ON implementation_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans"
  ON implementation_plans FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for implementation_phases
CREATE POLICY "Users can view phases of their plans"
  ON implementation_phases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM implementation_plans
      WHERE implementation_plans.id = implementation_phases.plan_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage phases of their plans"
  ON implementation_phases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM implementation_plans
      WHERE implementation_plans.id = implementation_phases.plan_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

-- RLS Policies for implementation_tasks
CREATE POLICY "Users can view tasks of their plans"
  ON implementation_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM implementation_phases
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_phases.id = implementation_tasks.phase_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks of their plans"
  ON implementation_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM implementation_phases
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_phases.id = implementation_tasks.phase_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_implementation_plans_user_id ON implementation_plans(user_id);
CREATE INDEX idx_implementation_phases_plan_id ON implementation_phases(plan_id);
CREATE INDEX idx_implementation_tasks_phase_id ON implementation_tasks(phase_id);
CREATE INDEX idx_implementation_tasks_completed ON implementation_tasks(is_completed);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_implementation_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_implementation_plans_updated_at
  BEFORE UPDATE ON implementation_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_implementation_plans_updated_at();