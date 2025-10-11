-- Add reducao_ibs column to cenarios table
ALTER TABLE public.cenarios 
ADD COLUMN IF NOT EXISTS reducao_ibs numeric;