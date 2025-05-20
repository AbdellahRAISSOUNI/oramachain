'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Image 
            src="/logo/logo-icon-dark-transparent.png" 
            alt="OramaChain Logo" 
            width={150} 
            height={40} 
            className="h-10 w-auto mx-auto mb-2" 
          />
          <h2 className="text-2xl font-display text-[#111827] tracking-tight">
            Sign in to OramaChain
          </h2>
          <p className="text-sm text-[#556068] mt-1">
            AI-Native Logistics Platform
          </p>
        </div>
        
        <div 
          className="bg-white py-8 px-6 shadow-sm rounded-xl border border-gray-100"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            animation: 'fadeIn 0.5s forwards',
          }}
        >
          <style jsx>{`
            @keyframes fadeIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-[#683cec] focus:border-[#683cec] sm:text-sm"
                placeholder="john.doe@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-[#683cec] focus:border-[#683cec] sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#683cec] focus:ring-[#683cec] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#556068]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#683cec] hover:text-[#5429e0]">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#683cec] hover:bg-[#5429e0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#683cec] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-[#556068]">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-[#683cec] hover:text-[#5429e0]">
              Request access
            </a>
          </p>
        </div>
      </div>
      
      <div className="mt-12 text-center text-xs text-[#556068]">
        <p>© 2024 OramaChain. All rights reserved.</p>
      </div>
    </div>
  );
} 