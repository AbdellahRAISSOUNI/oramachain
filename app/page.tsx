'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmoothScroller from '../components/SmoothScroller';
import ScrollAnimations from '../components/ScrollAnimations';
import HeroSection from '../components/HeroSection';
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

        
        
        {/* CTA Section with typing animation and floating mockup */}
        <CtaSection />
        
        <Footer />
        
        <ScrollAnimations />
      </SmoothScroller>
    </>
  );
}
