'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
}

interface Statistic {
  id: number;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeQuote, setActiveQuote] = useState(0);
  
  // Scroll progress for the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to pattern shift values
  const patternX = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const patternY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const patternRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  
  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "OramaChain's blockchain solution reduced our inventory discrepancies by 94% and completely transformed our supply chain visibility. We now have real-time tracking across our entire operation.",
      author: "Sarah Johnson",
      position: "VP of Operations",
      company: "GlobalTech Industries",
      avatar: "/images/avatar1.jpg"
    },
    {
      id: 2,
      quote: "The implementation was seamless, and the ROI was immediate. Within three months, we saw a 27% reduction in logistics costs and a 40% improvement in delivery times.",
      author: "Michael Chen",
      position: "Chief Supply Chain Officer",
      company: "Nexus Logistics",
      avatar: "/images/avatar2.jpg"
    },
    {
      id: 3,
      quote: "Smart contracts have eliminated payment disputes with our suppliers. What used to take weeks to resolve now happens automatically. OramaChain has been transformative for our business.",
      author: "Elena Rodriguez",
      position: "Director of Procurement",
      company: "Vertex Manufacturing",
      avatar: "/images/avatar3.jpg"
    }
  ];
  
  // Statistics data
  const statistics: Statistic[] = [
    {
      id: 1,
      value: 94,
      label: "Average Reduction in Supply Chain Errors",
      suffix: "%"
    },
    {
      id: 2,
      value: 3.7,
      label: "Return on Investment Multiplier",
      decimals: 1,
      suffix: "x"
    },
    {
      id: 3,
      value: 68,
      label: "Reduction in Processing Time",
      suffix: "%"
    },
    {
      id: 4,
      value: 120,
      label: "Enterprise Clients Worldwide",
      prefix: "+"
    }
  ];

  // Initialize GSAP and ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Set up quote rotation
    if (quotesRef.current) {
      const quoteElements = quotesRef.current.querySelectorAll('.testimonial-quote');
      const totalQuotes = quoteElements.length;
      
      if (totalQuotes > 0) {
        // Create a ScrollTrigger for each quote
        quoteElements.forEach((quote, index) => {
          ScrollTrigger.create({
            trigger: quote,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveQuote(index),
            onEnterBack: () => setActiveQuote(index)
          });
        });
      }
    }
    
    // Set up progress bars animation
    if (progressBarRef.current) {
      const progressBars = progressBarRef.current.querySelectorAll('.progress-bar');
      
      progressBars.forEach((bar) => {
        const percent = bar.getAttribute('data-percent');
        
        if (percent) {
          gsap.to(bar, {
            width: percent,
            scrollTrigger: {
              trigger: bar,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1
            }
          });
        }
      });
    }
    
    // Set up pattern movement
    if (sectionRef.current) {
      const patterns = sectionRef.current.querySelectorAll('.bg-pattern');
      
      patterns.forEach((pattern, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        
        gsap.to(pattern, {
          x: `${direction * 30}px`,
          y: `${-direction * 20}px`,
          rotation: direction * 5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Counter animation component
  const Counter = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: false, amount: 0.5 });
    
    useEffect(() => {
      if (!isInView) return;
      
      let startTime: number;
      let animationFrame: number;
      const duration = 2; // seconds
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        const currentCount = progress * value;
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [isInView, value]);
    
    return (
      <span ref={nodeRef} className="inline-block">
        {prefix}{decimals === 0 ? Math.floor(count) : count.toFixed(decimals)}{suffix}
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef}
      data-scroll-section
      className="relative py-24 px-6 md:px-16 overflow-hidden bg-white"
    >
      {/* Background patterns */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02] bg-pattern pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #32C8CD 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          x: patternX,
          y: patternY,
          rotate: patternRotate
        }}
      />
      
      <motion.div 
        className="absolute inset-0 opacity-[0.02] bg-pattern pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #9747FF 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: '25px 25px',
          x: useTransform(scrollYProgress, [0, 1], [-30, 0]),
          y: useTransform(scrollYProgress, [0, 1], [20, 0]),
          rotate: useTransform(scrollYProgress, [0, 1], [-5, 0])
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div data-scroll-animation className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Client <span className="gradient-text">Success</span>
          </h2>
          <div className="h-1 w-24 bg-accent2 mx-auto"></div>
          <p className="mt-6 text-lg text-text/70 max-w-2xl mx-auto">
            Hear from our clients who have transformed their supply chains with OramaChain's blockchain solutions
          </p>
        </div>
        
        {/* Statistics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {statistics.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: stat.id * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                <Counter 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-sm text-text/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div ref={quotesRef} className="relative">
          {/* Progress bar indicators */}
          <div ref={progressBarRef} className="flex mb-12 space-x-2">
            {testimonials.map((_, index) => (
              <div 
                key={index}
                className="h-1 bg-gray-100 rounded-full flex-1 overflow-hidden"
              >
                <div 
                  className={`h-full progress-bar ${
                    index <= activeQuote ? 'bg-gradient-to-r from-accent2 to-accent3' : 'bg-transparent'
                  }`}
                  data-percent={index <= activeQuote ? '100%' : '0%'}
                />
              </div>
            ))}
          </div>
          
          {/* Testimonial quotes */}
          <div className="grid gap-16">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-quote ${index === activeQuote ? 'opacity-100' : 'opacity-70'}`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Quote */}
                  <motion.div 
                    className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                  >
                    {/* Quote mark */}
                    <div className="absolute -top-5 left-8 text-6xl text-accent2/10 font-serif">
                      "
                    </div>
                    
                    <p className="text-lg md:text-xl text-text/80 italic relative z-10">
                      {testimonial.quote}
                    </p>
                    
                    {/* Company logo placeholder */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="h-8 w-32 bg-gradient-to-r from-accent2/10 to-accent3/10 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-accent2/70">{testimonial.company}</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Author */}
                  <motion.div 
                    className="w-full md:w-64 flex-shrink-0 flex flex-col items-center text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent2/20 to-accent3/20 mb-4 overflow-hidden relative">
                      <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                        <span className="text-2xl font-bold text-accent2">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-lg">{testimonial.author}</h4>
                    <p className="text-sm text-text/60">{testimonial.position}</p>
                    <p className="text-xs text-accent2">{testimonial.company}</p>
                    
                    {/* Verification badge */}
                    <div className="mt-4 flex items-center text-xs text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified Client
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-8 py-4 rounded-full bg-accent2 text-white text-lg font-medium hover:bg-opacity-90 transition-all group"
          >
            Request Case Study
            <svg 
              className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 