'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface SolutionCard {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const SolutionGallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  
  // Solutions data
  const solutions: SolutionCard[] = [
    {
      id: 1,
      title: 'Supply Chain Tracking',
      description: 'Real-time visibility across your entire supply chain with immutable blockchain records.',
      icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z M16 16V6a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1h-8a1 1 0 01-1-1z'
    },
    {
      id: 2,
      title: 'Smart Contracts',
      description: 'Automate business logic with secure, transparent, and tamper-proof smart contracts.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      id: 3,
      title: 'Asset Tokenization',
      description: 'Convert real-world assets into digital tokens with fractional ownership capabilities.',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
      id: 4,
      title: 'Decentralized Identity',
      description: 'Self-sovereign identity solutions that put users in control of their personal data.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      id: 5,
      title: 'Enterprise Integration',
      description: 'Seamlessly integrate blockchain solutions with existing enterprise systems.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ];

  // Mouse position for gradient effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  // Set up horizontal scroll with GSAP
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const calculateWidths = () => {
      if (containerRef.current && cardsRef.current.length > 0) {
        const cardEl = cardsRef.current[0];
        if (cardEl) {
          const newCardWidth = cardEl.offsetWidth + 40; // card width + gap
          setCardWidth(newCardWidth);
          setContainerWidth(newCardWidth * solutions.length);
        }
      }
    };
    
    calculateWidths();
    window.addEventListener('resize', calculateWidths);
    
    // Set up horizontal scroll
    if (galleryRef.current && containerRef.current) {
      const galleryWidth = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      
      const scrollTween = gsap.to(containerRef.current, {
        x: () => -galleryWidth,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top top",
          end: () => `+=${galleryWidth}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Calculate which card is active based on scroll progress
            const progress = self.progress;
            const newActiveCard = Math.min(
              solutions.length - 1,
              Math.floor(progress * solutions.length)
            );
            setActiveCard(newActiveCard);
          }
        }
      });
      
      return () => {
        scrollTween.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        window.removeEventListener('resize', calculateWidths);
      };
    }
    
    return () => {
      window.removeEventListener('resize', calculateWidths);
    };
  }, [solutions.length]);

  // Spring animation for smooth card movement
  const x = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(x, springConfig);

  return (
    <section 
      data-scroll-section
      className="relative min-h-screen bg-white overflow-hidden"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        data-scroll-parallax="0.1"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #2A3FFB 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-16">
        <div data-scroll-animation className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Our <span className="gradient-text">Solutions</span>
          </h2>
          <div className="h-1 w-24 bg-accent2 mx-auto"></div>
          <p className="mt-6 text-lg text-text/70 max-w-2xl mx-auto">
            Explore our premium blockchain modules designed to transform your business with next-generation technology.
          </p>
        </div>
        
        {/* Horizontal scrolling gallery */}
        <div 
          ref={galleryRef}
          className="relative min-h-[600px]"
          data-scroll-animation
        >
          {/* Card indicators */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-6 z-10">
            {solutions.map((_, index) => (
              <motion.div 
                key={`indicator-${index}`}
                className="w-2 h-2 rounded-full bg-accent2/30"
                animate={{
                  scale: activeCard === index ? 1.5 : 1,
                  backgroundColor: activeCard === index ? 'rgba(42, 63, 251, 0.8)' : 'rgba(42, 63, 251, 0.3)'
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          
          {/* Cards container */}
          <motion.div
            ref={containerRef}
            className="flex gap-10 py-10"
            style={{ 
              width: `${containerWidth}px`,
            }}
            onMouseMove={handleMouseMove}
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                  return undefined;
                }}
                className="relative flex-shrink-0 w-[340px] h-[460px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 flex flex-col"
                animate={{
                  scale: activeCard === index ? 1.05 : 0.95,
                  opacity: Math.abs(activeCard - index) > 1 ? 0.6 : 1,
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                {/* Gradient highlight that follows mouse */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(42, 63, 251, 0.3), transparent 50%)`,
                  }}
                />
                
                {/* Card content */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-accent2/10 flex items-center justify-center mb-6">
                    <svg 
                      className="w-8 h-8 text-accent2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d={solution.icon} 
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                  <p className="text-text/70">{solution.description}</p>
                </div>
                
                <div className="mt-auto">
                  <div className="h-[1px] w-full bg-gray-100 mb-6"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/50">Module {solution.id}</span>
                    <motion.button 
                      className="w-10 h-10 rounded-full bg-accent2/10 flex items-center justify-center text-accent2"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(42, 63, 251, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                {/* Subtle border highlight */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{
                    boxShadow: activeCard === index 
                      ? '0 0 0 2px rgba(42, 63, 251, 0.3), 0 20px 40px rgba(0, 0, 0, 0.1)' 
                      : '0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 30px rgba(0, 0, 0, 0.05)'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll hint */}
        <motion.div 
          className="flex items-center justify-center mt-10 text-text/50 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Scroll to explore all solutions</span>
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionGallery; 