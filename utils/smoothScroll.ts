'use client';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize smooth scrolling with Lenis
export const initSmoothScroll = () => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Create Lenis instance with correct options
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Create a RAF loop for Lenis
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  
  // Start the loop
  requestAnimationFrame(raf);

  return lenis;
};

// Scroll to a specific section smoothly
export const scrollToSection = (targetId: string) => {
  const lenis = new Lenis();
  lenis.scrollTo(targetId);
}; 