
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
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
            Últimas Notícias
          </h2>
          <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
            Fique atualizado com as últimas informações sobre a reforma tributária.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="w-full h-48 relative">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover" 
                  />
                </AspectRatio>
                <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                  {item.category}
                </Badge>
              </div>
              
              <CardContent className="pt-6">
                <div className="flex items-center text-sm text-idvl-text-light mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-idvl-blue-dark">
                  {item.title}
                </h3>
                <p className="text-idvl-text-light">
                  {item.summary}
                </p>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Link 
                  to="/guia-completo" 
                  className="text-green-600 font-medium hover:text-green-700 transition flex items-center"
                >
                  Ler mais
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/guia-completo" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
          >
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
