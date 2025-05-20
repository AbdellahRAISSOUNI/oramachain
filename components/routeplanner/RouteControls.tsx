'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { City, RouteParams } from './RoutePlannerInterface';

interface RouteControlsProps {
  cities: City[];
  params: RouteParams;
  onParamChange: (params: Partial<RouteParams>) => void;
  isLoading: boolean;
}

export default function RouteControls({ cities, params, onParamChange, isLoading }: RouteControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Don't allow same origin and destination
    const newOrigin = e.target.value;
    if (newOrigin !== params.destination) {
      onParamChange({ origin: newOrigin });
    }
  };
  
  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Don't allow same origin and destination
    const newDestination = e.target.value;
    if (newDestination !== params.origin) {
      onParamChange({ destination: newDestination });
    }
  };

  const handleSwapLocations = () => {
    onParamChange({ 
      origin: params.destination, 
      destination: params.origin 
    });
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Basic controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Origin selection */}
            <div className="flex-1">
              <label htmlFor="origin" className="block text-sm text-[#556068] mb-1">
                Origin
              </label>
              <select
                id="origin"
                value={params.origin}
                onChange={handleOriginChange}
                disabled={isLoading}
                className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec] disabled:bg-gray-100"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Swap button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapLocations}
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-gray-100 text-[#556068] disabled:opacity-50"
                title="Swap origin and destination"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Destination selection */}
            <div className="flex-1">
              <label htmlFor="destination" className="block text-sm text-[#556068] mb-1">
                Destination
              </label>
              <select
                id="destination"
                value={params.destination}
                onChange={handleDestinationChange}
                disabled={isLoading}
                className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec] disabled:bg-gray-100"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Traffic Level */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="traffic" className="text-sm text-[#556068]">Traffic Level</label>
                <span className="text-sm font-medium text-[#111827]">{params.trafficLevel}%</span>
              </div>
              <input
                id="traffic"
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.trafficLevel}
                onChange={(e) => onParamChange({ trafficLevel: parseInt(e.target.value) })}
                disabled={isLoading}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#683cec] disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-[#556068] mt-1">
                <span>Light</span>
                <span>Moderate</span>
                <span>Heavy</span>
              </div>
            </div>
            
            {/* Weather Conditions */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="weather" className="text-sm text-[#556068]">Weather Conditions</label>
                <span className="text-sm font-medium text-[#111827]">{params.weatherConditions}%</span>
              </div>
              <input
                id="weather"
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.weatherConditions}
                onChange={(e) => onParamChange({ weatherConditions: parseInt(e.target.value) })}
                disabled={isLoading}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#683cec] disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-[#556068] mt-1">
                <span>Clear</span>
                <span>Rain</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced controls */}
        <div className="space-y-4">
          {/* Time constraint */}
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="timeConstraint" className="text-sm text-[#556068]">Time Constraint</label>
              <span className="text-sm font-medium text-[#111827]">
                {Math.floor(params.timeConstraint / 60)}h {params.timeConstraint % 60}m
              </span>
            </div>
            <input
              id="timeConstraint"
              type="range"
              min="30"
              max="360"
              step="15"
              value={params.timeConstraint}
              onChange={(e) => onParamChange({ timeConstraint: parseInt(e.target.value) })}
              disabled={isLoading}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#683cec] disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-[#556068] mt-1">
              <span>30m</span>
              <span>3h</span>
              <span>6h</span>
            </div>
          </div>
          
          {/* Optimization priorities */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center">
              <input
                id="prioritizeFuel"
                type="checkbox"
                checked={params.prioritizeFuel}
                onChange={(e) => {
                  if (e.target.checked) {
                    onParamChange({ 
                      prioritizeFuel: true,
                      prioritizeEmissions: false
                    });
                  } else {
                    onParamChange({ prioritizeFuel: false });
                  }
                }}
                disabled={isLoading}
                className="w-4 h-4 text-[#683cec] rounded border-gray-300 focus:ring-[#683cec] disabled:opacity-50"
              />
              <label htmlFor="prioritizeFuel" className="ml-2 text-sm text-[#556068]">
                Prioritize Fuel Efficiency
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="prioritizeEmissions"
                type="checkbox"
                checked={params.prioritizeEmissions}
                onChange={(e) => {
                  if (e.target.checked) {
                    onParamChange({ 
                      prioritizeEmissions: true,
                      prioritizeFuel: false
                    });
                  } else {
                    onParamChange({ prioritizeEmissions: false });
                  }
                }}
                disabled={isLoading}
                className="w-4 h-4 text-[#683cec] rounded border-gray-300 focus:ring-[#683cec] disabled:opacity-50"
              />
              <label htmlFor="prioritizeEmissions" className="ml-2 text-sm text-[#556068]">
                Prioritize Low Emissions
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced toggle button */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-[#683cec] hover:text-[#5429e0] font-medium focus:outline-none"
      >
        {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
      </button>
      
      {/* Advanced options section */}
      <motion.div
        initial={false}
        animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 border-t border-gray-100 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#111827]">Road Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="avoidTolls"
                  type="checkbox"
                  className="w-4 h-4 text-[#683cec] rounded border-gray-300 focus:ring-[#683cec]"
                />
                <label htmlFor="avoidTolls" className="ml-2 text-sm text-[#556068]">
                  Avoid Toll Roads
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="avoidHighways"
                  type="checkbox"
                  className="w-4 h-4 text-[#683cec] rounded border-gray-300 focus:ring-[#683cec]"
                />
                <label htmlFor="avoidHighways" className="ml-2 text-sm text-[#556068]">
                  Avoid Highways
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="preferScenic"
                  type="checkbox"
                  className="w-4 h-4 text-[#683cec] rounded border-gray-300 focus:ring-[#683cec]"
                />
                <label htmlFor="preferScenic" className="ml-2 text-sm text-[#556068]">
                  Prefer Scenic Routes
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#111827]">Vehicle Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="vehicleType" className="block text-sm text-[#556068] mb-1">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
                >
                  <option value="car">Car</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="ev">Electric Vehicle</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="fuelEfficiency" className="block text-sm text-[#556068] mb-1">
                  Fuel Efficiency
                </label>
                <select
                  id="fuelEfficiency"
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
                >
                  <option value="high">High (EV/Hybrid)</option>
                  <option value="medium" selected>Medium (Modern Vehicle)</option>
                  <option value="low">Low (Heavy/Older Vehicle)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="mt-4 flex items-center space-x-2 text-[#556068]">
          <div className="animate-spin h-4 w-4 border-2 border-[#683cec] border-t-transparent rounded-full"></div>
          <span className="text-sm">Calculating optimal routes...</span>
        </div>
      )}
    </div>
  );
} 