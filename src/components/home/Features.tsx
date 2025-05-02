
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, PieChart, CheckSquare, FileText, Info, 
  BarChart, Bell, Users, Calculator, Settings,
  Database, Globe, HelpCircle, Shield, Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Features = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('order_number');
          
        if (error) {
          console.error('Erro ao buscar recursos:', error);
          return;
        }
        
        setFeatures(data || []);
      } catch (error) {
        console.error('Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Map de ícones para componentes
  const iconComponents: { [key: string]: React.ReactNode } = {
    BookOpen: <BookOpen className="h-10 w-10 text-idvl-blue-dark" />,
    PieChart: <PieChart className="h-10 w-10 text-idvl-blue-dark" />,
    CheckSquare: <CheckSquare className="h-10 w-10 text-idvl-blue-dark" />,
    FileText: <FileText className="h-10 w-10 text-idvl-blue-dark" />,
    Info: <Info className="h-10 w-10 text-idvl-blue-dark" />,
    BarChart: <BarChart className="h-10 w-10 text-idvl-blue-dark" />,
    Bell: <Bell className="h-10 w-10 text-idvl-blue-dark" />,
    Users: <Users className="h-10 w-10 text-idvl-blue-dark" />,
    Calculator: <Calculator className="h-10 w-10 text-idvl-blue-dark" />,
    Settings: <Settings className="h-10 w-10 text-idvl-blue-dark" />,
    Database: <Database className="h-10 w-10 text-idvl-blue-dark" />,
    Globe: <Globe className="h-10 w-10 text-idvl-blue-dark" />,
    HelpCircle: <HelpCircle className="h-10 w-10 text-idvl-blue-dark" />,
    Shield: <Shield className="h-10 w-10 text-idvl-blue-dark" />,
    Star: <Star className="h-10 w-10 text-idvl-blue-dark" />,
  };

  // Renderizar um placeholder durante o carregamento
  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
              Navegue pela Reforma Tributária
            </h2>
            <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
              Utilize nossos recursos para entender e se adaptar às mudanças da reforma tributária brasileira.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="rounded-xl p-6 shadow-md bg-gray-50 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
            Navegue pela Reforma Tributária
          </h2>
          <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
            Utilize nossos recursos para entender e se adaptar às mudanças da reforma tributária brasileira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const iconKey = feature.icon as keyof typeof iconComponents;
            const icon = iconComponents[iconKey] || iconComponents.Info;
            
            return (
              <div 
                key={feature.id || index}
                className="rounded-xl p-6 shadow-md transition-transform hover:-translate-y-1 bg-blue-50 border border-gray-100"
              >
                <div className="mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-idvl-blue-dark mb-2">{feature.title}</h3>
                <p className="text-idvl-text-light mb-4">{feature.description}</p>
                <Link 
                  to="/guia-completo"
                  className="text-idvl-blue-dark font-medium flex items-center hover:underline"
                >
                  Saiba mais
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-1"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
