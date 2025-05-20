'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const SupplyChainSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const redPathRef = useRef<SVGPathElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const [pathLength, setPathLength] = useState(0);
  const [redPathLength, setRedPathLength] = useState(0);
  
  // Stats data
  const stats = [
    { value: '43%', label: 'Supply Chain Inefficiency', delay: 0.2 },
    { value: '27 Days', label: 'Average Delivery Delay', delay: 0.4 },
    { value: '$4.2M', label: 'Annual Revenue Loss', delay: 0.6 },
  ];

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize path lengths for animation
    if (pathRef.current && redPathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
      setRedPathLength(redPathRef.current.getTotalLength());
    }
    
    // Parallax effect on elements
    if (sectionRef.current) {
      const parallaxElements = sectionRef.current.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute('data-parallax') || '0.1';
        
        gsap.to(element, {
          y: () => parseFloat(speed) * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
          }
        });
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // SVG path animation variants
  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };
  
  // Red path animation (inefficiency highlight)
  const redPathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut",
        delay: 2.5
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      data-scroll-section
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        data-parallax="0.05"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #9747FF 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto w-full h-full grid md:grid-cols-2 gap-0">
        {/* Left side - Problem statement */}
        <div className="flex flex-col justify-center p-6 md:p-16">
          <div data-scroll-animation className="mb-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              The <span className="gradient-text">Problem</span>
            </h2>
            <div className="h-1 w-24 bg-accent2"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg md:text-xl text-text/80 mb-6">
              Traditional supply chains suffer from opacity, inefficiency, and lack of real-time tracking, leading to:
            </p>
            
            <ul className="space-y-4 text-text/70">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start"
              >
                <span className="inline-block mr-3 mt-1 w-5 h-5 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
                  <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                </span>
                <span>Significant delays in product delivery and distribution</span>
              </motion.li>
              
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-start"
              >
                <span className="inline-block mr-3 mt-1 w-5 h-5 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
                  <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                </span>
                <span>Inability to track products in real-time across the supply chain</span>
              </motion.li>
              
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-start"
              >
                <span className="inline-block mr-3 mt-1 w-5 h-5 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center">
                  <span className="block w-2 h-2 rounded-full bg-red-500"></span>
                </span>
                <span>Lack of transparency leading to trust issues between stakeholders</span>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Floating stats that appear on scroll */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: stat.delay }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                data-parallax={`0.${index + 1}`}
              >
                <div className="text-2xl md:text-3xl font-bold text-accent2">{stat.value}</div>
                <div className="text-xs md:text-sm text-text/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Right side - Animated SVG */}
        <div className="flex items-center justify-center p-6 md:p-16 relative">
          <div 
            className="w-full h-full max-w-lg"
            data-scroll-animation
          >
            <svg 
              ref={svgRef}
              viewBox="0 0 500 500" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0px 5px 15px rgba(0,0,0,0.05))' }}
            >
              {/* Factory icon */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <rect x="50" y="150" width="60" height="60" rx="5" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="60" y="170" width="10" height="20" fill="#1A1A2E" />
                <rect x="80" y="170" width="10" height="20" fill="#1A1A2E" />
                <polygon points="50,150 80,130 110,150" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="75" y="110" width="10" height="20" fill="#1A1A2E" />
              </motion.g>
              
              {/* Warehouse icon */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <rect x="220" y="100" width="70" height="50" rx="5" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="245" y="130" width="20" height="20" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="230" y="110" width="50" height="10" fill="#1A1A2E" opacity="0.1" />
              </motion.g>
              
              {/* Distribution center */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <rect x="370" y="200" width="80" height="60" rx="5" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="380" y="210" width="60" height="10" fill="#1A1A2E" opacity="0.1" />
                <rect x="380" y="230" width="60" height="10" fill="#1A1A2E" opacity="0.1" />
              </motion.g>
              
              {/* Retail store */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <rect x="220" y="320" width="60" height="50" rx="5" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <polygon points="220,320 250,290 280,320" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <rect x="245" y="350" width="10" height="20" fill="#1A1A2E" />
              </motion.g>
              
              {/* Customer */}
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <circle cx="80" cy="350" r="30" fill="#F8F9FB" stroke="#1A1A2E" strokeWidth="2" />
                <circle cx="80" cy="335" r="10" fill="#1A1A2E" opacity="0.2" />
                <path d="M60,365 Q80,380 100,365" stroke="#1A1A2E" strokeWidth="2" fill="none" />
              </motion.g>
              
              {/* Main path - supply chain route */}
              <motion.path
                ref={pathRef}
                d="M110,180 C150,180 180,120 220,120 L290,120 C330,120 350,180 370,200 L410,230 C440,260 400,300 370,300 C340,300 300,320 280,320 L250,320 C220,320 180,350 110,350"
                fill="none"
                stroke="#2A3FFB"
                strokeWidth="3"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength}
                variants={pathVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />
              
              {/* Red path - inefficiency highlight */}
              <motion.path
                ref={redPathRef}
                d="M290,120 C330,120 350,180 370,200 L410,230"
                fill="none"
                stroke="#FF3A29"
                strokeWidth="4"
                strokeDasharray={redPathLength}
                strokeDashoffset={redPathLength}
                variants={redPathVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />
              
              {/* Inefficiency marker */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 3 }}
              >
                <circle cx="370" cy="200" r="15" fill="#FF3A29" opacity="0.2" />
                <circle cx="370" cy="200" r="8" fill="#FF3A29" opacity="0.4" />
                <text x="370" y="200" textAnchor="middle" dominantBaseline="middle" fill="#FF3A29" fontSize="12" fontWeight="bold">!</text>
              </motion.g>
              
              {/* Animated dots along the path */}
              <motion.circle
                cx="0" cy="0" r="5" fill="#2A3FFB"
                animate={{
                  offsetDistance: ['0%', '100%'],
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 2,
                }}
                style={{
                  offsetPath: `path("M110,180 C150,180 180,120 220,120 L290,120 C330,120 350,180 370,200 L410,230 C440,260 400,300 370,300 C340,300 300,320 280,320 L250,320 C220,320 180,350 110,350")`,
                }}
              />
            </svg>
          </div>
          
          {/* Floating info boxes */}
          <motion.div
            className="absolute top-1/4 right-8 bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-xs max-w-[120px]"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 3.5 }}
            data-parallax="-0.1"
          >
            <div className="font-bold text-red-500">Bottleneck</div>
            <div className="text-text/70">Warehouse to distribution delay</div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/4 left-1/4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-xs max-w-[120px]"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 3.8 }}
            data-parallax="0.15"
          >
            <div className="font-bold text-accent2">Solution</div>
            <div className="text-text/70">Blockchain tracking improves visibility</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainSection; 