'use client';

import { useEffect, useState, useRef } from 'react';
import { OptimizationParams } from './OptimizationControls';

interface OptimizationVisualizerProps {
  isOptimizing: boolean;
  optimizationParams: OptimizationParams | null;
  progress: number;
  onComplete: () => void;
}

// Random data for the optimization simulation
const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface OptimizationState {
  iteration: number;
  solutions: {
    id: number;
    cost: number;
    time: number;
    emissions: number;
    localSourcing: number;
    reliability: number;
    score: number;
  }[];
  constraints: {
    name: string;
    value: number;
    color: string;
  }[];
  currentBest: {
    id: number;
    score: number;
  };
}

export default function OptimizationVisualizer({
  isOptimizing,
  optimizationParams,
  progress,
  onComplete
}: OptimizationVisualizerProps) {
  const [state, setState] = useState<OptimizationState>({
    iteration: 0,
    solutions: [],
    constraints: [
      { name: 'Budget', value: 0, color: '#3A86FF' },
      { name: 'Time', value: 0, color: '#FF006E' },
      { name: 'Emissions Cap', value: 0, color: '#04724D' },
      { name: 'Local Content', value: 0, color: '#FB8B24' },
      { name: 'Reliability Min', value: 0, color: '#9C2C77' }
    ],
    currentBest: { id: 0, score: 0 }
  });
  
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!isOptimizing) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    if (!optimizationParams) return;
    
    // Initialize simulation data
    setState({
      iteration: 0,
      solutions: Array.from({ length: 40 }, (_, i) => ({
        id: i,
        cost: generateRandomValue(60, 100),
        time: generateRandomValue(50, 100),
        emissions: generateRandomValue(40, 100),
        localSourcing: generateRandomValue(30, 100),
        reliability: generateRandomValue(70, 95),
        score: 0
      })),
      constraints: [
        { name: 'Budget', value: generateRandomValue(70, 90), color: '#3A86FF' },
        { name: 'Time', value: generateRandomValue(60, 85), color: '#FF006E' },
        { name: 'Emissions Cap', value: generateRandomValue(50, 80), color: '#04724D' },
        { name: 'Local Content', value: generateRandomValue(40, 70), color: '#FB8B24' },
        { name: 'Reliability Min', value: generateRandomValue(80, 90), color: '#9C2C77' }
      ],
      currentBest: { id: 0, score: 0 }
    });
    
    // Animation loop for the optimization simulation
    const runOptimization = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      // Update simulation state
      setState(prevState => {
        const newIteration = prevState.iteration + 1;
        
        // Calculate scores for each solution based on weights
        const newSolutions = prevState.solutions.map(solution => {
          const costScore = (100 - solution.cost) * (optimizationParams?.costWeight || 0) / 100;
          const timeScore = (100 - solution.time) * (optimizationParams?.timeWeight || 0) / 100;
          const emissionsScore = (100 - solution.emissions) * (optimizationParams?.emissionsWeight || 0) / 100;
          const localScore = solution.localSourcing * (optimizationParams?.localSourcingWeight || 0) / 100;
          const reliabilityScore = solution.reliability * (optimizationParams?.reliabilityWeight || 0) / 100;
          
          // Total weighted score
          const score = costScore + timeScore + emissionsScore + localScore + reliabilityScore;
          
          // Simulate optimization improvements
          if (newIteration % 10 === 0) {
            return {
              ...solution,
              cost: Math.max(50, solution.cost - generateRandomValue(0, 2)),
              time: Math.max(40, solution.time - generateRandomValue(0, 2)),
              emissions: Math.max(30, solution.emissions - generateRandomValue(0, 3)),
              localSourcing: Math.min(100, solution.localSourcing + generateRandomValue(0, 1)),
              reliability: Math.min(100, solution.reliability + generateRandomValue(0, 1)),
              score
            };
          }
          
          return { ...solution, score };
        });
        
        // Find the best solution
        const sortedSolutions = [...newSolutions].sort((a, b) => b.score - a.score);
        const newBest = { id: sortedSolutions[0].id, score: sortedSolutions[0].score };
        
        // Update constraints based on iteration (simulating the algorithm adapting)
        const newConstraints = prevState.constraints.map(constraint => {
          if (newIteration % 15 === 0) {
            const change = generateRandomValue(-5, 5);
            return {
              ...constraint,
              value: Math.max(30, Math.min(95, constraint.value + change))
            };
          }
          return constraint;
        });
        
        return {
          iteration: newIteration,
          solutions: newSolutions,
          constraints: newConstraints,
          currentBest: newBest
        };
      });
      
      // Continue the animation until progress is complete
      if (progress < 100) {
        animationFrameRef.current = requestAnimationFrame(runOptimization);
      } else {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        onComplete();
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(runOptimization);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOptimizing, optimizationParams, progress, onComplete]);
  
  // Filter solutions to show only a subset for visualization
  const visibleSolutions = state.solutions
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-display text-[#111827] mb-4">Optimization Processor</h2>
      
      {isOptimizing ? (
        <div className="space-y-6">
          {/* Progress indicator */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#556068]">Optimization Progress</span>
              <span className="text-sm font-medium text-[#111827]">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#683cec] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-[#556068]">
              <span>Iteration: {state.iteration}</span>
              <span>Processing {state.solutions.length} potential solutions</span>
            </div>
          </div>
          
          {/* AI optimization visualization */}
          <div className="flex gap-6 h-64">
            {/* Constraints visualization */}
            <div className="w-1/3 border border-gray-100 rounded-lg p-3 bg-gray-50 overflow-hidden">
              <h3 className="text-sm font-medium text-[#111827] mb-2">Constraint Analysis</h3>
              <div className="space-y-3">
                {state.constraints.map((constraint, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#556068]">{constraint.name}</span>
                      <span className="font-medium text-[#111827]">{constraint.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${constraint.value}%`, backgroundColor: constraint.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-[#556068] animate-pulse">
                AI analyzing network constraints...
              </div>
            </div>
            
            {/* Solutions space visualization */}
            <div className="w-2/3 border border-gray-100 rounded-lg p-3 relative overflow-hidden">
              <h3 className="text-sm font-medium text-[#111827] mb-2">Solution Space Exploration</h3>
              
              <div className="relative h-52">
                {visibleSolutions.map((solution, index) => {
                  // Position elements based on their cost and time properties
                  const left = 100 - solution.cost; // Invert so lower cost is positioned right (better)
                  const top = 100 - solution.time; // Invert so lower time is positioned bottom (better)
                  const size = 10 + (solution.score * 0.2); // Size based on score
                  
                  return (
                    <div
                      key={solution.id}
                      className={`absolute rounded-full transition-all duration-500 flex items-center justify-center text-xs font-medium text-white ${
                        solution.id === state.currentBest.id ? 'ring-2 ring-white' : ''
                      }`}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: solution.id === state.currentBest.id ? '#683cec' : '#FF006E',
                        opacity: solution.id === state.currentBest.id ? 1 : 0.4 + (index * 0.05),
                        transform: 'translate(-50%, -50%)',
                        zIndex: solution.id === state.currentBest.id ? 10 : 1
                      }}
                    >
                      {solution.id === state.currentBest.id && size > 20 ? '✓' : ''}
                    </div>
                  );
                })}
                
                {/* Coordinate labels */}
                <div className="absolute left-0 bottom-0 text-xs text-[#556068]">Lower cost →</div>
                <div className="absolute left-0 bottom-0 transform -rotate-90 origin-bottom-left text-xs text-[#556068] ml-2 mb-16">Lower time →</div>
                
                {/* Scanning effect */}
                <div 
                  className="absolute w-full h-1 bg-[#683cec]/20 left-0"
                  style={{ 
                    top: `${(state.iteration % 100) / 100 * 100}%`,
                    boxShadow: '0 0 10px 5px rgba(104, 60, 236, 0.1)'
                  }}
                ></div>
                <div 
                  className="absolute h-full w-1 bg-[#683cec]/20 top-0"
                  style={{ 
                    left: `${((state.iteration + 50) % 100) / 100 * 100}%`,
                    boxShadow: '0 0 10px 5px rgba(104, 60, 236, 0.1)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Status messages */}
          <div className="text-sm text-[#556068] border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-[#683cec] border-t-transparent rounded-full"></div>
              {progress < 25 ? (
                <span>Analyzing supply chain network structure...</span>
              ) : progress < 50 ? (
                <span>Evaluating route combinations against constraints...</span>
              ) : progress < 75 ? (
                <span>Applying genetic algorithms to optimize solution...</span>
              ) : (
                <span>Finalizing optimal network configuration...</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 border border-dashed border-gray-200 rounded-lg">
          <div className="text-center text-[#556068]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Adjust optimization parameters and click "Run AI Route Optimization"</p>
            <p className="text-xs mt-1">The AI will analyze the network and find the optimal solution</p>
          </div>
        </div>
      )}
    </div>
  );
} 