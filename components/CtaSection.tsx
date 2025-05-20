'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

// Typing animation hook
const useTypingAnimation = (text: string, typingSpeed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    let i = 0;
    setDisplayText('');
    setIsComplete(false);
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(typingInterval);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [text, typingSpeed]);
  
  return { displayText, isComplete };
};

// Magnetic button component
const MagneticButton = ({ children, className = '', onClick }: { 
  children: React.ReactNode, 
  className?: string, 
  onClick?: () => void 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const moveButton = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = { x: e.clientX - centerX, y: e.clientY - centerY };
    const strength = 15; // Magnetic strength
    
    x.set(distance.x / strength);
    y.set(distance.y / strength);
  };
  
  const resetButton = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={moveButton}
      onMouseLeave={resetButton}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

const CtaSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  // Typing animation
  const { displayText, isComplete } = useTypingAnimation(
    "Transform your supply chain with OramaChain", 
    50
  );
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Parallax effect for mockup
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!mockupRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollYProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      
      // Limit the range to 0-1
      const clampedProgress = Math.min(Math.max(scrollYProgress, 0), 1);
      
      // Apply smooth parallax and rotation
      y.set(clampedProgress * -30); // Move up slightly as we scroll
      rotate.set(clampedProgress * 5 - 2.5); // Subtle rotation -2.5 to 2.5 degrees
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [y, rotate]);
  
  // Button hover animations
  const buttonVariants = {
    rest: { 
      background: 'linear-gradient(90deg, #2A3FFB, #9747FF)',
    },
    hover: { 
      background: 'linear-gradient(90deg, #3246FF, #A258FF)',
      scale: 1.03,
      boxShadow: '0 10px 30px rgba(42, 63, 251, 0.2), 0 6px 15px rgba(151, 71, 255, 0.1)',
    }
  };
  
  // Background particle animation
  const particlesRef = useRef<HTMLDivElement>(null);
  
  return (
    <section 
      ref={containerRef}
      data-scroll-section
      className="min-h-screen relative py-24 px-6 md:px-16 flex items-center overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-secondary/40 overflow-hidden">
        <div className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-accent1/5 to-accent2/10 blur-3xl -top-20 -left-20"></div>
        <div className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-accent3/5 to-accent2/10 blur-3xl -bottom-20 -right-20"></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #9747FF 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Left side - CTA Text & Button */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }
            }}
            className="flex flex-col"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">
              {displayText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block ml-1 w-[2px] h-8 md:h-10 bg-accent2 align-middle"
              />
            </h2>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isComplete ? '120px' : 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-1 bg-gradient-to-r from-accent2 to-accent3 mb-8"
            />
            
            <div className="text-lg text-text/70 max-w-md mb-12">
              Our premium platform connects your entire supply chain with unparalleled transparency, 
              security, and efficiency. Experience the future today.
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticButton 
                className="py-4 px-8 rounded-lg text-white font-medium shadow-lg"
              >
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className="absolute -inset-[1px] rounded-lg bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 10%, 0 10%)" }}
                />
                
                <span className="relative z-10">Get Started Now</span>
                
                <motion.div
                  className="absolute right-6 w-5 h-5 flex items-center justify-center z-10"
                  initial={{ x: 0, opacity: 0.7 }}
                  whileHover={{ x: 3, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33331 8H12.6666" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </MagneticButton>
              
              <MagneticButton className="py-4 px-8 rounded-lg text-accent2 font-medium bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100">
                <span className="relative z-10">Book a Demo</span>
              </MagneticButton>
            </div>
          </motion.div>
          
          {/* Right side - Floating Mockup */}
          <motion.div
            ref={mockupRef}
            className="relative"
            style={{ y, rotate }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0,
                transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
              } : { opacity: 0, y: 60 }}
              className="relative mx-auto max-w-[480px]"
            >
              {/* Platform mockup with glass effect */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                {/* Highlight reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10 pointer-events-none" />
                
                {/* Screenshot image */}
                <Image
                  src="/images/platform-mockup.svg" 
                  alt="OramaChain Platform"
                  width={600}
                  height={400}
                  className="w-full h-auto relative z-0"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' fill='%23F8F9FB'/%3E%3Cpath d='M300 180C300 191.046 291.046 200 280 200C268.954 200 260 191.046 260 180C260 168.954 268.954 160 280 160C291.046 160 300 168.954 300 180Z' fill='%2332C8CD'/%3E%3Cpath d='M320 180C320 191.046 328.954 200 340 200C351.046 200 360 191.046 360 180C360 168.954 351.046 160 340 160C328.954 160 320 168.954 320 180Z' fill='%232A3FFB'/%3E%3Cpath d='M310 220C310 231.046 301.046 240 290 240C278.954 240 270 231.046 270 220C270 208.954 278.954 200 290 200C301.046 200 310 208.954 310 220Z' fill='%239747FF'/%3E%3C/svg%3E";
                  }}
                />
                
                {/* Glass effect header */}
                <div className="absolute top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 z-20">
                  <div className="w-3 h-3 rounded-full bg-accent1 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200 mr-4"></div>
                  <div className="h-6 w-40 rounded-md bg-gray-100"></div>
                  <div className="ml-auto flex gap-2">
                    <div className="h-6 w-6 rounded-md bg-gray-100"></div>
                    <div className="h-6 w-6 rounded-md bg-gray-100"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements around mockup */}
              <motion.div
                className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-accent1/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#32C8CD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="w-10 h-10 rounded-full bg-accent2/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2A3FFB" strokeWidth="2"/>
                    <path d="M12 16V12" stroke="#2A3FFB" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8H12.01" stroke="#2A3FFB" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 