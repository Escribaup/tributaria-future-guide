-- Fix infinite recursion in RLS policies for admins table
-- This migration updates the is_admin function to check the admins table instead of profiles

-- 1. Replace the is_admin function (without dropping it to avoid dependency issues)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = user_id
  );
$$;

-- 2. Drop and recreate the problematic policy on admins table
DROP POLICY IF EXISTS "Admins can view all admin accounts" ON public.admins;

CREATE POLICY "Admins can view all admin accounts"
  ON public.admins
  FOR SELECT
  TO public
  USING (public.is_admin(auth.uid()));

-- 3. Update aliquotas_transicao policies
DROP POLICY IF EXISTS "Allow update for admins" ON public.aliquotas_transicao;
CREATE POLICY "Allow update for admins"
  ON public.aliquotas_transicao
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow delete for admins" ON public.aliquotas_transicao;
CREATE POLICY "Allow delete for admins"
  ON public.aliquotas_transicao
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Allow write for admins" ON public.aliquotas_transicao;
CREATE POLICY "Allow write for admins"
  ON public.aliquotas_transicao
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. Add performance index
CREATE INDEX IF NOT EXISTS idx_admins_id ON public.admins(id);