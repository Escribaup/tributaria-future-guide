
import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Timeline from '@/components/home/Timeline';
import Testimonials from '@/components/home/Testimonials';
import LatestNews from '@/components/home/LatestNews';
import CallToAction from '@/components/home/CallToAction';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Timeline />
        <LatestNews />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
