'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  metric: {
    before: number;
    after: number;
    unit: string;
    label: string;
  };
  icon: string;
}

const OptimizationTimeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [lineLength, setLineLength] = useState(0);
  const controls = useAnimation();
  
  // Timeline data
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: 'Data Collection & Analysis',
      description: 'Comprehensive gathering and analysis of your current supply chain data to identify inefficiencies and bottlenecks.',
      metric: {
        before: 0,
        after: 100,
        unit: '%',
        label: 'Data Visibility'
      },
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      id: 2,
      title: 'Blockchain Architecture Design',
      description: 'Custom design of a blockchain architecture tailored to your specific supply chain requirements and integration points.',
      metric: {
        before: 27,
        after: 3,
        unit: ' days',
        label: 'Processing Time'
      },
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      id: 3,
      title: 'Smart Contract Implementation',
      description: 'Development and deployment of secure, audited smart contracts to automate critical business processes.',
      metric: {
        before: 43,
        after: 7,
        unit: '%',
        label: 'Error Rate'
      },
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    {
      id: 4,
      title: 'Integration & Testing',
      description: 'Seamless integration with existing systems and comprehensive testing to ensure reliability and performance.',
      metric: {
        before: 18,
        after: 92,
        unit: '%',
        label: 'System Reliability'
      },
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    },
    {
      id: 5,
      title: 'Deployment & Optimization',
      description: 'Full-scale deployment with ongoing monitoring and continuous optimization to maximize ROI and performance.',
      metric: {
        before: 2.1,
        after: 4.8,
        unit: 'x',
        label: 'ROI Multiplier'
      },
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ];

  // Initialize GSAP and ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize line length for animation
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
    
    // Parallax effect on floating elements
    if (timelineRef.current) {
      const floatingElements = timelineRef.current.querySelectorAll('[data-parallax]');
      
      floatingElements.forEach((element) => {
        const speed = element.getAttribute('data-parallax') || '0.1';
        
        gsap.to(element, {
          y: () => parseFloat(speed) * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      });
      
      // Set up timeline steps animations
      const timelineSteps = timelineRef.current.querySelectorAll('.timeline-step');
      
      timelineSteps.forEach((step, index) => {
        // Animate line to each step
        gsap.to(lineRef.current, {
          strokeDashoffset: lineLength - (lineLength * ((index + 1) / steps.length)),
          scrollTrigger: {
            trigger: step,
            start: 'top center',
            end: 'center center',
            scrub: 1,
            onEnter: () => {
              // Trigger the counter animation for this step
              const stepId = step.getAttribute('data-step-id');
              const counterEl = document.querySelector(`[data-counter="${stepId}"]`);
              if (counterEl) {
                counterEl.classList.add('animate-counter');
              }
            }
          }
        });
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [steps.length, lineLength]);

  // Counter animation component
  const Counter = ({ from, to, duration = 2, unit = '', decimals = 0 }: { from: number; to: number; duration?: number; unit?: string; decimals?: number }) => {
    const [count, setCount] = useState(from);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: false, amount: 0.5 });
    
    useEffect(() => {
      if (!isInView) return;
      
      let startTime: number;
      let animationFrame: number;
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const currentCount = from + progress * (to - from);
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [from, to, duration, isInView]);
    
    return (
      <span ref={nodeRef} className="inline-block">
        {decimals === 0 ? Math.floor(count) : count.toFixed(decimals)}
        {unit}
      </span>
    );
  };

  return (
    <section 
      ref={timelineRef}
      data-scroll-section
      className="relative py-24 px-6 md:px-16 overflow-hidden bg-white"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        data-parallax="0.05"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #32C8CD 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto">
        <div data-scroll-animation className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Optimization <span className="gradient-text">Process</span>
          </h2>
          <div className="h-1 w-24 bg-accent1 mx-auto"></div>
          <p className="mt-6 text-lg text-text/70 max-w-2xl mx-auto">
            Our systematic approach to transforming your supply chain with blockchain technology
          </p>
        </div>
        
        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 md:w-0.5 transform md:-translate-x-1/2 z-0">
            <svg 
              className="h-full w-full" 
              viewBox={`0 0 2 ${100 * steps.length}`}
              preserveAspectRatio="none"
            >
              <path
                ref={lineRef}
                d={`M1,0 L1,${100 * steps.length}`}
                stroke="url(#timeline-gradient)"
                strokeWidth="2"
                strokeDasharray={lineLength}
                strokeDashoffset={lineLength}
                fill="none"
              />
              <defs>
                <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#32C8CD" />
                  <stop offset="100%" stopColor="#9747FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Timeline steps */}
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                data-step-id={step.id}
                className={`timeline-step relative flex flex-col md:flex-row md:items-center mb-24 last:mb-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-accent1 z-20 flex items-center justify-center">
                  <motion.div 
                    className="w-4 h-4 rounded-full bg-accent1"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, amount: 0.8 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </div>
                
                {/* Content container */}
                <div className={`pl-12 md:pl-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'
                }`}>
                  <motion.div 
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Step number */}
                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                      <div className="text-6xl font-display font-bold text-accent1/10">
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-accent1/10 flex items-center justify-center mb-4">
                      <svg 
                        className="w-7 h-7 text-accent1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d={step.icon} 
                        />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-text/70 mb-6">{step.description}</p>
                    
                    {/* Metrics comparison */}
                    <div className="flex items-center">
                      <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium">
                        <span>Before: </span>
                        <Counter 
                          from={0} 
                          to={step.metric.before} 
                          unit={step.metric.unit} 
                          decimals={step.metric.before % 1 === 0 ? 0 : 1} 
                          data-counter={step.id}
                        />
                      </div>
                      <svg className="w-8 h-8 mx-2 text-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                      <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                        <span>After: </span>
                        <Counter 
                          from={0} 
                          to={step.metric.after} 
                          unit={step.metric.unit} 
                          decimals={step.metric.after % 1 === 0 ? 0 : 1}
                          data-counter={step.id}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-text/50">{step.metric.label}</div>
                  </motion.div>
                </div>
                
                {/* Floating decorative elements */}
                {index % 2 === 0 && (
                  <motion.div 
                    className="hidden md:block absolute left-[55%] top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none"
                    data-parallax={`0.${index + 1}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 0.2, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-32 h-32 rounded-full bg-accent2/30 blur-xl"></div>
                  </motion.div>
                )}
                
                {index % 2 !== 0 && (
                  <motion.div 
                    className="hidden md:block absolute right-[55%] top-1/2 transform -translate-y-1/2 opacity-20 pointer-events-none"
                    data-parallax={`-0.${index + 1}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 0.2, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-accent3/30 blur-xl"></div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Final result */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-6 py-3 bg-accent2/10 rounded-full text-accent2 font-medium">
            Result: <span className="font-bold">
              <Counter from={0} to={89} unit="%" decimals={0} /> Improvement in Overall Efficiency
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OptimizationTimeline; 