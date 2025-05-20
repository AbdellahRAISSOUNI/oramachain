'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '../../components/layout/AppLayout';
import ShipmentTracker from '../../components/map/ShipmentTracker';

// Dynamically import the MoroccoMap component with no SSR
const MoroccoMap = dynamic(
  () => import('../../components/map/MoroccoMap'),
  { ssr: false }
);

export default function ShipmentTrackingPage() {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>('TNG-1234');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  const handleSelectShipment = (id: string) => {
    setSelectedShipmentId(id);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-[#683cec] animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#32C8CD] to-[#683cec] opacity-30"></div>
          </div>
          <p className="text-[#556068] font-medium">Loading shipment data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-display text-[#111827]">
            Real-time Shipment Tracking
          </h1>
          <p className="text-[#556068]">Track and manage your shipments across the Tanger-Tetouan-Al Hoceima region</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map visualization - takes 2/3 of the screen on large displays */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-display text-[#111827]">Live Tracking Map</h2>
                <p className="text-[#556068] text-sm">Real-time visualization of shipment locations</p>
              </div>
              <div className="flex items-center space-x-3">
                <select className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#683cec] focus:border-transparent">
                  <option>Satellite View</option>
                  <option>Street View</option>
                  <option>Terrain View</option>
                </select>
                <button className="bg-white border border-gray-200 text-[#111827] rounded-lg p-2 flex items-center text-sm hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Interactive Map */}
            <div className="h-[500px] rounded-lg border border-gray-200 relative overflow-hidden z-0">
              <MoroccoMap height="500px" />
              
              {/* Overlay showing currently tracked shipment */}
              <div className="absolute bottom-4 left-4 z-[1000] bg-white bg-opacity-90 rounded-lg p-3 shadow-sm max-w-sm">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm font-medium text-[#111827]">Tracking: {selectedShipmentId}</span>
                </div>
                <div className="text-xs text-[#556068]">
                  Click on any vehicle on the map to view real-time status and details
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-display text-[#111827] mb-4">Shipping Statistics</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Active Shipments</span>
                  <span className="text-sm font-medium text-[#111827]">24</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[75%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">On-Time Deliveries</span>
                  <span className="text-sm font-medium text-[#111827]">92%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-[92%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Delayed Shipments</span>
                  <span className="text-sm font-medium text-[#111827]">8%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[8%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#556068]">Average Transit Time</span>
                  <span className="text-sm font-medium text-[#111827]">12.4 hrs</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#683cec] rounded-full w-[62%]"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <h3 className="font-medium text-[#111827] mb-2">Status Breakdown</h3>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">14</div>
                  <div className="text-xs text-[#556068]">In Transit</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-xs text-[#556068]">Delayed</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs text-[#556068]">Delivered Today</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-xs text-[#556068]">Processing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipment Tracker */}
        <div className="mb-8">
          <ShipmentTracker 
            shipmentId={selectedShipmentId}
            onSelectShipment={handleSelectShipment}
            standalone={true}
          />
        </div>
        
        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display text-[#111827]">Recent Activity</h2>
            <button className="text-[#683cec] hover:text-[#5429e0] text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Shipment ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">09:45 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">
                    <button 
                      onClick={() => handleSelectShipment('TNG-1234')}
                      className="text-[#683cec] hover:underline"
                    >
                      TNG-1234
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Checkpoint Arrival</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">N2 Highway Checkpoint</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">08:32 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">
                    <button 
                      onClick={() => handleSelectShipment('TTN-9012')}
                      className="text-[#683cec] hover:underline"
                    >
                      TTN-9012
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Checkpoint Arrival</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Midpoint Checkpoint</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">08:15 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">
                    <button 
                      onClick={() => handleSelectShipment('TNG-1234')}
                      className="text-[#683cec] hover:underline"
                    >
                      TNG-1234
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Departure</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Tangier Med Port</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">07:30 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">
                    <button 
                      onClick={() => handleSelectShipment('AH-5678')}
                      className="text-[#683cec] hover:underline"
                    >
                      AH-5678
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Departure</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Tangier Free Zone</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">06:45 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">
                    <button 
                      onClick={() => handleSelectShipment('TTN-9012')}
                      className="text-[#683cec] hover:underline"
                    >
                      TTN-9012
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Departure</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Larache Logistics Park</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 