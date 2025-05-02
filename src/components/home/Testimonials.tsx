
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
    <section className="py-20 bg-white">
      <div className="container-custom max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Que Dizem Nossos Clientes</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Veja como ajudamos empresas de diversos setores a se prepararem para a reforma tributária
          </p>
        </div>

        <div className="relative">
          <div className="bg-gray-50 rounded-xl p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-8">
                <Avatar className="h-20 w-20 border-4 border-white shadow">
                  <AvatarImage src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} />
                  <AvatarFallback>{testimonials[activeIndex].name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <blockquote className="text-center mb-6">
                <p className="text-xl italic text-gray-700 mb-4">"{testimonials[activeIndex].quote}"</p>
                <footer>
                  <div className="font-semibold text-gray-900">{testimonials[activeIndex].name}</div>
                  <div className="text-sm text-gray-500">{testimonials[activeIndex].position}</div>
                </footer>
              </blockquote>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "h-3 w-3 rounded-full transition-all duration-300",
                    idx === activeIndex ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Ver depoimento ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex justify-between absolute top-1/2 left-0 right-0 -mx-4 transform -translate-y-1/2">
            <button
              onClick={prevSlide}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
              aria-label="Depoimento anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
              aria-label="Próximo depoimento"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
