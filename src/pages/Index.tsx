
import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Timeline from '@/components/home/Timeline';
import CallToAction from '@/components/home/CallToAction';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16"> {/* Added padding-top to account for fixed header */}
        <Hero />
        <Features />
        <Timeline />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
