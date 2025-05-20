'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence, Variants } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Technology {
  id: string;
  name: string;
  category: 'blockchain' | 'integration' | 'security' | 'analytics';
  description: string;
  logo: string;
  color: string;
}

const TechStackGrid = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(gridRef, { once: false, amount: 0.2 });
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const controls = useAnimation();
  
  // Tech stack data
  const technologies: Technology[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      category: 'blockchain',
      description: 'Smart contracts foundation with industry-leading security and decentralization',
      logo: '/images/tech/ethereum.svg',
      color: '#627EEA'
    },
    {
      id: 'solana',
      name: 'Solana',
      category: 'blockchain',
      description: 'High-throughput blockchain optimized for enterprise scalability',
      logo: '/images/tech/solana.svg',
      color: '#14F195'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      category: 'blockchain',
      description: 'Layer-2 scaling solution providing cost-effective transactions',
      logo: '/images/tech/polygon.svg',
      color: '#8247E5'
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'integration',
      description: 'Cloud infrastructure supporting our enterprise-grade deployments',
      logo: '/images/tech/aws.svg',
      color: '#FF9900'
    },
    {
      id: 'azure',
      name: 'Azure',
      category: 'integration',
      description: 'Microsoft cloud integration for enterprise compatibility',
      logo: '/images/tech/azure.svg',
      color: '#0078D4'
    },
    {
      id: 'terraform',
      name: 'Terraform',
      category: 'integration',
      description: 'Infrastructure as code for consistent deployment across environments',
      logo: '/images/tech/terraform.svg',
      color: '#7B42BC'
    },
    {
      id: 'zero_knowledge',
      name: 'Zero Knowledge',
      category: 'security',
      description: 'Privacy-preserving cryptographic proofs for sensitive data',
      logo: '/images/tech/zero_knowledge.svg',
      color: '#9747FF'
    },
    {
      id: 'hashicorp_vault',
      name: 'Hashicorp Vault',
      category: 'security',
      description: 'Secure secret management and encryption',
      logo: '/images/tech/hashicorp_vault.svg',
      color: '#000000'
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      category: 'analytics',
      description: 'Machine learning model deployment for predictive analytics',
      logo: '/images/tech/tensorflow.svg',
      color: '#FF6F00'
    },
    {
      id: 'spark',
      name: 'Apache Spark',
      category: 'analytics',
      description: 'Big data processing for supply chain insights',
      logo: '/images/tech/spark.svg',
      color: '#E25A1C'
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      category: 'integration',
      description: 'Efficient API queries for flexible data retrieval',
      logo: '/images/tech/graphql.svg',
      color: '#E535AB'
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      category: 'integration',
      description: 'Container orchestration for reliability and scalability',
      logo: '/images/tech/kubernetes.svg',
      color: '#326CE5'
    }
  ];

  // Handle image load status
  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleImageError = (id: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [id]: false
    }));
  };

  // Define relationships between technologies
  const connections = [
    { from: 'ethereum', to: 'zero_knowledge' },
    { from: 'ethereum', to: 'graphql' },
    { from: 'solana', to: 'kubernetes' },
    { from: 'polygon', to: 'aws' },
    { from: 'aws', to: 'terraform' },
    { from: 'azure', to: 'terraform' },
    { from: 'azure', to: 'hashicorp_vault' },
    { from: 'kubernetes', to: 'aws' },
    { from: 'kubernetes', to: 'azure' },
    { from: 'tensorflow', to: 'spark' },
    { from: 'spark', to: 'graphql' }
  ];

  // Animation function for tech cards
  const getFloatAnimation = (index: number) => {
    return {
      initial: {
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 0.8,
        transition: {
          duration: 0.4
        }
      },
      animate: {
        y: [0, -8, 0],
        scale: [1, 1.05, 1],
        rotate: [0, index % 2 === 0 ? 3 : -3, 0],
        opacity: 1,
        transition: {
          duration: 5 + index % 3, 
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: index * 0.2
        }
      },
      hover: {
        y: -15,
        scale: 1.1,
        rotate: 0,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      },
      tap: {
        scale: 0.95,
        rotate: 0,
        transition: {
          duration: 0.1,
          ease: "easeIn"
        }
      }
    };
  };

  // Pulse animation for the selected tech
  const pulseAnimation: Variants = {
    hidden: { 
      scale: 1,
      boxShadow: "0px 0px 0px rgba(50, 200, 205, 0)"
    },
    visible: { 
      scale: [1, 1.05, 1],
      boxShadow: [
        "0px 0px 0px rgba(50, 200, 205, 0)", 
        "0px 0px 20px rgba(50, 200, 205, 0.7)", 
        "0px 0px 0px rgba(50, 200, 205, 0)"
      ],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Draw animated particles flowing through connection lines
  useEffect(() => {
    if (!canvasRef.current || !gridRef.current || !isInView) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the grid
    const updateCanvasSize = () => {
      const rect = gridRef.current?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particles for each connection
    interface Particle {
      x: number;
      y: number;
      speed: number;
      progress: number;
      size: number;
      color: string;
      alpha: number;
    }

    const allConnections: {
      from: { x: number; y: number };
      to: { x: number; y: number };
      particles: Particle[];
      color: string;
    }[] = [];

    // Map tech elements to DOM nodes
    const techElements = technologies.map(tech => ({
      id: tech.id,
      element: document.getElementById(`tech-${tech.id}`),
      color: tech.color
    }));

    // Initialize connections and particles
    connections.forEach(connection => {
      const fromEl = techElements.find(t => t.id === connection.from)?.element;
      const toEl = techElements.find(t => t.id === connection.to)?.element;
      const color = techElements.find(t => t.id === connection.from)?.color || '#32C8CD';
      
      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const gridRect = gridRef.current!.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width / 2 - gridRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - gridRect.top;
        const toX = toRect.left + toRect.width / 2 - gridRect.left;
        const toY = toRect.top + toRect.height / 2 - gridRect.top;

        // Create particles for this connection
        const particles: Particle[] = [];
        const particleCount = Math.floor(Math.random() * 3) + 3; // 3-5 particles per connection
        
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: fromX,
            y: fromY,
            speed: 0.2 + Math.random() * 0.3, // Random speed between 0.2 and 0.5
            progress: Math.random(), // Random starting point
            size: 1 + Math.random() * 2,
            color,
            alpha: 0.3 + Math.random() * 0.7
          });
        }
        
        allConnections.push({
          from: { x: fromX, y: fromY },
          to: { x: toX, y: toY },
          particles,
          color
        });
      }
    });

    // Animation loop for particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections as thin lines first
      allConnections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = `${conn.color}30`; // Very transparent line
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Update and draw particles
        conn.particles.forEach(particle => {
          // Update position along the line
          particle.progress += particle.speed / 100;
          if (particle.progress > 1) {
            particle.progress = 0;
            particle.size = 1 + Math.random() * 2;
            particle.alpha = 0.3 + Math.random() * 0.7;
          }
          
          // Calculate position along the path
          particle.x = conn.from.x + (conn.to.x - conn.from.x) * particle.progress;
          particle.y = conn.from.y + (conn.to.y - conn.from.y) * particle.progress;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `${conn.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    let animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, technologies, connections]);

  // Periodic highlight animations
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      // Select a random technology to highlight
      const randomIndex = Math.floor(Math.random() * technologies.length);
      const techId = technologies[randomIndex].id;
      
      // Briefly set it as hovered
      setHoveredTech(techId);
      
      // After a short delay, remove the highlight
      setTimeout(() => {
        setHoveredTech(null);
      }, 1500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isInView, technologies]);

  // Handle click on a technology
  const handleTechClick = (id: string) => {
    setSelectedTech(id === selectedTech ? null : id);
  };

  return (
    <div 
      className="relative py-24 px-6 md:px-16 overflow-hidden bg-white"
      data-scroll-section
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-60 w-60 rounded-full bg-gradient-to-r from-accent1/5 to-accent2/5 blur-3xl -top-20 -left-20"></div>
        <div className="absolute h-60 w-60 rounded-full bg-gradient-to-r from-accent3/5 to-accent2/5 blur-3xl -bottom-20 -right-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <div data-scroll-animation className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Enterprise <span className="gradient-text">Technology</span>
          </h2>
          <div className="h-1 w-24 bg-accent1 mx-auto"></div>
          <p className="mt-6 text-lg text-text/70 max-w-2xl mx-auto">
            Our powerful technology stack combines cutting-edge blockchain with enterprise-grade infrastructure
          </p>
        </div>

        <div className="relative" ref={gridRef}>
          {/* Canvas for connection lines and particles */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          />
          
          {/* Tech grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
            {technologies.map((tech, index) => {
              const floatAnimations = getFloatAnimation(index);
              
              return (
                <motion.div
                  key={tech.id}
                  id={`tech-${tech.id}`}
                  initial="initial"
                  animate={isInView ? "animate" : "initial"}
                  variants={floatAnimations}
                  whileHover="hover"
                  whileTap="tap"
                  onMouseEnter={() => setHoveredTech(tech.id)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onClick={() => handleTechClick(tech.id)}
                  className="group relative flex flex-col items-center"
                >
                  <motion.div 
                    className={`
                      w-20 h-20 md:w-24 md:h-24 rounded-xl 
                      flex items-center justify-center 
                      border border-gray-100 shadow-sm
                      transition-colors duration-300
                      backdrop-blur-sm backdrop-filter
                      ${selectedTech === tech.id ? 'bg-white/90' : 'bg-white/80'}
                      ${hoveredTech === tech.id ? 'border-accent2/30' : ''}
                    `}
                    style={{
                      boxShadow: hoveredTech === tech.id || selectedTech === tech.id
                        ? `0 4px 20px ${tech.color}30` 
                        : '',
                    }}
                    animate={selectedTech === tech.id ? "visible" : "hidden"}
                    variants={pulseAnimation}
                  >
                    {/* Logo with animated container */}
                    <motion.div 
                      className="relative w-12 h-12 flex items-center justify-center"
                      animate={{
                        rotateY: selectedTech === tech.id ? [0, 360] : 0
                      }}
                      transition={{
                        duration: selectedTech === tech.id ? 3 : 0.3,
                        repeat: selectedTech === tech.id ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      {imagesLoaded[tech.id] !== false ? (
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          onLoad={() => handleImageLoad(tech.id)}
                          onError={() => handleImageError(tech.id)}
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded overflow-hidden flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${tech.color}10`,
                            color: tech.color
                          }}
                        >
                          <span className="text-xl font-bold">
                            {tech.name.substring(0, 2)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                  
                  <div className="mt-3 text-center">
                    <motion.h3 
                      className="text-sm font-medium"
                      animate={selectedTech === tech.id ? {
                        color: tech.color,
                        fontWeight: 'bold'
                      } : {
                        color: '#333',
                        fontWeight: 'medium'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {tech.name}
                    </motion.h3>
                    <motion.span 
                      className="text-xs text-accent1 block mt-1"
                      animate={selectedTech === tech.id ? {
                        opacity: 1,
                        y: 0
                      } : {
                        opacity: 0.7,
                        y: 0
                      }}
                    >
                      {tech.category}
                    </motion.span>
                  </div>
                  
                  {/* Expanded description for selected technology */}
                  <AnimatePresence>
                    {selectedTech === tech.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-center px-2 text-xs text-text/80 max-w-[180px]"
                      >
                        {tech.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Description tooltip on hover (only shows if not selected) */}
                  {selectedTech !== tech.id && (
                    <motion.div 
                      className={`
                        absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                        bg-white rounded-lg p-3 shadow-lg border border-gray-100
                        w-48 text-center text-xs z-20
                        pointer-events-none
                      `}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ 
                        opacity: hoveredTech === tech.id ? 1 : 0,
                        y: hoveredTech === tech.id ? 0 : -5
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tech.description}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Tech categories legend with animated indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          {['blockchain', 'integration', 'security', 'analytics'].map((category, index) => (
            <motion.div 
              key={category} 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <motion.div 
                className="w-3 h-3 rounded-full bg-accent1"
                animate={{ 
                  scale: [1, 1.3, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: index * 0.5
                }}
              />
              <span className="ml-2 text-sm text-text/70 capitalize">{category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackGrid; 