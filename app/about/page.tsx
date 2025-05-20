'use client';

import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SmoothScroller from '../../components/SmoothScroller';
import ScrollAnimations from '../../components/ScrollAnimations';
import CustomCursor from '../../components/CustomCursor';

export default function About() {
  return (
    <>
      <CustomCursor />
      <SmoothScroller>
        <Header />
        
        {/* About Hero Section */}
        <section 
          data-scroll-section 
          className="min-h-screen relative flex items-center justify-center pt-24"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                About <span className="gradient-text">OramaChain</span>
              </h1>
              <div className="h-1 w-24 bg-accent2"></div>
            </div>
            
            <div data-scroll-animation className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">
                  OramaChain is a revolutionary blockchain platform combining cutting-edge AI with secure distributed ledger technology. Our mission is to make blockchain technology accessible, efficient, and valuable for businesses of all sizes.
                </p>
                <p className="text-lg mb-6">
                  Founded in 2023, we've quickly established ourselves as innovators in the blockchain space with our premium, user-focused approach to decentralized solutions.
                </p>
                <p className="text-lg">
                  Our team brings together experts in blockchain, AI, cybersecurity, and enterprise software to create a truly transformative platform.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center">
                  <div className="text-6xl font-display font-bold gradient-text">OC</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Company Vision Section */}
        <section 
          data-scroll-section 
          className="min-h-screen flex items-center justify-center bg-secondary"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Our <span className="gradient-text">Vision</span>
              </h2>
              <div className="h-1 w-24 bg-accent3"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Pushing the boundaries of what's possible with blockchain technology through continuous innovation and research."
                },
                {
                  title: "Accessibility",
                  description: "Making advanced blockchain technology accessible to businesses of all sizes with intuitive interfaces and clear documentation."
                },
                {
                  title: "Security",
                  description: "Maintaining the highest standards of security and transparency in all our blockchain solutions and implementations."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  data-scroll-animation
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-accent1/10 flex items-center justify-center mb-6">
                    <span className="text-accent1 text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-text/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Footer />
        
        <ScrollAnimations />
      </SmoothScroller>
    </>
  );
} 