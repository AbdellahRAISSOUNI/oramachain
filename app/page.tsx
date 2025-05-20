'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmoothScroller from '../components/SmoothScroller';
import ScrollAnimations from '../components/ScrollAnimations';
import HeroSection from '../components/HeroSection';
import CustomCursor from '../components/CustomCursor';
import SupplyChainSection from '../components/SupplyChainSection';
import SolutionGallery from '../components/SolutionGallery';
import OptimizationTimeline from '../components/OptimizationTimeline';
import BeforeAfterCarousel from '../components/BeforeAfterCarousel';
import TestimonialsSection from '../components/TestimonialsSection';
import TechStackGrid from '../components/TechStackGrid';
import CtaSection from '../components/CtaSection';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <SmoothScroller>
        <Header />
        
        {/* Hero Section with scroll attributes */}
        <section data-scroll-section>
          <HeroSection />
        </section>

        {/* Supply Chain Problem Section */}
        <SupplyChainSection />
        
        {/* Solutions Gallery Section */}
        <SolutionGallery />
        
        {/* Tech Stack Grid Section */}
        <TechStackGrid />
        
        {/* Optimization Timeline Section */}
        <OptimizationTimeline />
        
        {/* Before/After Comparison Carousel */}
        <BeforeAfterCarousel />
        
        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Add a section with pin effect */}
        <section 
          data-scroll-section 
          className="min-h-screen flex items-center justify-center bg-secondary"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Premium <span className="gradient-text">Features</span>
              </h2>
              <div className="h-1 w-24 bg-accent2"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  data-scroll-animation
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-accent1/10 flex items-center justify-center mb-6">
                    <span className="text-accent1 text-xl font-bold">{item}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Feature Title</h3>
                  <p className="text-text/70">
                    Premium feature description with clean, minimal text that explains the value proposition.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add a section with parallax effect */}
        <section 
          data-scroll-section 
          className="min-h-screen relative flex items-center justify-center overflow-hidden"
        >
          <div 
            data-scroll-parallax="0.2" 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #9747FF 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          ></div>
          
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16 relative z-10">
            <div data-scroll-animation className="mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Why <span className="gradient-text">OramaChain</span>?
              </h2>
              <div className="h-1 w-24 bg-accent3"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div data-scroll-animation className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Premium Experience</h3>
                  <p className="text-text/70">
                    OramaChain delivers a premium blockchain experience with intuitive design and powerful features.
                  </p>
                </div>
                
                <div data-scroll-animation className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Solutions</h3>
                  <p className="text-text/70">
                    Our AI technology enhances blockchain functionality with predictive analytics and smart automation.
                  </p>
                </div>
                
                <div data-scroll-animation>
                  <h3 className="text-2xl font-bold mb-4">Enterprise Ready</h3>
                  <p className="text-text/70">
                    Built for modern enterprises with scalability, security, and performance at its core.
                  </p>
                </div>
              </div>
              
              <div 
                data-scroll-animation
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <Image
                      src="/logo/logo-icon-dark-transparent.png"
                      alt="OramaChain"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/logo.svg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section with typing animation and floating mockup */}
        <CtaSection />
        
        <Footer />
        
        <ScrollAnimations />
      </SmoothScroller>
    </>
  );
}
