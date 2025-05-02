import { useState } from 'react';
import { cn } from '@/lib/utils';
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
  return;
};
export default Testimonials;