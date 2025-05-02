
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "A consultoria da IDVL nos ajudou a navegar pela reforma tributária com confiança. As análises personalizadas e recomendações foram essenciais para nossa preparação.",
      name: "Carlos Silva",
      position: "CFO, Empresa de Tecnologia",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "O material educativo e as ferramentas disponibilizadas pela IDVL simplificaram conceitos complexos da reforma tributária, permitindo que nosso time entendesse as mudanças rapidamente.",
      name: "Ana Costa",
      position: "Diretora Financeira, Varejo",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Com a orientação da IDVL, conseguimos não apenas nos adaptar à reforma, mas também identificar oportunidades estratégicas que surgiram com as novas regras.",
      name: "Roberto Mendes",
      position: "CEO, Indústria de Alimentos",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-idvl-blue-dark mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-idvl-text-light text-lg max-w-3xl mx-auto">
            Conheça as experiências de quem já conta com nossa expertise para navegar pela reforma tributária.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Quotes */}
          <div className="bg-idvl-gray rounded-xl shadow-md p-6 md:p-10 mb-8">
            <svg className="w-12 h-12 text-idvl-blue-light opacity-30 mb-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zM28 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"></path>
            </svg>

            <div className="overflow-hidden">
              <div 
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                <div className="flex">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index} 
                      className="w-full flex-shrink-0"
                      style={{ paddingLeft: index > 0 ? '100%' : 0 }}
                    >
                      <p className="text-xl md:text-2xl text-idvl-text-dark mb-8 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-idvl-blue-light hover:text-white transition-colors"
                aria-label="Anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"></path></svg>
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-idvl-blue-light hover:text-white transition-colors"
                aria-label="Próximo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"></path></svg>
              </button>
            </div>
          </div>

          {/* Author Information */}
          <div className="flex justify-center">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={cn(
                  "flex flex-col items-center transition-all duration-300 mx-2",
                  activeIndex === index ? "opacity-100 scale-100" : "opacity-50 scale-90"
                )}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 object-cover transition-all duration-300",
                    activeIndex === index ? "border-idvl-blue-light" : "border-white"
                  )}
                />
                <div className={cn(
                  "text-center mt-3 transition-all duration-300",
                  activeIndex === index ? "block" : "hidden md:block"
                )}>
                  <h4 className="font-bold text-idvl-blue-dark">{testimonial.name}</h4>
                  <p className="text-sm text-idvl-text-light">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
