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
  return;
};
export default LatestNews;