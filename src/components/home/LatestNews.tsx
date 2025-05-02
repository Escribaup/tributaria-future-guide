
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LatestNews = () => {
  const news = [{
    id: 1,
    title: "Aprovação da lei complementar que regulamenta a reforma tributária",
    summary: "O Congresso Nacional aprovou a lei que detalha as regras do IBS e da CBS, com foco em simplificar o sistema tributário brasileiro.",
    date: "15/04/2025",
    image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Legislação"
  }, {
    id: 2,
    title: "Como o setor de serviços será impactado pela reforma tributária",
    summary: "Análise detalhada sobre as mudanças para empresas prestadoras de serviços com a implementação do IBS e suas alíquotas.",
    date: "03/04/2025",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Análise Setorial"
  }, {
    id: 3,
    title: "Empresas começam a se preparar para as mudanças tributárias de 2026",
    summary: "Pesquisa revela que 67% das grandes empresas já iniciaram projetos internos para adequação à primeira fase da reforma.",
    date: "28/03/2025",
    image: "https://images.unsplash.com/photo-1664575599730-0814817939de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Preparação"
  }];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Últimas Notícias</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fique por dentro das atualizações mais recentes sobre a reforma tributária e seus impactos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="object-cover w-full h-full" 
                  />
                </AspectRatio>
                <Badge className="absolute top-4 right-4 bg-primary">{item.category}</Badge>
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 line-clamp-3">{item.summary}</p>
              </CardContent>
              <CardFooter>
                <Link 
                  to="/"
                  className="text-primary font-medium inline-flex items-center hover:underline"
                >
                  Leia mais
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/"
            className="inline-flex items-center font-medium text-primary hover:underline"
          >
            Ver todas as notícias
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
