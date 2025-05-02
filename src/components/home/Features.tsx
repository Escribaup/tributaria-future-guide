
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PieChart, CheckSquare, FileText, Info, BarChart, Bell, Users, Calculator, Settings, Database, Globe, HelpCircle, Shield, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Features = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('features').select('*').order('order_number');
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
  const iconComponents: {
    [key: string]: React.ReactNode;
  } = {
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
    Star: <Star className="h-10 w-10 text-idvl-blue-dark" />
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
            {[1, 2, 3, 4, 5].map(index => (
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

  // Se não estiver carregando mas não há features, retornar uma mensagem alternativa
  if (features.length === 0) {
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
          <div className="text-center">
            <p className="text-lg text-idvl-text-light">
              Em breve, novos recursos estarão disponíveis.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Se tiver features, renderizar normalmente
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
          {features.map((feature) => (
            <div key={feature.id} className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
              {iconComponents[feature.icon] || <Info className="h-10 w-10 text-idvl-blue-dark" />}
              <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-idvl-text-light mb-4">{feature.description}</p>
              {feature.link && (
                <Link to={feature.link} className="text-idvl-blue-light hover:underline font-medium inline-flex items-center">
                  Saiba mais
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
