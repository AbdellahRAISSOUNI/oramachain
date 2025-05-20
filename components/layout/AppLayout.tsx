'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Image from 'next/image';
import Link from 'next/link';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:ml-[240px]' : isMobile ? 'ml-0' : 'md:ml-[70px]'
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="px-4 flex h-16 items-center justify-between">
            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Page title in header - will be dynamic */}
            <div className="md:hidden flex items-center">
              <Image 
                src="/logo/logo-icon-dark-transparent.png" 
                alt="OramaChain Logo" 
                width={120} 
                height={30} 
                className="h-8 w-auto" 
              />
            </div>
            
            {/* Right side of header */}
            <div className="flex items-center space-x-4">
              {/* Notification bell */}
              <button className="p-2 rounded-full text-gray-400 hover:text-[#683cec] hover:bg-gray-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* User menu - mobile only */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#32C8CD] to-[#683cec] md:hidden flex items-center justify-center text-white font-medium cursor-pointer">
                D
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 