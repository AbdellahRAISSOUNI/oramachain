'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface MetricCard {
  label: string;
  before: string;
  after: string;
  improvement: string;
  unit: string;
}

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  metrics: MetricCard[];
}

const BeforeAfterCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealPercentage, setRevealPercentage] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock data for carousel slides
  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: 'Warehouse Management',
      description: 'Blockchain-powered inventory tracking provides real-time visibility and eliminates manual reconciliation processes.',
      beforeImage: '/images/warehouse-before.jpg', // These are placeholder paths
      afterImage: '/images/warehouse-after.jpg',
      metrics: [
        {
          label: 'Inventory Accuracy',
          before: '76',
          after: '99.8',
          improvement: '31.3',
          unit: '%'
        },
        {
          label: 'Stock Verification Time',
          before: '24',
          after: '3',
          improvement: '87.5',
          unit: 'hours'
        },
        {
          label: 'Manual Audits',
          before: '12',
          after: '1',
          improvement: '91.7',
          unit: 'per month'
        }
      ]
    },
    {
      id: 2,
      title: 'Logistics Tracking',
      description: 'End-to-end shipment visibility with immutable tracking records and automated customs documentation.',
      beforeImage: '/images/logistics-before.jpg',
      afterImage: '/images/logistics-after.jpg',
      metrics: [
        {
          label: 'Delivery Time',
          before: '8.2',
          after: '5.4',
          improvement: '34.1',
          unit: 'days'
        },
        {
          label: 'Documentation Errors',
          before: '14',
          after: '0.3',
          improvement: '97.9',
          unit: '%'
        },
        {
          label: 'Real-time Tracking',
          before: '22',
          after: '100',
          improvement: '354.5',
          unit: '%'
        }
      ]
    },
    {
      id: 3,
      title: 'Supplier Management',
      description: 'Smart contracts automate supplier agreements, payments, and quality assurance processes.',
      beforeImage: '/images/supplier-before.jpg',
      afterImage: '/images/supplier-after.jpg',
      metrics: [
        {
          label: 'Payment Processing',
          before: '14',
          after: '1',
          improvement: '92.9',
          unit: 'days'
        },
        {
          label: 'Dispute Resolution',
          before: '27',
          after: '3',
          improvement: '88.9',
          unit: 'days'
        },
        {
          label: 'Compliance Rate',
          before: '82',
          after: '99',
          improvement: '20.7',
          unit: '%'
        }
      ]
    }
  ];
  
  // Handle slider drag
  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    
    let clientX: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    
    setRevealPercentage(percentage);
  };
  
  // Initialize GSAP and ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      // Create a scroll trigger for the container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        onEnter: () => {
          // Animate the reveal slider when entering viewport
          gsap.fromTo(
            [() => setRevealPercentage(0)],
            { progress: 0 },
            {
              progress: 1,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => {
                setRevealPercentage(gsap.utils.interpolate(0, 50, gsap.getProperty({}, 'progress') as number));
              }
            }
          );
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentSlide]);

  // Generate mock image URLs based on slide ID
  const getImageUrl = (isAfter: boolean, slideId: number) => {
    // In a real implementation, these would be actual image paths
    // For now, we'll use colored gradients as placeholders
    const beforeColors = ['#f0f4f8', '#e2e8f0', '#edf2f7'];
    const afterColors = ['#ebf8ff', '#e6fffa', '#faf5ff'];
    
    const colorIndex = (slideId - 1) % 3;
    const color = isAfter ? afterColors[colorIndex] : beforeColors[colorIndex];
    
    return `linear-gradient(45deg, ${color}, white)`;
  };

  return (
    <section 
      ref={containerRef}
      data-scroll-section
      className="relative py-24 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div data-scroll-animation className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Transformation <span className="gradient-text">Results</span>
          </h2>
          <div className="h-1 w-24 bg-accent3 mx-auto"></div>
          <p className="mt-6 text-lg text-text/70 max-w-2xl mx-auto">
            See the dramatic improvements in supply chain performance with OramaChain's blockchain solutions
          </p>
        </div>
      </div>
      
      {/* Full-width carousel */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
              {/* Before image (base layer) */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: getImageUrl(false, slides[currentSlide].id),
                  backgroundSize: 'cover'
                }}
              >
                {/* Mockup elements for "before" state */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-4xl h-64 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <div className="ml-4 text-text/50 text-sm">Legacy System</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="h-24 bg-gray-200 rounded mb-6"></div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="mt-auto flex justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-red-100"></div>
                        <div className="ml-2 text-sm text-red-500">Multiple Errors Detected</div>
                      </div>
                      <div className="text-sm text-text/50">Last updated: 27 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* After image (revealed layer) */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: getImageUrl(true, slides[currentSlide].id),
                  backgroundSize: 'cover',
                  clipPath: `polygon(0 0, ${revealPercentage}% 0, ${revealPercentage}% 100%, 0 100%)`
                }}
              >
                {/* Mockup elements for "after" state */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-4xl h-64 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 flex flex-col border border-accent2/10">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 rounded-full bg-accent1 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-accent2 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-accent3"></div>
                      <div className="ml-4 text-accent2 text-sm font-medium">OramaChain Dashboard</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-8 bg-accent2/10 rounded flex items-center justify-center text-sm text-accent2 font-medium">Real-time Data</div>
                      <div className="h-8 bg-accent1/10 rounded flex items-center justify-center text-sm text-accent1 font-medium">100% Accuracy</div>
                      <div className="h-8 bg-accent3/10 rounded flex items-center justify-center text-sm text-accent3 font-medium">AI Optimized</div>
                    </div>
                    
                    <div className="h-24 bg-gradient-to-r from-accent2/5 to-accent3/5 rounded mb-6 flex items-center justify-center">
                      <div className="text-lg font-medium text-accent2">Blockchain-Verified Supply Chain</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-6 bg-green-100 rounded flex items-center justify-center text-xs text-green-700">Verified</div>
                      <div className="h-6 bg-green-100 rounded flex items-center justify-center text-xs text-green-700">Compliant</div>
                      <div className="h-6 bg-green-100 rounded flex items-center justify-center text-xs text-green-700">Secure</div>
                      <div className="h-6 bg-green-100 rounded flex items-center justify-center text-xs text-green-700">Optimized</div>
                    </div>
                    
                    <div className="mt-auto flex justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-2 text-sm text-green-500">All Systems Operational</div>
                      </div>
                      <div className="text-sm text-accent2">Last updated: Just now</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slider control */}
              <div 
                ref={sliderRef}
                className="absolute inset-0 cursor-ew-resize"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleDrag}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleDrag}
              >
                {/* Slider line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                  style={{ left: `${revealPercentage}%` }}
                >
                  {/* Slider handle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex space-x-1">
                      <svg className="w-4 h-4 text-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <svg className="w-4 h-4 text-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Before/After labels */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
                <div className="absolute top-4 right-4 bg-accent2 text-white px-3 py-1 rounded-full text-sm font-medium">
                  After
                </div>
              </div>
            </div>
            
            {/* Slide content */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <div>
                  <h3 className="text-3xl font-display font-bold mb-2">{slides[currentSlide].title}</h3>
                  <p className="text-text/70 max-w-xl">{slides[currentSlide].description}</p>
                </div>
                
                <div className="flex mt-6 md:mt-0">
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-2 hover:bg-accent2/5 transition-colors"
                  >
                    <svg className="w-5 h-5 text-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-accent2/5 transition-colors"
                  >
                    <svg className="w-5 h-5 text-accent2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Metric cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {slides[currentSlide].metrics.map((metric, index) => (
                  <motion.div
                    key={`${currentSlide}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="text-sm text-text/50 mb-2">{metric.label}</div>
                    
                    <div className="flex items-end space-x-4 mb-4">
                      <div>
                        <div className="text-xs text-text/50 mb-1">Before</div>
                        <div className="text-2xl font-bold text-red-500">{metric.before}{metric.unit}</div>
                      </div>
                      
                      <svg className="w-6 h-6 text-accent2 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 12h16" />
                      </svg>
                      
                      <div>
                        <div className="text-xs text-text/50 mb-1">After</div>
                        <div className="text-2xl font-bold text-green-500">{metric.after}{metric.unit}</div>
                      </div>
                    </div>
                    
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent2 to-accent3"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <div className="bg-accent2/10 text-accent2 text-xs font-medium px-2 py-1 rounded-full">
                        {metric.improvement}% Improvement
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide indicators */}
        <div className="flex justify-center mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full mx-1 transition-all ${
                currentSlide === index ? 'bg-accent2 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterCarousel; 