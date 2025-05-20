'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteOption } from './RoutePlannerInterface';
import { calculateEmissions, calculateEquivalents, getEnvironmentalFactors, VEHICLE_PROFILES } from './emissionsUtils';
import EmissionsBreakdown from './EmissionsBreakdown';
import EmissionsComparison from './EmissionsComparison';
import EmissionsEquivalents from './EmissionsEquivalents';
import OptimizationStrategies from './OptimizationStrategies';

interface EmissionsAnalysisProps {
  currentRoute: RouteOption | null;
  optimizedRoute: RouteOption | null;
  alternativeRoutes: RouteOption[];
  trafficLevel: number;
  weatherConditions: number;
}

export default function EmissionsAnalysis({
  currentRoute,
  optimizedRoute,
  alternativeRoutes,
  trafficLevel,
  weatherConditions
}: EmissionsAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'comparison' | 'equivalents' | 'strategies'>('breakdown');
  const [vehicleType, setVehicleType] = useState<string>('smallCar');
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [terrainType, setTerrainType] = useState<'flat' | 'hilly' | 'mountainous'>('flat');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Calculate detailed emissions for current and optimized routes
  const calculateRouteEmissions = (route: RouteOption | null) => {
    if (!route) return null;
    
    const { trafficFactor, weatherFactor } = getEnvironmentalFactors(trafficLevel, weatherConditions);
    
    // Apply route-specific sensitivity
    const routeTrafficFactor = 1 + (trafficFactor - 1) * (route.trafficSensitivity / 10);
    const routeWeatherFactor = 1 + (weatherFactor - 1) * (route.weatherSensitivity / 10);
    
    return calculateEmissions({
      distance: route.distance,
      vehicleData: VEHICLE_PROFILES[vehicleType],
      trafficFactor: routeTrafficFactor,
      weatherFactor: routeWeatherFactor,
      terrain: terrainType,
      cargoWeight: cargoWeight > 0 ? cargoWeight : undefined
    });
  };
  
  const currentEmissions = currentRoute ? calculateRouteEmissions(currentRoute) : null;
  const optimizedEmissions = optimizedRoute ? calculateRouteEmissions(optimizedRoute) : null;
  
  // Calculate emissions for all alternative routes
  const alternativeEmissions = alternativeRoutes.map(route => ({
    routeId: route.id,
    routeName: route.name,
    emissions: calculateRouteEmissions(route)
  }));
  
  // Calculate environmental equivalents
  const equivalents = optimizedEmissions ? calculateEquivalents(optimizedEmissions.total) : null;
  
  // Calculate potential savings
  const savings = currentEmissions && optimizedEmissions 
    ? currentEmissions.total - optimizedEmissions.total 
    : 0;
  
  const savingsPercentage = currentEmissions && optimizedEmissions && currentEmissions.total > 0
    ? ((currentEmissions.total - optimizedEmissions.total) / currentEmissions.total * 100).toFixed(1)
    : '0';
  
  // Handle vehicle type change
  const handleVehicleChange = (type: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setVehicleType(type);
      setIsLoading(false);
    }, 500);
  };
  
  // Handle terrain type change
  const handleTerrainChange = (terrain: 'flat' | 'hilly' | 'mountainous') => {
    setIsLoading(true);
    setTimeout(() => {
      setTerrainType(terrain);
      setIsLoading(false);
    }, 500);
  };
  
  // Handle cargo weight change
  const handleCargoChange = (weight: number) => {
    setCargoWeight(weight);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'breakdown'
                ? 'border-[#683cec] text-[#683cec]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Emissions Breakdown
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-[#683cec] text-[#683cec]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Route Comparison
          </button>
          <button
            onClick={() => setActiveTab('equivalents')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'equivalents'
                ? 'border-[#683cec] text-[#683cec]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Environmental Impact
          </button>
          <button
            onClick={() => setActiveTab('strategies')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'strategies'
                ? 'border-[#683cec] text-[#683cec]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Optimization Strategies
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Control panel */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#556068] mb-1">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
              disabled={isLoading}
            >
              <option value="smallCar">Small Car (Petrol)</option>
              <option value="efficientCar">Efficient Car (Hybrid)</option>
              <option value="electricCar">Electric Car</option>
              <option value="deliveryVan">Delivery Van</option>
              <option value="heavyTruck">Heavy Truck</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#556068] mb-1">Terrain Type</label>
            <select
              value={terrainType}
              onChange={(e) => handleTerrainChange(e.target.value as any)}
              className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
              disabled={isLoading}
            >
              <option value="flat">Flat Terrain</option>
              <option value="hilly">Hilly Terrain</option>
              <option value="mountainous">Mountainous Terrain</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#556068] mb-1">Cargo Weight (kg)</label>
            <input
              type="number"
              min="0"
              max="25000"
              value={cargoWeight}
              onChange={(e) => handleCargoChange(Number(e.target.value))}
              className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
              disabled={isLoading || vehicleType === 'smallCar' || vehicleType === 'efficientCar' || vehicleType === 'electricCar'}
            />
          </div>
        </div>
        
        {/* Summary */}
        {optimizedEmissions && currentEmissions && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div>
                <p className="text-sm text-[#556068]">Optimized Route Emissions</p>
                <p className="text-2xl font-medium text-[#111827]">
                  {optimizedEmissions.total.toFixed(1)} kg CO<sub>2</sub>e
                </p>
              </div>
              
              {savings > 0 && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{savingsPercentage}% reduction</span>
                  <span className="text-sm">({savings.toFixed(1)} kg saved)</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Content tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'breakdown' && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmissionsBreakdown 
                emissions={optimizedEmissions} 
                route={optimizedRoute}
                vehicleType={vehicleType}
                isLoading={isLoading}
              />
            </motion.div>
          )}
          
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmissionsComparison 
                currentEmissions={currentEmissions}
                optimizedEmissions={optimizedEmissions}
                alternativeEmissions={alternativeEmissions}
                currentRoute={currentRoute}
                optimizedRoute={optimizedRoute}
                isLoading={isLoading}
              />
            </motion.div>
          )}
          
          {activeTab === 'equivalents' && (
            <motion.div
              key="equivalents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmissionsEquivalents 
                emissions={optimizedEmissions ? optimizedEmissions.total : 0}
                equivalents={equivalents}
                savings={savings}
                isLoading={isLoading}
              />
            </motion.div>
          )}
          
          {activeTab === 'strategies' && (
            <motion.div
              key="strategies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <OptimizationStrategies 
                baseEmissions={currentEmissions ? currentEmissions.total : 0}
                optimizedEmissions={optimizedEmissions ? optimizedEmissions.total : 0}
                vehicleType={vehicleType}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-5 w-5 border-2 border-[#683cec] border-t-transparent rounded-full mr-2"></div>
            <span className="text-sm text-[#556068]">Recalculating emissions...</span>
          </div>
        )}
      </div>
    </div>
  );
} 