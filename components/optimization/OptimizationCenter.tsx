'use client';

import { useState } from 'react';
import OptimizationControls, { OptimizationParams } from './OptimizationControls';
import OptimizationVisualizer from './OptimizationVisualizer';

export default function OptimizationCenter() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams | null>(null);
  const [progress, setProgress] = useState(0);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);

  const handleOptimize = (params: OptimizationParams) => {
    setIsOptimizing(true);
    setOptimizationParams(params);
    setProgress(0);
    setOptimizationComplete(false);
    
    // Simulate progress updates at a slower rate to make the visualization more meaningful
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const handleOptimizationComplete = () => {
    setOptimizationComplete(true);
    
    // Generate mock optimization results
    setOptimizationResults({
      routesOptimized: 24,
      costSavings: "12.5%",
      timeReduction: "18.2%",
      emissionsReduction: "15.7%",
      localSourcingImprovement: "9.3%",
      reliabilityImprovement: "7.8%",
      details: {
        beforeCost: 587000,
        afterCost: 513625,
        beforeTime: 1240, // minutes
        afterTime: 1014,
        beforeEmissions: 48.5, // tons CO2
        afterEmissions: 40.9
      }
    });

    // Dispatch an event to notify that optimization is complete
    // Only run this code on the client side
    if (typeof window !== 'undefined') {
      // Create a custom event that will be safer cross-browser
      const optimizationEvent = new CustomEvent('optimization-completed');
      window.dispatchEvent(optimizationEvent);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimization Controls */}
        <OptimizationControls 
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />
        
        {/* Optimization Visualizer */}
        <OptimizationVisualizer
          isOptimizing={isOptimizing}
          optimizationParams={optimizationParams}
          progress={progress}
          onComplete={handleOptimizationComplete}
        />
      </div>
      
      {/* Optimization Results */}
      {optimizationComplete && optimizationResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-display text-[#111827] mb-4">Optimization Results</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#683cec]/5 border border-[#683cec]/20 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Routes Optimized</div>
              <div className="text-2xl font-display text-[#111827]">{optimizationResults.routesOptimized}</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Cost Savings</div>
              <div className="text-2xl font-display text-green-600">{optimizationResults.costSavings}</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Time Reduction</div>
              <div className="text-2xl font-display text-blue-600">{optimizationResults.timeReduction}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Emissions Reduction</div>
              <div className="text-2xl font-display text-emerald-600">{optimizationResults.emissionsReduction}</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Local Sourcing</div>
              <div className="text-2xl font-display text-amber-600">{optimizationResults.localSourcingImprovement}</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <div className="text-xs text-[#556068] mb-1">Reliability</div>
              <div className="text-2xl font-display text-purple-600">{optimizationResults.reliabilityImprovement}</div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-medium text-[#111827] mb-3">Detailed Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cost comparison */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Transportation Cost</span>
                  <span className="text-sm font-medium text-green-600">-{optimizationResults.costSavings}</span>
                </div>
                <div className="bg-gray-100 h-4 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#683cec] rounded-full" style={{ width: `${(optimizationResults.details.afterCost / optimizationResults.details.beforeCost) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>After: {optimizationResults.details.afterCost.toLocaleString()} MAD</span>
                  <span>Before: {optimizationResults.details.beforeCost.toLocaleString()} MAD</span>
                </div>
              </div>
              
              {/* Time comparison */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Transit Time</span>
                  <span className="text-sm font-medium text-blue-600">-{optimizationResults.timeReduction}</span>
                </div>
                <div className="bg-gray-100 h-4 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(optimizationResults.details.afterTime / optimizationResults.details.beforeTime) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>After: {Math.floor(optimizationResults.details.afterTime / 60)}h {optimizationResults.details.afterTime % 60}m</span>
                  <span>Before: {Math.floor(optimizationResults.details.beforeTime / 60)}h {optimizationResults.details.beforeTime % 60}m</span>
                </div>
              </div>
              
              {/* Emissions comparison */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Carbon Emissions</span>
                  <span className="text-sm font-medium text-emerald-600">-{optimizationResults.emissionsReduction}</span>
                </div>
                <div className="bg-gray-100 h-4 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(optimizationResults.details.afterEmissions / optimizationResults.details.beforeEmissions) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>After: {optimizationResults.details.afterEmissions} tons CO₂</span>
                  <span>Before: {optimizationResults.details.beforeEmissions} tons CO₂</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => {
                setIsOptimizing(false);
                setOptimizationComplete(false);
                setOptimizationResults(null);
              }}
              className="flex-1 bg-gray-100 text-[#111827] rounded-lg py-2 px-4 text-sm font-medium hover:bg-gray-200"
            >
              Reset Optimization
            </button>
            <button className="flex-1 bg-[#683cec] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#5429e0]">
              Apply to Network
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 