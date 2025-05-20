'use client';

import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OptimizationCenter from '../../components/optimization/OptimizationCenter';
import RouteComparison from '../../components/optimization/RouteComparison';

export default function RouteOptimizationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Listen for the optimization completed event - client-side only
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window !== 'undefined') {
      const handleOptimizationCompleted = () => {
        setIsOptimized(true);
      };

      window.addEventListener('optimization-completed', handleOptimizationCompleted);
      
      return () => {
        window.removeEventListener('optimization-completed', handleOptimizationCompleted);
      };
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-[#683cec] animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#32C8CD] to-[#683cec] opacity-30"></div>
          </div>
          <p className="text-[#556068] font-medium">Loading optimization tools...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-display text-[#111827]">
            AI Route Optimization
          </h1>
          <p className="text-[#556068]">Optimize your supply chain routes for cost, time, emissions, and reliability</p>
        </div>
        
        <div className="mb-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Overview card - summary of the network */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-display text-[#111827] mb-4">Network Overview</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-[#556068]">Active Routes</div>
                <div className="text-2xl font-medium text-[#111827]">24</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-[#556068]">Total Distance</div>
                <div className="text-2xl font-medium text-[#111827]">1,450 km</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-[#556068]">Vehicle Fleet</div>
                <div className="text-2xl font-medium text-[#111827]">42</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-[#556068]">Warehouses</div>
                <div className="text-2xl font-medium text-[#111827]">8</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Current Efficiency</span>
                  <span className="text-sm font-medium text-[#111827]">67%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#683cec] rounded-full w-[67%]"></div>
                </div>
                <div className="text-xs text-[#556068] mt-1">
                  Improvement potential: 33%
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Carbon Footprint</span>
                  <span className="text-sm font-medium text-[#111827]">48.5 tons CO₂/week</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[72%]"></div>
                </div>
                <div className="text-xs text-[#556068] mt-1">
                  28% below regional average
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Delivery Reliability</span>
                  <span className="text-sm font-medium text-[#111827]">92%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[92%]"></div>
                </div>
                <div className="text-xs text-[#556068] mt-1">
                  Goal: 95% on-time deliveries
                </div>
              </div>
            </div>
          </div>
          
          {/* Current costs card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-display text-[#111827] mb-4">Current Costs</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Fuel</span>
                  <span className="text-sm font-medium text-[#111827]">312,000 MAD</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[53%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Maintenance</span>
                  <span className="text-sm font-medium text-[#111827]">98,000 MAD</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[17%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Staff</span>
                  <span className="text-sm font-medium text-[#111827]">145,000 MAD</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[25%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Tolls & Fees</span>
                  <span className="text-sm font-medium text-[#111827]">32,000 MAD</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full w-[5%]"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-[#556068] mb-1">Total Weekly Cost</div>
                  <div className="text-2xl font-display text-[#111827]">587,000 MAD</div>
                </div>
                <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  +3.2% vs. last month
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Route Comparison - shows before and after */}
        <div className="mb-6">
          <RouteComparison isOptimized={isOptimized} />
        </div>
        
        {/* Optimization Center - controls and visualizer */}
        <div>
          <OptimizationCenter />
        </div>
      </div>
    </AppLayout>
  );
} 