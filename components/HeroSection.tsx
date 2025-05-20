'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Transform values for scroll animations
  const dashboardOpacity = useTransform(scrollY, [0, 150, 300], [0, 1, 1]);
  const dashboardY = useTransform(scrollY, [0, 300], [120, 0]);
  const dashboardScale = useTransform(scrollY, [0, 300], [0.85, 1]);
  const dashboardRotateX = useTransform(scrollY, [0, 300], [15, 0]);
  const dashboardRotateY = useTransform(scrollY, [0, 300], [5, 0]);
  const dashboardZ = useTransform(scrollY, [0, 300], [-100, 0]);

  // Handle mouse movement for mockup rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mockupRef.current) {
        const rect = mockupRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-[100vh] md:min-h-[120vh] flex flex-col items-center justify-start pt-32 px-6 md:px-16 overflow-hidden"
    >
      {/* Night sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#334155] opacity-5 z-0"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          data-scroll-parallax="0.05"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #683cec 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:items-center z-10 mb-24">
        {/* Headline */}
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-5 gap-y-0 mx-auto max-w-5xl mb-4">
            {[
              {text: 'The', color: 'text-[#111827]', className: ''},
              {text: 'First', color: 'text-[#111827]', className: ''},
              {text: '✦', color: 'text-[#683cec]', className: 'mx-2'},
              {text: 'AI-Native', color: '', className: 'text-gradient-blue'},
              {text: 'Platform', color: 'text-[#111827]', className: ''},
              {text: 'for', color: 'text-[#111827]', className: ''},
              {text: 'your', color: 'text-[#111827]', className: ''},
              {text: 'Fleet', color: 'text-[#111827]', className: ''}
            ].map((word, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1 + index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1] 
                }}
                className={`${word.className}`}
              >
                <span
                  className={`text-4xl md:text-5xl lg:text-7xl font-display font-bold ${word.color}`}
                >
                  {word.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Description text */}
          <motion.div 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.8,
              ease: [0.25, 0.1, 0.25, 1] 
            }}
          >
            <span className="text-[#556068] font-normal">
              OramaChain AI-Native Platform equips transportation and logistics companies 
              with flexibility, connectivity, and AI tools for peak team performance.
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1,
              ease: [0.25, 0.1, 0.25, 1] 
            }}
          >
            <a 
              href="#features" 
              className="px-8 py-4 rounded-full bg-[#683cec] text-white text-lg font-medium hover:bg-opacity-90 transition-all inline-flex items-center group shadow-lg shadow-[#683cec]/20"
              data-scroll-to
            >
              Get started
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
            
            <a 
              href="#demo" 
              className="px-8 py-4 rounded-full bg-white text-[#111827] border border-gray-200 text-lg font-medium hover:bg-gray-50 transition-all inline-flex items-center shadow-sm"
            >
              Book a demo
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* 3D Dashboard visualization */}
      <motion.div 
        ref={mockupRef}
        className="relative w-full max-w-5xl mx-auto dashboard-glow"
        style={{
          opacity: dashboardOpacity,
          y: dashboardY,
          scale: dashboardScale,
          rotateX: dashboardRotateX,
          rotateY: dashboardRotateY,
          z: dashboardZ,
          transformOrigin: 'center'
        }}
        initial={{ opacity: 0, y: 100 }}
      >
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(104,60,236,0.3)]"
          style={{
            perspective: '1500px',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
          }}
        >
          {/* Dashboard SVG - OramaChain dashboard */}
          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-white">
            <div className="absolute top-0 left-0 right-0 h-12 bg-[#291859] flex items-center px-4 z-10 rounded-t-xl">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white h-12 flex items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="flex items-center"
                >
                  <div className="w-5 h-5 mr-2 relative">
                    <Image 
                      src="/logo/logo-icon-light-transparent.png"
                      alt="OramaChain"
                      width={20}
                      height={20}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/logo.svg";
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">OramaChain</span>
                </motion.div>
              </div>
              <div className="absolute top-0 right-4 h-12 flex items-center space-x-4">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'%3E%3C/path%3E%3Cpath d='M13.73 21a2 2 0 0 1-3.46 0'%3E%3C/path%3E%3C/svg%3E" alt="notifications" className="w-5 h-5" />
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E" alt="profile" className="w-5 h-5" />
                <div className="w-8 h-8 rounded-full bg-[#683cec] flex items-center justify-center overflow-hidden">
                  <div className="relative w-5 h-5">
                    <Image
                      src="/logo/logo-icon-light-transparent.png"
                      alt="OramaChain"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/logo.svg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute left-0 top-12 bottom-0 w-16 bg-[#291859] flex flex-col items-center pt-4 space-y-6">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-[#683cec] flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='14' width='7' height='7'%3E%3C/rect%3E%3Crect x='3' y='14' width='7' height='7'%3E%3C/rect%3E%3C/svg%3E" alt="dashboard" className="w-5 h-5" />
              </motion.div>
              <motion.div 
                className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='9' cy='7' r='4'%3E%3C/circle%3E%3Cpath d='M23 21v-2a4 4 0 0 0-3-3.87'%3E%3C/path%3E%3Cpath d='M16 3.13a4 4 0 0 1 0 7.75'%3E%3C/path%3E%3C/svg%3E" alt="management" className="w-5 h-5" />
              </motion.div>
              <motion.div 
                className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='1' y='4' width='22' height='16' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='1' y1='10' x2='23' y2='10'%3E%3C/line%3E%3C/svg%3E" alt="office" className="w-5 h-5" />
              </motion.div>
              <motion.div 
                className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.9, duration: 0.5 }}
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E" alt="warehouse" className="w-5 h-5" />
              </motion.div>
            </div>
            
            <div className="absolute left-16 right-0 top-12 bottom-0 bg-gray-50 p-6 rounded-bl-xl overflow-y-auto">
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-[#291859] mb-2">Welcome to OramaChain Fleet Management 👋</h2>
              </motion.div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Total vehicles</h3>
                    <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">+12%</div>
                  </div>
                  <div className="text-3xl font-bold text-[#291859]">152</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Active routes</h3>
                    <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">+5.7%</div>
                  </div>
                  <div className="text-3xl font-bold text-[#291859]">38</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Efficiency score</h3>
                    <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">+8.3%</div>
                  </div>
                  <div className="text-3xl font-bold text-[#291859]">94.2%</div>
                </motion.div>
              </div>
              
              {/* Map with fleet visualization */}
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-8 h-64 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-[#F7F9FC]">
                  {/* Map background */}
                  <div className="absolute inset-0 opacity-90" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23E3EAF5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23F7F9FC;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' x='0' y='0' width='800' height='400' /%3E%3Cpath d='M100,100 L200,120 L300,90 L400,150 L500,110 L600,140' stroke='%23E0E7EF' stroke-width='2' fill='none' /%3E%3Cpath d='M150,200 L250,180 L350,220 L450,190 L550,230 L650,170' stroke='%23E0E7EF' stroke-width='2' fill='none' /%3E%3Cpath d='M100,250 L200,270 L300,240 L400,280 L500,250 L600,290' stroke='%23E0E7EF' stroke-width='2' fill='none' /%3E%3Ccircle cx='200' cy='120' r='5' fill='%23E0E7EF' /%3E%3Ccircle cx='400' cy='150' r='5' fill='%23E0E7EF' /%3E%3Ccircle cx='250' cy='180' r='5' fill='%23E0E7EF' /%3E%3Ccircle cx='450' cy='190' r='5' fill='%23E0E7EF' /%3E%3Ccircle cx='300' cy='240' r='5' fill='%23E0E7EF' /%3E%3Ccircle cx='500' cy='250' r='5' fill='%23E0E7EF' /%3E%3C/svg%3E")`
                  }}></div>
                  
                  {/* Active vehicles on map */}
                  <motion.div 
                    className="absolute h-4 w-4 rounded-full bg-[#683cec] shadow-lg shadow-[#683cec]/30"
                    style={{ left: '30%', top: '25%' }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut" 
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#683cec] animate-ping opacity-50"></div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute h-4 w-4 rounded-full bg-[#683cec] shadow-lg shadow-[#683cec]/30"
                    style={{ left: '45%', top: '60%' }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: 0.5,
                      ease: "easeInOut" 
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#683cec] animate-ping opacity-50"></div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute h-4 w-4 rounded-full bg-[#683cec] shadow-lg shadow-[#683cec]/30"
                    style={{ left: '70%', top: '40%' }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: 1,
                      ease: "easeInOut" 
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[#683cec] animate-ping opacity-50"></div>
                  </motion.div>
                  
                  {/* Map route lines */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <motion.path 
                      d="M240,100 C280,120 320,150 360,200 C400,250 450,240 560,160" 
                      stroke="#683cec" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="250"
                      strokeDashoffset="250"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, delay: 2.2 }}
                    />
                    <motion.path 
                      d="M150,240 C200,220 250,240 300,180 C350,120 400,200 450,220 C500,240 550,160 600,160" 
                      stroke="#9747FF" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="450"
                      strokeDashoffset="450"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 2, delay: 2.4 }}
                    />
                    <motion.path 
                      d="M100,150 C150,180 200,160 250,180 C300,200 350,160 400,200 C450,240 500,220 560,280" 
                      stroke="#32C8CD" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="400"
                      strokeDashoffset="400"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.8, delay: 2.6 }}
                    />
                  </svg>
                  
                  <div className="absolute top-0 left-0 p-4">
                    <h3 className="text-sm font-medium text-gray-700">Live Fleet Tracking</h3>
                  </div>
                  
                  <div className="absolute bottom-0 right-0 p-3 flex items-center gap-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#683cec] mr-1"></div>
                      <span className="text-xs text-gray-600">Route A</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#9747FF] mr-1"></div>
                      <span className="text-xs text-gray-600">Route B</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#32C8CD] mr-1"></div>
                      <span className="text-xs text-gray-600">Route C</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.5 }}
              >
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Fuel Efficiency</h3>
                    <div className="w-4 h-4 rounded-full bg-[#683cec]"></div>
                  </div>
                  <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-[#683cec] rounded-full" style={{ width: '72%' }}></div>
                    <div className="absolute inset-0 flex items-center justify-end px-3">
                      <span className="text-xs font-semibold text-gray-700">72%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-500">Maintenance Status</h3>
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Next service in</div>
                    <div className="text-lg font-bold text-green-600">3 days</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating light effects */}
        <motion.div 
          className="absolute -top-10 -right-10 w-32 h-32 bg-[#683cec]/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#683cec]/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-1/3 -left-20 w-20 h-20 bg-[#32C8CD]/20 rounded-full blur-2xl"
          animate={{ 
            x: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </div>
  );
};

export default HeroSection; 