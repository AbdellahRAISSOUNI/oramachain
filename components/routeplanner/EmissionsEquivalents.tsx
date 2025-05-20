'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Equivalents {
  treeDays: number;
  treeYears: number;
  carKm: number;
  flightKm: number;
  smartphones: number;
  laptops: number;
  beefKg: number;
}

interface EmissionsEquivalentsProps {
  emissions: number;
  equivalents: Equivalents | null;
  savings: number;
  isLoading: boolean;
}

export default function EmissionsEquivalents({
  emissions,
  equivalents,
  savings,
  isLoading
}: EmissionsEquivalentsProps) {
  if (!equivalents || emissions === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Select a route to view environmental impact
      </div>
    );
  }
  
  // Calculate percentages for animated progress bars
  const getPercentage = (value: number, max: number) => {
    return Math.min(100, (value / max) * 100);
  };
  
  const carMaxKm = 5000;
  const flightMaxKm = 10000;
  const treeDaysMax = 1000;
  const smartphonesMax = 10;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-[#111827] mb-4">
        Environmental Impact Equivalents
      </h3>
      
      <p className="text-sm text-gray-500 mb-6">
        The carbon emissions from this route ({emissions.toFixed(2)} kg CO₂e) are equivalent to:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tree absorption visualization */}
        <div className="bg-white border border-gray-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-[#111827]">Tree Absorption</h4>
              <p className="text-sm text-gray-500">CO₂ absorbed by trees</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-medium text-green-600">{equivalents.treeDays}</span>
              <span className="text-xs text-gray-500">tree days</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-4">
            {Array.from({ length: Math.min(20, Math.ceil(equivalents.treeDays / 20)) }, (_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-green-500">
                  <path fill="currentColor" d="M12.22 2c.68 0 1.32.27 1.8.75L19.25 8c.68.68.85 1.65.56 2.5-.29.86-1 1.5-1.87 1.69l-2.94.5v7.38c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1v-7.38l-2.93-.5c-.87-.15-1.58-.83-1.87-1.69-.29-.86-.12-1.8.56-2.5l5.25-5.25c.48-.48 1.12-.75 1.8-.75m0 2-5.25 5.25 4.07.69c.38.07.67.34.78.71.1.37.01.76-.24 1.03L12 12.09l-.4-.4c-.23-.23-.34-.59-.27-.94.08-.35.32-.64.69-.75l4.07-.7L10.22 4h2z" />
                </svg>
                <span className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {Math.min(20, Math.ceil(equivalents.treeDays / 20) - i <= 20 ? Math.ceil(equivalents.treeDays / 20) - i : '')}
                </span>
              </motion.div>
            ))}
          </div>
          
          <p className="mt-3 text-xs text-gray-500">
            Equivalent to {equivalents.treeYears.toFixed(2)} years of CO₂ absorption by a single tree
          </p>
        </div>
        
        {/* Car distance equivalent */}
        <div className="bg-white border border-gray-100 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-[#111827]">Car Travel</h4>
              <p className="text-sm text-gray-500">Equivalent car kilometers</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-medium text-blue-600">{equivalents.carKm}</span>
              <span className="text-xs text-gray-500">km by car</span>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">0 km</span>
              <span className="text-xs text-gray-500">{carMaxKm} km</span>
            </div>
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getPercentage(equivalents.carKm, carMaxKm)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></motion.div>
            </div>
            <div className="flex items-start mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 mr-2">
                <path fill="currentColor" d="M19 20H5V21C5 21.6 4.6 22 4 22H3C2.4 22 2 21.6 2 21V12L4 5H17L19 12H21C21.6 12 22 12.4 22 13V19C22 19.6 21.6 20 21 20H19M5 14C3.3 14 2 15.3 2 17C2 18.7 3.3 20 5 20S8 18.7 8 17C8 15.3 6.7 14 5 14M19 14C17.3 14 16 15.3 16 17C16 18.7 17.3 20 19 20S22 18.7 22 17C22 15.3 20.7 14 19 14M5 7L4 10H17L16 7H5Z" />
              </svg>
              <span className="text-sm text-gray-600">
                Emissions from this route equal driving {equivalents.carKm} km in an average petrol car
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Flight equivalent */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[#111827]">Flight Travel</h4>
            <span className="text-lg font-medium text-indigo-600">{equivalents.flightKm} km</span>
          </div>
          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(equivalents.flightKm, flightMaxKm)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></motion.div>
          </div>
          <p className="text-xs text-gray-500">
            Equivalent to {equivalents.flightKm} km of economy class air travel
          </p>
        </div>
        
        {/* Smartphone manufacturing */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[#111827]">Smartphones</h4>
            <span className="text-lg font-medium text-purple-600">{equivalents.smartphones.toFixed(2)}</span>
          </div>
          <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getPercentage(equivalents.smartphones, smartphonesMax)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            ></motion.div>
          </div>
          <p className="text-xs text-gray-500">
            Carbon footprint of manufacturing {equivalents.smartphones.toFixed(2)} smartphones
          </p>
        </div>
        
        {/* Beef production */}
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-[#111827]">Beef Production</h4>
            <span className="text-lg font-medium text-red-600">{equivalents.beefKg} kg</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Equivalent to producing {equivalents.beefKg} kg of beef
          </p>
        </div>
      </div>
      
      {/* Savings impact */}
      {savings > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-5 mb-6">
          <h4 className="text-lg font-medium text-green-800 mb-2">Emissions Savings Impact</h4>
          <p className="text-sm text-green-700 mb-4">
            By choosing the optimized route, you save {savings.toFixed(2)} kg CO₂e, which is equivalent to:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-green-600 mr-2">
                  <path fill="currentColor" d="M12.22 2c.68 0 1.32.27 1.8.75L19.25 8c.68.68.85 1.65.56 2.5-.29.86-1 1.5-1.87 1.69l-2.94.5v7.38c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1v-7.38l-2.93-.5c-.87-.15-1.58-.83-1.87-1.69-.29-.86-.12-1.8.56-2.5l5.25-5.25c.48-.48 1.12-.75 1.8-.75m0 2-5.25 5.25 4.07.69c.38.07.67.34.78.71.1.37.01.76-.24 1.03L12 12.09l-.4-.4c-.23-.23-.34-.59-.27-.94.08-.35.32-.64.69-.75l4.07-.7L10.22 4h2z" />
                </svg>
                <div>
                  <span className="block text-xl font-medium text-green-800">
                    {Math.round(savings / 0.022)} days
                  </span>
                  <span className="block text-xs text-green-600">of tree CO₂ absorption</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-blue-600 mr-2">
                  <path fill="currentColor" d="M19 20H5V21C5 21.6 4.6 22 4 22H3C2.4 22 2 21.6 2 21V12L4 5H17L19 12H21C21.6 12 22 12.4 22 13V19C22 19.6 21.6 20 21 20H19M5 14C3.3 14 2 15.3 2 17C2 18.7 3.3 20 5 20S8 18.7 8 17C8 15.3 6.7 14 5 14M19 14C17.3 14 16 15.3 16 17C16 18.7 17.3 20 19 20S22 18.7 22 17C22 15.3 20.7 14 19 14M5 7L4 10H17L16 7H5Z" />
                </svg>
                <div>
                  <span className="block text-xl font-medium text-blue-800">
                    {Math.round(savings / 0.192)} km
                  </span>
                  <span className="block text-xs text-blue-600">of car travel avoided</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 text-red-600 mr-2">
                  <path fill="currentColor" d="M20 4V6H4V4H8.5L9.5 3H14.5L15.5 4H20M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19M12 9C13.1 9 14 9.9 14 11S13.1 13 12 13 10 12.1 10 11 10.9 9 12 9M15 16.5C15 16.5 13.5 15 12 15S9 16.5 9 16.5V17H15V16.5Z" />
                </svg>
                <div>
                  <span className="block text-xl font-medium text-red-800">
                    {(savings / 60).toFixed(2)} kg
                  </span>
                  <span className="block text-xs text-red-600">of beef production avoided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-4">
        <p className="font-medium mb-1">About these calculations:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Tree absorption: Average mature tree absorbs around 22g CO₂ per day (8kg per year)</li>
          <li>Car travel: Average petrol car emits approximately 192g CO₂ per kilometer</li>
          <li>Flight travel: Economy class flight emits on average 115g CO₂ per passenger kilometer</li>
          <li>Smartphone manufacturing: Around 80kg CO₂ to produce one smartphone</li>
          <li>Beef production: Around 60kg CO₂ to produce 1kg of beef</li>
        </ul>
      </div>
    </div>
  );
} 