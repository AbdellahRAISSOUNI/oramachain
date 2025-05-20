'use client';

import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Create a context for scrolling
export const ScrollContext = createContext<{ scrollY: number } | null>(null);

// Hook to use the scroll context
export const useScroll = () => useContext(ScrollContext);

interface SmoothScrollerProps {
  children: ReactNode;
}

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number>(0);
  const scrollContextValue = useRef<{ scrollY: number }>({ scrollY: 0 });

  useEffect(() => {
    // Skip on server side
    if (typeof window === 'undefined') return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Simple scroll handler to update ScrollTrigger
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      scrollContextValue.current.scrollY = scrollYRef.current;
      
      // Update ScrollTrigger
      ScrollTrigger.update();
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Configure ScrollTrigger
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      start: 'top 80%',
    });

    // Initial ScrollTrigger refresh
    ScrollTrigger.refresh();

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollContextValue.current}>
      <div ref={containerRef} className="min-h-screen">
        {children}
      </div>
    </ScrollContext.Provider>
  );
} 