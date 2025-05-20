'use client';

import React, { useEffect, useRef } from 'react';
import { EmissionsBreakdown as EmissionsBreakdownType } from './emissionsUtils';
import { RouteOption } from './RoutePlannerInterface';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface EmissionsBreakdownProps {
  emissions: EmissionsBreakdownType | null;
  route: RouteOption | null;
  vehicleType: string;
  isLoading: boolean;
}

export default function EmissionsBreakdown({ 
  emissions, 
  route,
  vehicleType,
  isLoading 
}: EmissionsBreakdownProps) {
  const breakdownChartRef = useRef<HTMLCanvasElement>(null);
  const breakdownChart = useRef<Chart | null>(null);
  
  const distanceChartRef = useRef<HTMLCanvasElement>(null);
  const distanceChart = useRef<Chart | null>(null);
  
  // Initialize and update breakdown chart
  useEffect(() => {
    if (!breakdownChartRef.current || !emissions || isLoading) return;
    
    // Destroy existing chart instance
    if (breakdownChart.current) {
      breakdownChart.current.destroy();
    }
    
    // Create new chart
    const ctx = breakdownChartRef.current.getContext('2d');
    if (!ctx) return;
    
    breakdownChart.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Base Emissions', 'Traffic Impact', 'Weather Impact', 'Terrain Impact'],
        datasets: [{
          data: [
            emissions.base,
            emissions.traffic,
            emissions.weather,
            emissions.terrain
          ],
          backgroundColor: [
            '#3B82F6', // Base (blue)
            '#F97316', // Traffic (orange)
            '#8B5CF6', // Weather (purple)
            '#10B981', // Terrain (green)
          ],
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
                const percentage = (value / emissions.total * 100).toFixed(1);
                return `${context.label}: ${value.toFixed(2)} kg CO₂e (${percentage}%)`;
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
      if (breakdownChart.current) {
        breakdownChart.current.destroy();
      }
    };
  }, [emissions, isLoading]);
  
  // Initialize and update distance chart
  useEffect(() => {
    if (!distanceChartRef.current || !emissions || isLoading) return;
    
    // Destroy existing chart instance
    if (distanceChart.current) {
      distanceChart.current.destroy();
    }
    
    // Create new chart
    const ctx = distanceChartRef.current.getContext('2d');
    if (!ctx) return;
    
    const distanceMetrics = [];
    const labels = [];
    
    distanceMetrics.push(emissions.perKm);
    labels.push('Per km');
    
    if (emissions.perPassengerKm !== undefined) {
      distanceMetrics.push(emissions.perPassengerKm);
      labels.push('Per passenger-km');
    }
    
    if (emissions.perTonneKm !== undefined) {
      distanceMetrics.push(emissions.perTonneKm);
      labels.push('Per tonne-km');
    }
    
    distanceChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'kg CO₂e',
          data: distanceMetrics,
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
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
                return `${value.toFixed(3)} kg CO₂e`;
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
      if (distanceChart.current) {
        distanceChart.current.destroy();
      }
    };
  }, [emissions, isLoading]);
  
  if (!emissions || !route) {
    return (
      <div className="text-center py-6 text-gray-500">
        Select a route to view emissions breakdown
      </div>
    );
  }
  
  // Get vehicle display name
  const getVehicleDisplayName = () => {
    const vehicleNames: Record<string, string> = {
      smallCar: 'Small Car (Petrol)',
      efficientCar: 'Efficient Car (Hybrid)',
      electricCar: 'Electric Car',
      deliveryVan: 'Delivery Van',
      heavyTruck: 'Heavy Truck'
    };
    
    return vehicleNames[vehicleType] || vehicleType;
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-[#111827] mb-4">
        Emissions Breakdown: {route.name}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Breakdown chart */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Emissions Components</h4>
          <div className="h-[250px]">
            <canvas ref={breakdownChartRef}></canvas>
          </div>
        </div>
        
        {/* Distance metrics chart */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Distance Metrics</h4>
          <div className="h-[250px]">
            <canvas ref={distanceChartRef}></canvas>
          </div>
        </div>
      </div>
      
      {/* Detailed metrics */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Vehicle</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{getVehicleDisplayName()}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Type of vehicle used for calculation</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Distance</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{route.distance} km</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Total route distance</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Total Emissions</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{emissions.total.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Total carbon emissions for the route</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Base Emissions</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-blue-600">{emissions.base.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Emissions under ideal conditions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Traffic Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-orange-600">{emissions.traffic.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Additional emissions due to traffic</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Weather Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-purple-600">{emissions.weather.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Additional emissions due to weather</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Terrain Impact</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">{emissions.terrain.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Additional emissions due to terrain</td>
            </tr>
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Per 100km</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{emissions.byDistance.toFixed(2)} kg CO₂e</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Emissions per 100 kilometers</td>
            </tr>
            {emissions.perPassengerKm !== undefined && (
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Per passenger-km</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{emissions.perPassengerKm.toFixed(3)} kg CO₂e</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Emissions per passenger per kilometer</td>
              </tr>
            )}
            {emissions.perTonneKm !== undefined && (
              <tr>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Per tonne-km</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium text-[#111827]">{emissions.perTonneKm.toFixed(3)} kg CO₂e</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Emissions per tonne of cargo per kilometer</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 