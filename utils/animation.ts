import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation for elements when they enter the viewport
export const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
};

// Stagger animation for lists of elements
export const staggerAnimation = (staggerChildren = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// Scale animation for elements
export const scaleAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
};

// Horizontal slide animation
export const slideInFromLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
};

export const slideInFromRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
};

// Hook to initialize GSAP ScrollTrigger
export const useScrollTrigger = (callback: () => void) => {
  useEffect(() => {
    // Call the callback which should contain ScrollTrigger setup
    callback();

    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [callback]);
};

// Create a reveal animation with ScrollTrigger
export const createScrollReveal = (element: string, options = {}) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none none',
        ...options
      }
    }
  );
}; 