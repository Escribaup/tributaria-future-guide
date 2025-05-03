
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  AliquotaTransicao, 
  CenarioSimulacao 
} from '@/types/simulador';

export const useSimuladorData = (userId: string | undefined) => {
  const [aliquotas, setAliquotas] = useState<AliquotaTransicao[]>([]);
  const [cenarios, setCenarios] = useState<CenarioSimulacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const [aliquotasRes, cenariosRes] = await Promise.all([
          supabase.from('aliquotas_transicao').select('*').order('ano'),
          userId ? supabase.from('cenarios').select('*') : { data: [] }
        ]);
        
        setAliquotas(aliquotasRes.data || []);
        setCenarios(cenariosRes.data || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações necessárias para o simulador."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, [userId]);

  return {
    aliquotas,
    cenarios,
    loading
  };
};
