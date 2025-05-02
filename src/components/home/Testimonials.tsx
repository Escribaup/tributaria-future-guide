
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [{
    quote: "A consultoria da IDVL nos ajudou a navegar pela reforma tributária com confiança. As análises personalizadas e recomendações foram essenciais para nossa preparação.",
    name: "Carlos Silva",
    position: "CFO, Empresa de Tecnologia",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }, {
    quote: "O material educativo e as ferramentas disponibilizadas pela IDVL simplificaram conceitos complexos da reforma tributária, permitindo que nosso time entendesse as mudanças rapidamente.",
    name: "Ana Costa",
    position: "Diretora Financeira, Varejo",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }, {
    quote: "Com a orientação da IDVL, conseguimos não apenas nos adaptar à reforma, mas também identificar oportunidades estratégicas que surgiram com as novas regras.",
    name: "Roberto Mendes",
    position: "CEO, Indústria de Alimentos",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }];
  
  const nextSlide = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="bg-idvl-blue-dark py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-idvl-blue-light text-lg max-w-3xl mx-auto opacity-80">
            Empresas de diversos setores confiam em nossa expertise para navegar pela reforma tributária.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="testimonial-slider overflow-hidden">
            <div 
              className="transition-all duration-500 flex"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((item, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-idvl-blue text-center p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                      <svg className="w-12 h-12 text-green-400 opacity-50 mx-auto" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M10 8c-2.2 0-4 1.8-4 4v10c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4v-6.172l4.414-4.414c0.375-0.375 0.586-0.884 0.586-1.414v-2c0-1.105-0.895-2-2-2h-2c-0.53 0-1.039 0.211-1.414 0.586l-4.586 4.586v-3.172c0-2.2-1.8-4-4-4h-10zM10 10h10c1.105 0 2 0.895 2 2v8c0 1.105-0.895 2-2 2h-10c-1.105 0-2-0.895-2-2v-8c0-1.105 0.895-2 2-2zM23 10h1c0.265 0 0.52 0.105 0.707 0.293l2 2c0.188 0.188 0.293 0.442 0.293 0.707v1c0 0.265-0.105 0.52-0.293 0.707l-2 2c-0.188 0.188-0.442 0.293-0.707 0.293h-1c-0.552 0-1-0.448-1-1v-4c0-0.552 0.448-1 1-1z"></path>
                      </svg>
                    </div>
                    
                    <p className="text-xl italic mb-8">"{item.quote}"</p>
                    
                    <div className="flex items-center justify-center">
                      <Avatar className="h-14 w-14 border-2 border-green-500">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 text-left">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-green-400">{item.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={prevSlide}
              className="bg-idvl-blue hover:bg-idvl-blue-light text-white p-3 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    activeIndex === index 
                      ? "bg-green-500 w-6" 
                      : "bg-idvl-blue hover:bg-idvl-blue-light"
                  )}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSlide}
              className="bg-idvl-blue hover:bg-idvl-blue-light text-white p-3 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
