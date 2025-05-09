
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ServerIcon, BarChartIcon, TimerIcon, ArrowRightIcon } from 'lucide-react';

const ProcessandoSimulacao: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        // Limitamos a 95% para dar a impressão de que está aguardando o retorno
        if (prevProgress >= 95) {
          return 95;
        }
        return prevProgress + 5;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card className="p-8 mt-6">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="bg-blue-50 p-5 rounded-full">
          <ServerIcon size={48} className="text-blue-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-2">Processando sua simulação</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Seus dados estão sendo analisados pelo nosso serviço externo de cálculos.
            Este processo pode levar alguns segundos, por favor aguarde.
          </p>
        </div>
        
        <Progress value={progress} className="w-full max-w-md" />
        
        <p className="text-sm text-blue-600 font-medium">{progress >= 95 ? "Finalizando cálculos..." : "Processando dados..."}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <ArrowRightIcon className="text-blue-700 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Enviando dados</h4>
              <Skeleton className="h-2 w-full mt-2" />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <BarChartIcon className="text-amber-700 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Calculando cenários</h4>
              <Skeleton className="h-2 w-full mt-2" />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <TimerIcon className="text-green-700 h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Preparando resultados</h4>
              <Skeleton className="h-2 w-full mt-2" />
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 italic">
          Não feche esta página ou atualize o navegador enquanto o processamento estiver em andamento.
        </div>
      </div>
    </Card>
  );
};

export default ProcessandoSimulacao;
