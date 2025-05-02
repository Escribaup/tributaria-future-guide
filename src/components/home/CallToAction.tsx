
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { MessageSquarePlus } from 'lucide-react';

const CallToAction = () => {
  const [ctaContent, setCtaContent] = useState<{
    title: string;
    content: string;
  }>({
    title: 'Prepare-se para o futuro tributário do Brasil',
    content: 'Acesse nosso guia completo e tenha uma visão clara sobre como a reforma tributária afetará seu negócio.'
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCtaContent = async () => {
      try {
        const { data, error } = await supabase
          .from('homepage_content')
          .select('title, content')
          .eq('section', 'callToAction')
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // No rows returned
            console.error('Erro ao buscar conteúdo do CTA:', error);
          }
          return;
        }
        
        if (data) {
          setCtaContent({
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

    fetchCtaContent();
  }, []);

  return (
    <section className="section-padding bg-gradient-to-r from-idvl-blue-dark to-idvl-blue-light text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {loading ? (
            <>
              <div className="h-10 bg-white/20 rounded w-3/4 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-6 bg-white/20 rounded w-5/6 mx-auto mb-8 animate-pulse"></div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {ctaContent.title}
              </h2>
              <p className="text-xl mb-8 text-white/90">
                {ctaContent.content}
              </p>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/guia-completo"
              className="bg-white text-idvl-blue-dark hover:bg-opacity-90 transition-all px-8 py-4 rounded-md font-semibold text-lg"
            >
              Acessar o Guia Completo
            </Link>
            <a
              href="https://wa.me/41996946641"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-all px-8 py-4 rounded-md font-semibold text-lg flex items-center gap-2"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Fale com um Especialista
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
