'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useScroll } from './SmoothScroller';

export default function ScrollAnimations() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const scrollContext = useScroll();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const initTimeout = setTimeout(() => {
      // Get all sections with data-scroll-section attribute
      const scrollSections = document.querySelectorAll('[data-scroll-section]');
      
      // Store refs to sections
      sectionsRef.current = Array.from(scrollSections) as HTMLDivElement[];
      
      // Create animations for each section
      sectionsRef.current.forEach((section) => {
        // Animate elements with data-scroll-animation attribute
        const animatedElements = section.querySelectorAll('[data-scroll-animation]');
        
        if (animatedElements.length > 0) {
          gsap.fromTo(
            animatedElements,
            { 
              y: 50, 
              opacity: 0 
            },
            {
              y: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
        
        // Handle pin elements with data-scroll-pin attribute
        const pinnedElements = section.querySelectorAll('[data-scroll-pin]');
        
        pinnedElements.forEach((element) => {
          ScrollTrigger.create({
            trigger: element,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: true,
          });
        });
        
        // Handle horizontal scroll sections
        const horizontalSections = section.querySelectorAll('[data-scroll-horizontal]');
        
        horizontalSections.forEach((horizontalSection) => {
          const items = horizontalSection.querySelectorAll('[data-scroll-horizontal-item]');
          
          if (items.length > 0) {
            const container = horizontalSection.querySelector('[data-scroll-horizontal-container]');
            
            if (container) {
              // Calculate the total width of all items
              const totalWidth = Array.from(items).reduce((width, item) => {
                return width + (item as HTMLElement).offsetWidth;
              }, 0);
              
              // Set the container width
              gsap.set(container, { width: totalWidth + 100 }); // Add some extra space
              
              // Create horizontal scroll animation
              gsap.to(container, {
                x: () => -(totalWidth - window.innerWidth + 100),
                ease: 'none',
                scrollTrigger: {
                  trigger: horizontalSection,
                  start: 'top top',
                  end: `+=${totalWidth}`,
                  scrub: true,
                  pin: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                }
              });
            }
          }
        });
        
        // Parallax elements
        const parallaxElements = section.querySelectorAll('[data-scroll-parallax]');
        
        parallaxElements.forEach((element) => {
          const speed = element.getAttribute('data-scroll-parallax') || '0.1';
          
          gsap.to(element, {
            y: () => -parseFloat(speed) * 100 + '%',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        });
      });
      
      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
      
    }, 100); // Reduced delay for faster initialization
    
    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearScrollMemory();
    };
  }, [scrollContext]);

  return null;
} 