'use client';

import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position for the scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white pt-32 pb-16">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : 20,
          pointerEvents: isScrolled ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent2/10 to-accent3/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <motion.div
          className="relative"
          animate={{ y: [-1, -5, -1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            className="text-accent2 group-hover:text-accent3 transition-colors"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </motion.div>
      </motion.button>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Logo and description with gradient separator */}
        <div className="flex flex-col items-center text-center mb-24">
          <Link href="/" className="flex items-center mb-6">
            <span className="text-3xl font-display font-bold">
              <span>Orama</span>
              <span className="gradient-text">Chain</span>
            </span>
          </Link>
          <p className="text-text/70 max-w-lg mb-8 text-lg">
            Premium AI-Powered Blockchain Solutions for the modern enterprise.
          </p>
          
          {/* Gradient separator */}
          <div className="w-24 h-px bg-gradient-to-r from-accent2 via-accent3 to-accent1"></div>
        </div>
        
        {/* Navigation with premium hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-1">
            <div className="flex space-x-6 justify-center md:justify-start">
              <SocialIcon href="#" label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </SocialIcon>
              <SocialIcon href="#" label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </SocialIcon>
            </div>
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <nav className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="font-display text-md font-medium mb-8 text-center md:text-left uppercase tracking-wider">Products</h3>
                <ul className="space-y-6 flex flex-col items-center md:items-start">
                  <FooterLink href="#">OramaChain Core</FooterLink>
                  <FooterLink href="#">Enterprise Solutions</FooterLink>
                  <FooterLink href="#">Developer API</FooterLink>
                  <FooterLink href="#">Analytics Platform</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="font-display text-md font-medium mb-8 text-center md:text-left uppercase tracking-wider">Resources</h3>
                <ul className="space-y-6 flex flex-col items-center md:items-start">
                  <FooterLink href="#">Documentation</FooterLink>
                  <FooterLink href="#">Tutorials</FooterLink>
                  <FooterLink href="#">Blog</FooterLink>
                  <FooterLink href="#">Case Studies</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="font-display text-md font-medium mb-8 text-center md:text-left uppercase tracking-wider">Company</h3>
                <ul className="space-y-6 flex flex-col items-center md:items-start">
                  <FooterLink href="#">About Us</FooterLink>
                  <FooterLink href="#">Careers</FooterLink>
                  <FooterLink href="#">Contact</FooterLink>
                  <FooterLink href="#">Press Kit</FooterLink>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Delicate separator with gradient effect */}
        <div className="my-24 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        
        {/* Copyright and legal */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-text/60 text-sm mb-8 md:mb-0">
            &copy; {new Date().getFullYear()} OramaChain. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <LegalLink href="#">Privacy Policy</LegalLink>
            <LegalLink href="#">Terms of Service</LegalLink>
            <LegalLink href="#">Cookie Policy</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => {
  return (
    <motion.a 
      href={href}
      aria-label={label}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-100 text-text shadow-sm relative overflow-hidden group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-accent2 to-accent3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
      <div className="relative z-10 group-hover:text-white transition-colors duration-300">
        {children}
      </div>
    </motion.a>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li>
      <Link href={href} className="text-text/70 hover:text-accent2 transition-colors group relative inline-block">
        <span className="relative inline-block group-hover:translate-x-1 transition-transform duration-300">
          {children}
        </span>
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-accent2 to-accent3 group-hover:w-full transition-all duration-300 ease-out"></span>
      </Link>
    </li>
  );
};

const LegalLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="text-text/50 text-sm hover:text-accent2 transition-colors"
    >
      {children}
    </Link>
  );
};

export default Footer; 