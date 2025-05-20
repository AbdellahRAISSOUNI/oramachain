'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '../../components/layout/AppLayout';

// Dynamically import the MoroccoMap component with no SSR
const MoroccoMap = dynamic(
  () => import('../../components/map/MoroccoMap'),
  { ssr: false }
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(4);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Notifications data
  const notifications = [
    {
      id: 1,
      title: "Route optimized",
      description: "AI optimized route TNG-45 saving 18.7 km",
      time: "10 min ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "Delivery delayed",
      description: "Vehicle TTN-23 delayed at checkpoint",
      time: "42 min ago",
      type: "warning",
      read: false
    },
    {
      id: 3,
      title: "Carbon reduction",
      description: "Fleet has reduced carbon by 5.2% this week",
      time: "1 hour ago",
      type: "info",
      read: false
    },
    {
      id: 4,
      title: "System update",
      description: "New optimization algorithms deployed",
      time: "2 hours ago",
      type: "info",
      read: false
    },
    {
      id: 5,
      title: "Fuel efficiency improved",
      description: "AI tuning increased efficiency by 3.1%",
      time: "Yesterday",
      type: "success",
      read: true
    }
  ];
  
  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
    
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Update time every second - only in client
    let timeInterval: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined') {
      timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    
    return () => {
      clearTimeout(timer);
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      setIsMounted(false);
    };
  }, []);
  
  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };
  
  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Show loading state while initializing
  if (!isMounted || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-[#683cec] animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#32C8CD] to-[#683cec] opacity-30"></div>
          </div>
          <p className="text-[#556068] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div>
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display text-[#111827]">
              Tanger-Tetouan-Al Hoceima Dashboard
            </h1>
            <p className="text-[#556068]">Real-time logistics overview for the northern region</p>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3">
            <select className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#683cec] focus:border-transparent">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom range</option>
            </select>
            <button className="bg-white border border-gray-200 text-[#111827] rounded-lg py-2 px-3 flex items-center text-sm hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Supply Chain Efficiency */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#556068]">Supply Chain Efficiency</h3>
              <div className="p-2 rounded-lg bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#291859]">75%</div>
            <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full w-[75%]"></div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>+5.2%</span>
              </span>
              <span className="text-[#556068] ml-2">from last week</span>
            </div>
          </div>
          
          {/* Carbon Emissions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#556068]">Carbon Emissions</h3>
              <div className="p-2 rounded-lg bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#291859]">32.4</div>
            <div className="text-sm text-[#556068]">tons/day</div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-yellow-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>-0.8%</span>
              </span>
              <span className="text-[#556068] ml-2">need 3.4% reduction to meet target</span>
            </div>
          </div>
          
          {/* Average Delivery Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#556068]">Avg. Delivery Time</h3>
              <div className="p-2 rounded-lg bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#683cec]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#291859]">14.2</div>
            <div className="text-sm text-[#556068]">hours</div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>-3.1%</span>
              </span>
              <span className="text-[#556068] ml-2">from last month</span>
            </div>
          </div>
          
          {/* Cost Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#556068]">Cost Metrics</h3>
              <div className="p-2 rounded-lg bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#291859]">12.7</div>
            <div className="text-sm text-[#556068]">MAD/km</div>
            <div className="mt-3 flex items-center text-sm">
              <span className="text-green-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>-8.4%</span>
              </span>
              <span className="text-[#556068] ml-2">under budget</span>
            </div>
          </div>
        </div>
        
        {/* Map Overview and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Map visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-display text-[#111827]">Fleet Activity</h2>
                <p className="text-[#556068] text-sm">Tanger-Tetouan-Al Hoceima region</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#683cec] mr-1"></div>
                  <span className="text-xs text-[#556068]">Active</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#32C8CD] mr-1"></div>
                  <span className="text-xs text-[#556068]">En Route</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-[#556068]">Delayed</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Map - now in a container with proper z-index */}
            <div className="h-[450px] rounded-lg border border-gray-200 relative overflow-hidden z-0">
              <MoroccoMap height="450px" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#32C8CD]/5 to-[#683cec]/5 rounded-full -mt-32 -mr-32"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#9747FF]/5 to-[#683cec]/5 rounded-full -mb-20 -ml-20"></div>
          </div>
          
          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-display text-[#111827]">Activity Log</h2>
              <span className="text-xs py-1 px-2 bg-[#683cec]/10 text-[#683cec] rounded-full">
                12 new activities
              </span>
            </div>
            
            <div className="space-y-5 overflow-y-auto max-h-[350px] pr-2">
              {/* Activity items */}
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-green-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-[#111827]">Route optimized</span>
                  <span className="text-xs text-[#556068]">4 min ago</span>
                </div>
                <p className="text-xs text-[#556068]">
                  AI optimized route for vehicle TNG-45 saving 12.3 km and reducing carbon emissions by 4.8kg.
                </p>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-blue-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-[#111827]">Delivery completed</span>
                  <span className="text-xs text-[#556068]">23 min ago</span>
                </div>
                <p className="text-xs text-[#556068]">
                  Vehicle TTN-23 completed delivery to distribution center Tetouan-4 ahead of schedule.
                </p>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-yellow-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-[#111827]">Maintenance alert</span>
                  <span className="text-xs text-[#556068]">58 min ago</span>
                </div>
                <p className="text-xs text-[#556068]">
                  Predictive maintenance scheduled for AH-105 based on engine diagnostic data.
                </p>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-red-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-[#111827]">Delay detected</span>
                  <span className="text-xs text-[#556068]">1 hr ago</span>
                </div>
                <p className="text-xs text-[#556068]">
                  Vehicle AH-78 delayed at checkpoint. AI calculating alternate routes to minimize impact.
                </p>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-purple-500">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-[#111827]">New shipment</span>
                  <span className="text-xs text-[#556068]">2 hrs ago</span>
                </div>
                <p className="text-xs text-[#556068]">
                  Added 12 new packages to TTN-09's route. Recalculating optimal delivery sequence.
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button className="text-xs text-[#683cec] hover:text-[#5429e0] font-medium">
                View all activity
              </button>
            </div>
            
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#32C8CD]/5 to-[#683cec]/5 rounded-full -mt-20 -mr-20"></div>
          </div>
        </div>
        
        {/* Upcoming Deliveries section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-display text-[#111827]">Upcoming Deliveries</h2>
            <p className="text-[#556068] text-sm">Next 24 hours forecast</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">ETA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Cargo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">TNG-45</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Tangier Med Port</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">14:30</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">On time</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Electronics</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">TTN-23</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Tetouan Distribution Center</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">16:15</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Slight delay</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Textiles</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#111827]">AH-78</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Al Hoceima Hub</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">18:45</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Delayed</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[#556068]">Perishables</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 