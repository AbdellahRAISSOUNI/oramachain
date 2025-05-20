'use client';

import React, { useEffect, useRef, useState } from 'react';
import { calculateOptimizationSavings } from './emissionsUtils';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface OptimizationStrategiesProps {
  baseEmissions: number;
  optimizedEmissions: number;
  vehicleType: string;
  isLoading: boolean;
}

export default function OptimizationStrategies({
  baseEmissions,
  optimizedEmissions,
  vehicleType,
  isLoading
}: OptimizationStrategiesProps) {
  const strategiesChartRef = useRef<HTMLCanvasElement>(null);
  const strategiesChart = useRef<Chart | null>(null);
  
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  
  // Define optimization strategies and their reduction factors
  const strategies = {
    'Route Optimization': 0.15,
    'Eco-Driving': 0.10,
    'Vehicle Maintenance': 0.05,
    'Tire Pressure': 0.03,
    'Reduced Idling': 0.02,
    'Weight Reduction': 0.02,
    'Vehicle Upgrade': 0.25,
    'Electric Vehicle': 0.72,
    'Carpool/Rideshare': 0.50
  };
  
  // Get current realized savings (percentage)
  const currentSavings = baseEmissions > 0 
    ? ((baseEmissions - optimizedEmissions) / baseEmissions)
    : 0;
  
  // Calculate potential savings from each strategy
  const savingsData = calculateOptimizationSavings(baseEmissions, strategies);
  
  // Initialize chart
  useEffect(() => {
    if (!strategiesChartRef.current || isLoading || baseEmissions === 0) return;
    
    // Destroy existing chart instance
    if (strategiesChart.current) {
      strategiesChart.current.destroy();
    }
    
    // Create new chart
    const ctx = strategiesChartRef.current.getContext('2d');
    if (!ctx) return;
    
    const labels = Object.keys(strategies);
    const data = labels.map(strategy => 
      Math.round(baseEmissions * strategies[strategy as keyof typeof strategies])
    );
    
    // Highlight current savings
    const backgroundColors = labels.map(strategy => 
      strategy === 'Route Optimization' ? '#2563EB' : '#64748B'
    );
    
    // Create chart
    strategiesChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Potential kg CO₂e Saved',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
                 onClick: (event: any, elements: any) => {           if (elements.length > 0) {             const index = elements[0].index as number;             const strategy = labels[index];             setSelectedStrategy(strategy);           }         },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'kg CO₂e Saved'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = (value / baseEmissions * 100).toFixed(1);
                return `${value.toFixed(2)} kg CO₂e (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          duration: 700,
          easing: 'easeOutQuart'
        }
      }
    });
    
    return () => {
      if (strategiesChart.current) {
        strategiesChart.current.destroy();
      }
    };
  }, [baseEmissions, optimizedEmissions, isLoading, strategies]);
  
  // Strategy details for the selected strategy
  const getStrategyDetails = (strategy: string) => {
    const details: Record<string, { description: string, tips: string[] }> = {
      'Route Optimization': {
        description: 'Optimizing your route can save up to 15% of emissions by choosing paths with less traffic, more efficient road types, and smoother terrain.',
        tips: [
          'Plan your route in advance using route planning tools',
          'Avoid heavily congested areas during peak hours',
          'Choose routes with fewer stops and traffic lights',
          'Consider terrain - flat routes typically use less fuel than hilly ones'
        ]
      },
      'Eco-Driving': {
        description: 'Eco-driving techniques involve smoother acceleration, optimal speed maintenance, and reduced hard braking, potentially saving up to 10% of emissions.',
        tips: [
          'Accelerate gently and smoothly',
          'Maintain a steady speed and use cruise control when appropriate',
          'Anticipate traffic flow to avoid unnecessary braking',
          'Drive at moderate speeds (55-65 mph is typically most efficient)'
        ]
      },
      'Vehicle Maintenance': {
        description: 'Regular vehicle maintenance ensures optimal engine performance and emission control systems, reducing carbon emissions by up to 5%.',
        tips: [
          'Change oil and filters regularly',
          'Keep engine properly tuned',
          'Replace air filters as recommended',
          'Fix any issues that could cause the check engine light to turn on'
        ]
      },
      'Tire Pressure': {
        description: 'Properly inflated tires reduce rolling resistance, improving fuel efficiency and reducing emissions by approximately 3%.',
        tips: [
          'Check tire pressure monthly',
          'Maintain pressure at the manufacturer\'s recommended level',
          'Consider low rolling resistance tires when replacing',
          'Check alignment and balance regularly'
        ]
      },
      'Reduced Idling': {
        description: 'Minimizing idling time, especially during longer stops, can reduce unnecessary fuel consumption and emissions by about 2%.',
        tips: [
          'Turn off the engine when stopped for more than 30 seconds',
          'Use remote start sparingly in extreme weather',
          'Avoid drive-throughs with long lines',
          'Warm up the vehicle by driving gently, not by idling'
        ]
      },
      'Weight Reduction': {
        description: 'Carrying unnecessary weight increases fuel consumption. Removing 100 pounds from your vehicle can improve fuel economy by about 2%.',
        tips: [
          'Remove unnecessary items from your trunk and cargo areas',
          'Consider roof racks only when needed (they add drag)',
          'Avoid carrying excessive amounts of cargo',
          'Remove snow and ice accumulation in winter'
        ]
      },
      'Vehicle Upgrade': {
        description: 'Upgrading to a more efficient vehicle with modern fuel economy technologies can reduce emissions by 25% or more.',
        tips: [
          'Consider hybrid vehicles for significant fuel economy improvements',
          'Look for vehicles with cylinder deactivation or start-stop technology',
          'Choose appropriately sized vehicles for your needs',
          'Research fuel economy ratings before purchasing'
        ]
      },
      'Electric Vehicle': {
        description: 'Switching to an electric vehicle can reduce tailpipe emissions by up to 100% and total lifecycle emissions by about 72% depending on your electricity source.',
        tips: [
          'Research available incentives for EV purchases',
          'Consider your driving patterns and charging infrastructure',
          'Look into renewable energy options for home charging',
          'Calculate total cost of ownership, not just purchase price'
        ]
      },
      'Carpool/Rideshare': {
        description: 'Sharing rides with others reduces the number of vehicles on the road, potentially cutting per-person emissions by 50% or more.',
        tips: [
          'Coordinate with colleagues for regular commute sharing',
          'Use ride-sharing apps for one-time trips',
          'Consider public transportation for regular routes',
          'Organize neighborhood carpools for school or events'
        ]
      }
    };
    
    return details[strategy] || {
      description: 'Select a strategy to see detailed information.',
      tips: []
    };
  };
  
  if (baseEmissions === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Select a route to view optimization strategies
      </div>
    );
  }
  
  // Get details for selected strategy
  const strategyInfo = selectedStrategy ? getStrategyDetails(selectedStrategy) : null;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-[#111827] mb-4">
        Emission Reduction Strategies
      </h3>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-[#556068]">Current Route Optimization Saving</p>
            <p className="text-2xl font-medium text-[#683cec]">
              {(currentSavings * 100).toFixed(1)}% ({(baseEmissions - optimizedEmissions).toFixed(2)} kg CO<sub>2</sub>e)
            </p>
          </div>
          
          <div className="bg-[#683cec]/10 text-[#683cec] px-3 py-1.5 rounded-lg text-sm font-medium">
            Additional strategies could yield further savings
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Strategies chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Potential Emission Savings by Strategy</h4>
          <p className="text-xs text-gray-500 mb-4">
            Click on a strategy to see detailed information and tips.
          </p>
          <div className="h-[350px]">
            <canvas ref={strategiesChartRef}></canvas>
          </div>
        </div>
        
        {/* Strategy details */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">
            {selectedStrategy || 'Strategy Details'}
          </h4>
          
          {strategyInfo ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {strategyInfo.description}
              </p>
              
              <h5 className="text-xs font-medium text-[#111827] mb-2">Implementation Tips:</h5>
              <ul className="list-disc list-inside space-y-1">
                {strategyInfo.tips.map((tip, index) => (
                  <li key={index} className="text-xs text-gray-600">{tip}</li>
                ))}
              </ul>
              
              {selectedStrategy && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Potential Savings: </span>
                    Implementing this strategy could save approximately {(strategies[selectedStrategy as keyof typeof strategies] * 100).toFixed(0)}% of 
                    emissions, or {(baseEmissions * strategies[selectedStrategy as keyof typeof strategies]).toFixed(2)} kg CO₂e
                    for this route.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Select a strategy from the chart to see detailed information and implementation tips.
            </p>
          )}
        </div>
      </div>
      
      {/* Combined strategies section */}
      <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-[#111827] mb-2">Combining Multiple Strategies</h4>
        <p className="text-sm text-gray-600 mb-4">
          Combining multiple emission reduction strategies can have a compounding effect, significantly reducing your carbon footprint.
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combination</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Reduction</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CO₂e Saved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Route Optimization + Eco-Driving</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">23%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                  {(baseEmissions * 0.23).toFixed(2)} kg CO₂e
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  Route Opt. + Vehicle Maintenance + Tire Pressure
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">22%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                  {(baseEmissions * 0.22).toFixed(2)} kg CO₂e
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  All Conventional Strategies Combined
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">32%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                  {(baseEmissions * 0.32).toFixed(2)} kg CO₂e
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  Route Opt. + Vehicle Upgrade
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">36%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                  {(baseEmissions * 0.36).toFixed(2)} kg CO₂e
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-[#111827]">
                  Electric Vehicle + Route Optimization
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">76%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                  {(baseEmissions * 0.76).toFixed(2)} kg CO₂e
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Vehicle-specific recommendations */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-[#111827] mb-2">
          Recommendations for {vehicleType === 'heavyTruck' ? 'Heavy Truck' : 
                               vehicleType === 'deliveryVan' ? 'Delivery Van' : 
                               vehicleType === 'electricCar' ? 'Electric Vehicle' : 
                               vehicleType === 'efficientCar' ? 'Hybrid Vehicle' : 
                               'Conventional Vehicle'}
        </h4>
        
        {vehicleType === 'heavyTruck' && (
          <p className="text-sm text-gray-600">
            For heavy trucks, focus on aerodynamic improvements, route optimization to avoid congestion, and driver training. Consider speed management and idle reduction technologies for maximum impact.
          </p>
        )}
        
        {vehicleType === 'deliveryVan' && (
          <p className="text-sm text-gray-600">
            For delivery vehicles, route optimization and load consolidation provide the highest impact. Consider electric alternatives for urban routes and implement maintenance schedules optimized for stop-start driving.
          </p>
        )}
        
        {vehicleType === 'electricCar' && (
          <p className="text-sm text-gray-600">
            For electric vehicles, focus on optimizing energy use through eco-driving techniques and efficient climate control use. Consider renewable energy sources for charging to further reduce your carbon footprint.
          </p>
        )}
        
        {(vehicleType === 'efficientCar' || vehicleType === 'smallCar') && (
          <p className="text-sm text-gray-600">
            For conventional vehicles, combining route optimization with proper maintenance and eco-driving techniques can yield significant emissions reductions. Consider upgrading to a more efficient model for your next vehicle.
          </p>
        )}
      </div>
    </div>
  );
} 