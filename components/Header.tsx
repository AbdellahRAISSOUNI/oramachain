'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  return (
    <>
      <motion.header 
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 border border-gray-100 rounded-full shadow-sm ${
          scrolled 
            ? 'w-[calc(70%-2rem)] py-2 px-4 bg-white/95 backdrop-blur-md' 
            : 'w-[calc(85%-2rem)] md:w-[70%] max-w-5xl py-3 px-5 bg-white'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group cursor-pointer">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${scrolled ? 'w-8 h-8' : 'w-9 h-9'} relative mr-2 transition-all duration-300`}>
                <Image 
                  src="/logo/logo-icon-dark-transparent.png" 
                  alt="OramaChain" 
                  width={36} 
                  height={36}
                  className="object-contain w-full h-full" 
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/logo.svg";
                  }}
                />
              </div>
              <span className={`font-display font-bold tracking-tight ${scrolled ? 'text-base' : 'text-lg'} transition-all duration-300`}>
                <span className="text-text">Orama</span>
                <span className="gradient-text">Chain</span>
              </span>
            </motion.div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/" isActive={pathname === '/'}>
              Home
            </NavLink>
            
            <NavLink href="/about" isActive={pathname === '/about'}>
              About
            </NavLink>
            
            <NavLink href="/features" isActive={pathname === '/features'}>
              Features
            </NavLink>
            
            <NavLink href="/contact" isActive={pathname === '/contact'}>
              Contact
            </NavLink>
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="relative group">
              <motion.button 
                className="flex items-center px-3 py-1.5 text-sm font-medium text-[#111827] hover:text-accent2 transition-colors cursor-pointer relative overflow-hidden rounded-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <span className="mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </span>
                English
              </motion.button>
            </div>
            
                          <Link href="/contact">
                <motion.button 
                  className={`rounded-full bg-[#2B2F56] text-white text-sm font-medium transition-all cursor-pointer relative overflow-hidden ${
                    scrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                  }`}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 0 15px rgba(43, 47, 86, 0.3)' 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent2 to-accent3 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative z-10">Get started</span>
                </motion.button>
              </Link>
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span 
              className={`block w-5 h-0.5 bg-text transition-all duration-300 ease-out ${
                mobileMenuOpen ? 'rotate-45 translate-y-1' : ''
              }`}
            />
            <span 
              className={`block w-5 h-0.5 bg-text mt-1 transition-all duration-300 ease-out ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block w-5 h-0.5 bg-text mt-1 transition-all duration-300 ease-out ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col space-y-6 mt-8">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)} isActive={pathname === '/'}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)} isActive={pathname === '/about'}>
                About
              </MobileNavLink>
              <MobileNavLink href="/features" onClick={() => setMobileMenuOpen(false)} isActive={pathname === '/features'}>
                Features
              </MobileNavLink>
              <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)} isActive={pathname === '/contact'}>
                Contact
              </MobileNavLink>
            </nav>
            <div className="mt-8 flex flex-col space-y-4">
              <div className="relative">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-[#111827] cursor-pointer hover:text-accent2 transition-colors">
                  <span className="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </span>
                  English
                </button>
              </div>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <motion.button 
                  className="w-full py-2.5 rounded-full bg-[#2B2F56] text-white text-center font-medium text-sm cursor-pointer relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent2 to-accent3 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative z-10">Get started</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`
        relative px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer group
        ${isActive 
          ? 'bg-white text-accent2 rounded-full shadow-sm border border-gray-100' 
          : 'text-[#111827] hover:text-accent2'}
      `}
    >
      {children}
      
      {!isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent2 transition-all duration-300 group-hover:w-1/2"></span>
      )}
    </Link>
  );
};

const MobileNavLink = ({ href, children, onClick, isActive }: { href: string; children: React.ReactNode; onClick: () => void; isActive: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`text-lg font-medium ${isActive ? 'text-accent2' : 'text-[#111827]'} cursor-pointer hover:text-accent2 transition-colors`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header; 