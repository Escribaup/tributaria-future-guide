
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
        // Add error handling for supabase queries
        const aliquotasRes = await supabase.from('aliquotas_transicao').select('*').order('ano');
        if (aliquotasRes.error) {
          throw new Error(`Erro ao buscar alíquotas: ${aliquotasRes.error.message}`);
        }
        
        let cenariosRes;
        if (userId) {
          cenariosRes = await supabase.from('cenarios').select('*');
          if (cenariosRes.error) {
            throw new Error(`Erro ao buscar cenários: ${cenariosRes.error.message}`);
          }
          setCenarios(cenariosRes.data || []);
        } else {
          setCenarios([]);
        }
        
        setAliquotas(aliquotasRes.data || []);
      } catch (error: any) {
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
