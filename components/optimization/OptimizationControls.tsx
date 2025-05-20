'use client';

import { useState } from 'react';

interface OptimizationControlsProps {
  onOptimize: (params: OptimizationParams) => void;
  isOptimizing: boolean;
}

export interface OptimizationParams {
  costWeight: number;
  timeWeight: number;
  emissionsWeight: number;
  localSourcingWeight: number;
  reliabilityWeight: number;
  optimizationStrength: number;
}

export default function OptimizationControls({ onOptimize, isOptimizing }: OptimizationControlsProps) {
  const [params, setParams] = useState<OptimizationParams>({
    costWeight: 30,
    timeWeight: 25,
    emissionsWeight: 20,
    localSourcingWeight: 15,
    reliabilityWeight: 10,
    optimizationStrength: 50
  });

  const handleSliderChange = (param: keyof OptimizationParams, value: number) => {
    setParams({ ...params, [param]: value });
  };

  const totalWeights = 
    params.costWeight + 
    params.timeWeight + 
    params.emissionsWeight + 
    params.localSourcingWeight + 
    params.reliabilityWeight;

  const isBalanced = Math.abs(totalWeights - 100) < 0.001;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-display text-[#111827] mb-4">Optimization Parameters</h2>
      
      <div className="space-y-6">
        {/* Priority weights section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-[#111827]">Priority Weights</h3>
            <div className={`text-sm font-medium ${isBalanced ? 'text-green-600' : 'text-red-500'}`}>
              {isBalanced ? 'Balanced (100%)' : `Total: ${totalWeights}%`}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost weight */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-[#556068]">Cost Efficiency</label>
                <span className="text-sm font-medium text-[#111827]">{params.costWeight}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.costWeight}
                  onChange={(e) => handleSliderChange('costWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
                />
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('costWeight', Math.max(0, params.costWeight - 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('costWeight', Math.min(100, params.costWeight + 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Time weight */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-[#556068]">Delivery Speed</label>
                <span className="text-sm font-medium text-[#111827]">{params.timeWeight}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.timeWeight}
                  onChange={(e) => handleSliderChange('timeWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
                />
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('timeWeight', Math.max(0, params.timeWeight - 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('timeWeight', Math.min(100, params.timeWeight + 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Emissions weight */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-[#556068]">Carbon Emissions</label>
                <span className="text-sm font-medium text-[#111827]">{params.emissionsWeight}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.emissionsWeight}
                  onChange={(e) => handleSliderChange('emissionsWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
                />
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('emissionsWeight', Math.max(0, params.emissionsWeight - 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('emissionsWeight', Math.min(100, params.emissionsWeight + 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Local sourcing weight */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-[#556068]">Local Sourcing</label>
                <span className="text-sm font-medium text-[#111827]">{params.localSourcingWeight}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.localSourcingWeight}
                  onChange={(e) => handleSliderChange('localSourcingWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
                />
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('localSourcingWeight', Math.max(0, params.localSourcingWeight - 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('localSourcingWeight', Math.min(100, params.localSourcingWeight + 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reliability weight */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-[#556068]">Reliability</label>
                <span className="text-sm font-medium text-[#111827]">{params.reliabilityWeight}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={params.reliabilityWeight}
                  onChange={(e) => handleSliderChange('reliabilityWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
                />
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('reliabilityWeight', Math.max(0, params.reliabilityWeight - 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={() => handleSliderChange('reliabilityWeight', Math.min(100, params.reliabilityWeight + 5))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Auto-balance button */}
          <div className="mt-3">
            <button
              onClick={() => {
                setParams({
                  ...params,
                  costWeight: 30,
                  timeWeight: 25,
                  emissionsWeight: 20,
                  localSourcingWeight: 15,
                  reliabilityWeight: 10
                });
              }}
              className="text-sm text-[#683cec] hover:text-[#5429e0] font-medium"
            >
              Auto-balance priorities
            </button>
          </div>
        </div>
        
        {/* Optimization intensity */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm text-[#556068]">Optimization Strength</label>
            <span className="text-sm font-medium text-[#111827]">{params.optimizationStrength}%</span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={params.optimizationStrength}
              onChange={(e) => handleSliderChange('optimizationStrength', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#683cec]"
            />
            <div className="flex items-center space-x-1">
              <button
                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                onClick={() => handleSliderChange('optimizationStrength', Math.max(10, params.optimizationStrength - 5))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
                onClick={() => handleSliderChange('optimizationStrength', Math.min(100, params.optimizationStrength + 5))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-xs text-[#556068] mt-1">
            Higher values yield more aggressive changes but may disrupt existing operations
          </div>
        </div>
        
        {/* Run optimization button */}
        <div className="pt-4">
          <button
            onClick={() => onOptimize(params)}
            disabled={isOptimizing || !isBalanced}
            className={`w-full py-3 px-4 rounded-lg font-medium 
              ${isBalanced 
                ? 'bg-[#683cec] text-white hover:bg-[#5429e0] transition-colors' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isOptimizing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running AI Optimization...
              </div>
            ) : (
              <>Run AI Route Optimization</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 