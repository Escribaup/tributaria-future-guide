-- Add temporal fields to implementation_phases
ALTER TABLE implementation_phases
ADD COLUMN target_year INTEGER,
ADD COLUMN target_month INTEGER CHECK (target_month >= 1 AND target_month <= 12),
ADD COLUMN actual_start_date DATE,
ADD COLUMN actual_end_date DATE,
ADD COLUMN estimated_duration_days INTEGER;

-- Add temporal and descriptive fields to implementation_tasks
ALTER TABLE implementation_tasks
ADD COLUMN target_year INTEGER,
ADD COLUMN target_month INTEGER CHECK (target_month >= 1 AND target_month <= 12),
ADD COLUMN target_date DATE,
ADD COLUMN actual_start_date DATE,
ADD COLUMN actual_completion_date DATE,
ADD COLUMN estimated_hours NUMERIC(10,2),
ADD COLUMN actual_hours NUMERIC(10,2),
ADD COLUMN planning_notes TEXT,
ADD COLUMN completion_notes TEXT,
ADD COLUMN challenges_faced TEXT,
ADD COLUMN lessons_learned TEXT,
ADD COLUMN attachments JSONB;

-- Create implementation_checkpoints table
CREATE TABLE implementation_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES implementation_phases(id) ON DELETE CASCADE,
  task_id UUID REFERENCES implementation_tasks(id) ON DELETE CASCADE,
  
  checkpoint_name TEXT NOT NULL,
  checkpoint_description TEXT,
  checkpoint_type TEXT CHECK (checkpoint_type IN ('objective', 'key_result', 'milestone')) DEFAULT 'key_result',
  
  metric_name TEXT,
  metric_unit TEXT,
  target_value NUMERIC(10,2),
  current_value NUMERIC(10,2) DEFAULT 0,
  baseline_value NUMERIC(10,2),
  
  target_date DATE,
  achieved_date DATE,
  
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'achieved', 'at_risk', 'blocked')) DEFAULT 'not_started',
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  
  responsible TEXT,
  notes TEXT,
  
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkpoints_phase_id ON implementation_checkpoints(phase_id);
CREATE INDEX idx_checkpoints_task_id ON implementation_checkpoints(task_id);
CREATE INDEX idx_checkpoints_status ON implementation_checkpoints(status);
CREATE INDEX idx_checkpoints_target_date ON implementation_checkpoints(target_date);

ALTER TABLE implementation_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view checkpoints of their plans"
  ON implementation_checkpoints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM implementation_phases
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_phases.id = implementation_checkpoints.phase_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage checkpoints of their plans"
  ON implementation_checkpoints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM implementation_phases
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_phases.id = implementation_checkpoints.phase_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_checkpoints_updated_at
  BEFORE UPDATE ON implementation_checkpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create implementation_progress_history table
CREATE TABLE implementation_progress_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkpoint_id UUID NOT NULL REFERENCES implementation_checkpoints(id) ON DELETE CASCADE,
  
  recorded_value NUMERIC(10,2) NOT NULL,
  progress_percentage NUMERIC(5,2) NOT NULL,
  notes TEXT,
  
  recorded_by UUID,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_progress_history_checkpoint_id ON implementation_progress_history(checkpoint_id);
CREATE INDEX idx_progress_history_recorded_at ON implementation_progress_history(recorded_at);

ALTER TABLE implementation_progress_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view progress history of their checkpoints"
  ON implementation_progress_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM implementation_checkpoints
      JOIN implementation_phases ON implementation_phases.id = implementation_checkpoints.phase_id
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_checkpoints.id = implementation_progress_history.checkpoint_id
      AND implementation_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add progress history to their checkpoints"
  ON implementation_progress_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM implementation_checkpoints
      JOIN implementation_phases ON implementation_phases.id = implementation_checkpoints.phase_id
      JOIN implementation_plans ON implementation_plans.id = implementation_phases.plan_id
      WHERE implementation_checkpoints.id = implementation_progress_history.checkpoint_id
      AND implementation_plans.user_id = auth.uid()
    )
  );