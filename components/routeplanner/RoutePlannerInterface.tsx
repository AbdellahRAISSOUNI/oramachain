'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RouteMap from './RouteMap';
import RouteControls from './RouteControls';
import RouteMetrics from './RouteMetrics';
import RouteComparison from './RouteComparison';
import EmissionsAnalysis from './EmissionsAnalysis';
import { cities, routes, optimizedRoutes } from './routeData';

// Route types
export interface City {
  id: string;
  name: string;
  position: [number, number];
  description: string;
}

export interface RouteOption {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  fuel: number;
  emissions: number;
  path: [number, number][];
  color: string;
  type: 'current' | 'optimized';
  trafficSensitivity: number; // 1-10 scale
  weatherSensitivity: number; // 1-10 scale
  restrictions: string[];
}

export interface RouteParams {
  origin: string;
  destination: string;
  trafficLevel: number; // 0-100
  weatherConditions: number; // 0-100
  timeConstraint: number; // minutes
  prioritizeFuel: boolean;
  prioritizeEmissions: boolean;
}

export default function RoutePlannerInterface() {
  // State for route parameters
  const [routeParams, setRouteParams] = useState<RouteParams>({
    origin: cities[0].id,
    destination: cities[1].id,
    trafficLevel: 30,
    weatherConditions: 20,
    timeConstraint: 240,
    prioritizeFuel: false,
    prioritizeEmissions: true
  });
  
  // State for current and optimized routes
  const [currentRoute, setCurrentRoute] = useState<RouteOption | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOption | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteOption[]>([]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  
  // State for comparison view
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  
  // State for showing emissions analysis
  const [showEmissionsAnalysis, setShowEmissionsAnalysis] = useState(false);

  // Calculate route based on parameters
  useEffect(() => {
    // Find routes that match origin and destination
    const matchingRoutes = routes.filter(
      route => route.origin === routeParams.origin && route.destination === routeParams.destination
    );
    
    const matchingOptimized = optimizedRoutes.filter(
      route => route.origin === routeParams.origin && route.destination === routeParams.destination
    );
    
    if (matchingRoutes.length > 0) {
      // Set current route as the first matching route
      setCurrentRoute(matchingRoutes[0]);
      
      // Generate alternatives based on different parameters
      const alternatives = matchingOptimized.map(route => {
        // Apply traffic and weather factors to duration and fuel
        const trafficFactor = 1 + (routeParams.trafficLevel / 100) * (route.trafficSensitivity / 10);
        const weatherFactor = 1 + (routeParams.weatherConditions / 100) * (route.weatherSensitivity / 10);
        
        return {
          ...route,
          duration: Math.round(route.duration * trafficFactor * weatherFactor),
          fuel: Math.round(route.fuel * (trafficFactor * 0.7 + weatherFactor * 0.3)),
          emissions: Math.round(route.emissions * (trafficFactor * 0.6 + weatherFactor * 0.4))
        };
      });
      
      // Sort based on priorities
      let sortedAlternatives = [...alternatives];
      if (routeParams.prioritizeFuel) {
        sortedAlternatives.sort((a, b) => a.fuel - b.fuel);
      } else if (routeParams.prioritizeEmissions) {
        sortedAlternatives.sort((a, b) => a.emissions - b.emissions);
      } else {
        sortedAlternatives.sort((a, b) => a.duration - b.duration);
      }
      
      // Filter out routes that exceed time constraint
      sortedAlternatives = sortedAlternatives.filter(
        route => route.duration <= routeParams.timeConstraint
      );
      
      setAlternativeRoutes(sortedAlternatives);
      setOptimizedRoute(sortedAlternatives.length > 0 ? sortedAlternatives[0] : null);
      setSelectedAlternative(sortedAlternatives.length > 0 ? sortedAlternatives[0].id : null);
    } else {
      setCurrentRoute(null);
      setOptimizedRoute(null);
      setAlternativeRoutes([]);
      setSelectedAlternative(null);
    }
  }, [routeParams]);

  // Handle parameter changes
  const handleParamChange = (params: Partial<RouteParams>) => {
    setTransitioning(true);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setRouteParams(prev => ({ ...prev, ...params }));
      setIsLoading(false);
      setTimeout(() => setTransitioning(false), 300);
    }, 800);
  };

  // Handle alternative route selection
  const handleAlternativeSelect = (routeId: string) => {
    setTransitioning(true);
    
    setTimeout(() => {
      const selected = alternativeRoutes.find(route => route.id === routeId);
      if (selected) {
        setOptimizedRoute(selected);
        setSelectedAlternative(routeId);
      }
      setTransitioning(false);
    }, 300);
  };

  // Toggle comparison view
  const toggleComparison = () => {
    setShowComparison(prev => !prev);
  };

  // Toggle emissions analysis view
  const toggleEmissionsAnalysis = () => {
    setShowEmissionsAnalysis(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-display text-[#111827] mb-4">Route Planner</h2>
        
        {/* Controls Section */}
        <RouteControls 
          cities={cities}
          params={routeParams}
          onParamChange={handleParamChange}
          isLoading={isLoading}
        />
      </div>
      
      {/* Map and Metrics Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Map Container - takes 2/3 of the screen */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-[#111827]">
              {showComparison ? "Route Comparison" : "Route Visualization"}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleComparison}
                className="text-sm px-3 py-1 bg-[#683cec]/10 text-[#683cec] rounded-lg hover:bg-[#683cec]/20 transition-colors"
              >
                {showComparison ? "Hide Comparison" : "Compare Routes"}
              </button>
              <button
                onClick={toggleEmissionsAnalysis}
                className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                {showEmissionsAnalysis ? "Hide Emissions Analysis" : "Emissions Analysis"}
              </button>
            </div>
          </div>
          
          {/* Route Maps */}
          <div className={`relative ${showComparison ? 'h-[600px]' : 'h-[500px]'}`}>
            <AnimatePresence>
              {showComparison ? (
                <motion.div 
                  key="comparison"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <RouteComparison 
                    currentRoute={currentRoute}
                    optimizedRoute={optimizedRoute}
                    cities={cities}
                    transitioning={transitioning}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="singleMap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <RouteMap 
                    routes={optimizedRoute ? [currentRoute, optimizedRoute].filter(Boolean) as RouteOption[] : currentRoute ? [currentRoute] : []}
                    cities={cities}
                    highlightedRouteId={optimizedRoute?.id}
                    transitioning={transitioning}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Metrics Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-medium text-[#111827] mb-4">Route Alternatives</h3>
          
          <RouteMetrics 
            currentRoute={currentRoute}
            optimizedRoute={optimizedRoute}
            alternatives={alternativeRoutes}
            selectedAlternative={selectedAlternative}
            onAlternativeSelect={handleAlternativeSelect}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Emissions Analysis Section */}
      {showEmissionsAnalysis && (
        <EmissionsAnalysis
          currentRoute={currentRoute}
          optimizedRoute={optimizedRoute}
          alternativeRoutes={alternativeRoutes}
          trafficLevel={routeParams.trafficLevel}
          weatherConditions={routeParams.weatherConditions}
        />
      )}
    </div>
  );
} 