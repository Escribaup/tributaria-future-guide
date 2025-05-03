
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [heroContent, setHeroContent] = useState<{
    title: string;
    content: string;
  }>({
    title: 'Desvende a Reforma Tributária e Prepare seu Futuro',
    content: 'Navegue com confiança pelas mudanças tributárias com nossa orientação especializada e ferramentas exclusivas.'
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('title, content')
          .eq('section', 'hero')
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // No rows returned
            console.error('Erro ao buscar conteúdo do hero:', error);
          }
          return;
        }
        
        if (data) {
          setHeroContent({
            title: data.title,
            content: data.content
          });
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-idvl-blue-dark to-idvl-blue-light py-16 md:py-24 overflow-hidden">
      {/* Background image with overlay effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-idvl-blue-dark via-idvl-blue-dark/90 to-idvl-blue-light/80"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-white">
            {loading ? (
              <>
                <div className="h-12 bg-white/20 rounded w-3/4 mb-6 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-5/6 mb-8 animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
                  {heroContent.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {heroContent.content}
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/guia-completo" className="bg-white text-idvl-blue-dark hover:bg-opacity-90 transition-all px-8 py-4 rounded-md font-semibold text-lg">
                Comece Aqui
              </Link>
              <a 
                href="https://wa.me/41996946641" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-all px-8 py-4 rounded-md font-semibold text-lg"
              >
                Fale Conosco
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-idvl-blue-light/10 mix-blend-overlay rounded-xl"></div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-idvl-blue-light/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-idvl-blue-dark/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract shapes background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-20 -left-20 bg-white rounded-full w-64 h-64"></div>
        <div className="absolute top-40 right-10 bg-white rounded-full w-32 h-32"></div>
        <div className="absolute bottom-10 left-1/4 bg-white rounded-full w-48 h-48"></div>
      </div>
    </section>
  );
};

export default Hero;
