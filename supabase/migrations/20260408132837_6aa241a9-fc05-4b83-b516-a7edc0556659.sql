
DROP POLICY "Authenticated insert cenarios" ON public.cenarios;
CREATE POLICY "Authenticated insert cenarios" ON public.cenarios FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY "Authenticated insert simulacoes" ON public.simulacoes;
CREATE POLICY "Authenticated insert simulacoes" ON public.simulacoes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
