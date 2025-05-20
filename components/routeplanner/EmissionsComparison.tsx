'use client';

import React, { useEffect, useRef } from 'react';
import { RouteOption } from './RoutePlannerInterface';
import { EmissionsBreakdown } from './emissionsUtils';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface EmissionsComparisonProps {
  currentEmissions: EmissionsBreakdown | null;
  optimizedEmissions: EmissionsBreakdown | null;
  alternativeEmissions: Array<{
    routeId: string;
    routeName: string;
    emissions: EmissionsBreakdown | null;
  }>;
  currentRoute: RouteOption | null;
  optimizedRoute: RouteOption | null;
  isLoading: boolean;
}

export default function EmissionsComparison({
  currentEmissions,
  optimizedEmissions,
  alternativeEmissions,
  currentRoute,
  optimizedRoute,
  isLoading
}: EmissionsComparisonProps) {
  const comparisonChartRef = useRef<HTMLCanvasElement>(null);
  const comparisonChart = useRef<Chart | null>(null);
  
  const factorsChartRef = useRef<HTMLCanvasElement>(null);
  const factorsChart = useRef<Chart | null>(null);
  
  // Initialize and update comparison chart
  useEffect(() => {
    if (!comparisonChartRef.current || !currentEmissions || !optimizedEmissions || isLoading) return;
    
    // Destroy existing chart instance
    if (comparisonChart.current) {
      comparisonChart.current.destroy();
    }
    
    // Create data for all routes (current, optimized, and alternatives)
    const labels = [currentRoute?.name || 'Current Route'];
    const emissionsData = [currentEmissions.total];
    const routeColors = ['#F97316']; // Orange for current route
    
    if (optimizedRoute) {
      labels.push(optimizedRoute.name);
      emissionsData.push(optimizedEmissions.total);
      routeColors.push('#2563EB'); // Blue for optimized route
    }
    
    // Add data for alternatives (excluding the optimized one which is already included)
    alternativeEmissions.forEach(alt => {
      if (alt.routeId !== optimizedRoute?.id && alt.emissions) {
        labels.push(alt.routeName);
        emissionsData.push(alt.emissions.total);
        routeColors.push('#8B5CF6'); // Purple for alternatives
      }
    });
    
    // Create new chart
    const ctx = comparisonChartRef.current.getContext('2d');
    if (!ctx) return;
    
    comparisonChart.current = new Chart(ctx, {
      type: 'bar',
                          data: {        labels,        datasets: [{          label: 'Total Emissions (kg CO₂e)',          data: emissionsData,          backgroundColor: routeColors,          borderColor: routeColors.map(color => color),          borderWidth: 1        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'kg CO₂e'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${value.toFixed(2)} kg CO₂e`;
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
      if (comparisonChart.current) {
        comparisonChart.current.destroy();
      }
    };
  }, [currentEmissions, optimizedEmissions, alternativeEmissions, currentRoute, optimizedRoute, isLoading]);
  
  // Initialize and update factors chart
  useEffect(() => {
    if (!factorsChartRef.current || !currentEmissions || !optimizedEmissions || isLoading) return;
    
    // Destroy existing chart instance
    if (factorsChart.current) {
      factorsChart.current.destroy();
    }
    
    // Create new chart
    const ctx = factorsChartRef.current.getContext('2d');
    if (!ctx) return;
    
    factorsChart.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Base', 'Traffic', 'Weather', 'Terrain'],
        datasets: [
          {
            label: currentRoute?.name || 'Current Route',
            data: [
              currentEmissions.base,
              currentEmissions.traffic,
              currentEmissions.weather,
              currentEmissions.terrain
            ],
            backgroundColor: 'rgba(249, 115, 22, 0.2)', // Orange with opacity
            borderColor: '#F97316',
            borderWidth: 2,
            pointBackgroundColor: '#F97316',
            pointRadius: 4
          },
          {
            label: optimizedRoute?.name || 'Optimized Route',
            data: [
              optimizedEmissions.base,
              optimizedEmissions.traffic,
              optimizedEmissions.weather,
              optimizedEmissions.terrain
            ],
            backgroundColor: 'rgba(37, 99, 235, 0.2)', // Blue with opacity
            borderColor: '#2563EB',
            borderWidth: 2,
            pointBackgroundColor: '#2563EB',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ${value.toFixed(2)} kg CO₂e`;
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
      if (factorsChart.current) {
        factorsChart.current.destroy();
      }
    };
  }, [currentEmissions, optimizedEmissions, currentRoute, optimizedRoute, isLoading]);
  
  // Calculate savings
  const calculateSavings = () => {
    if (!currentEmissions || !optimizedEmissions) return null;
    
    const absoluteSavings = currentEmissions.total - optimizedEmissions.total;
    const percentageSavings = (absoluteSavings / currentEmissions.total * 100).toFixed(1);
    
    return {
      absolute: absoluteSavings.toFixed(2),
      percentage: percentageSavings
    };
  };
  
  const savings = calculateSavings();
  
  if (!currentEmissions || !optimizedEmissions) {
    return (
      <div className="text-center py-6 text-gray-500">
        Select routes to compare emissions
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium text-[#111827] mb-4">
        Route Emissions Comparison
      </h3>
      
      {savings && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div>
              <p className="text-sm text-[#556068]">Potential Emissions Savings</p>
              <p className="text-2xl font-medium text-green-600">
                {savings.absolute} kg CO<sub>2</sub>e
              </p>
            </div>
            
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              {savings.percentage}% reduction from current route
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Routes comparison chart */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Total Emissions by Route</h4>
          <div className="h-[300px]">
            <canvas ref={comparisonChartRef}></canvas>
          </div>
        </div>
        
        {/* Factors radar chart */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Emissions Factors Comparison</h4>
          <div className="h-[300px]">
            <canvas ref={factorsChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Detailed comparison table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Route</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Optimized Route</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Total Emissions</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">
                {currentEmissions.total.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">
                {optimizedEmissions.total.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.total - optimizedEmissions.total).toFixed(2)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Base Emissions</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentEmissions.base.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedEmissions.base.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.base - optimizedEmissions.base).toFixed(2)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Traffic Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentEmissions.traffic.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedEmissions.traffic.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.traffic - optimizedEmissions.traffic).toFixed(2)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Weather Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentEmissions.weather.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedEmissions.weather.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.weather - optimizedEmissions.weather).toFixed(2)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Terrain Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentEmissions.terrain.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedEmissions.terrain.toFixed(2)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.terrain - optimizedEmissions.terrain).toFixed(2)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Per km</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentEmissions.perKm.toFixed(3)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedEmissions.perKm.toFixed(3)} kg CO₂e
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                -{(currentEmissions.perKm - optimizedEmissions.perKm).toFixed(3)} kg CO₂e
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Distance</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentRoute?.distance} km
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedRoute?.distance} km
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                {currentRoute && optimizedRoute ? 
                  (currentRoute.distance > optimizedRoute.distance ? '-' : '+') + 
                  Math.abs(currentRoute.distance - optimizedRoute.distance) + ' km' 
                  : '0 km'
                }
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Duration</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {currentRoute?.duration} min
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-[#111827]">
                {optimizedRoute?.duration} min
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                {currentRoute && optimizedRoute ? 
                  (currentRoute.duration > optimizedRoute.duration ? '-' : '+') + 
                  Math.abs(currentRoute.duration - optimizedRoute.duration) + ' min' 
                  : '0 min'
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 