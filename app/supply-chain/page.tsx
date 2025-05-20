'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '../../components/layout/AppLayout';

// Dynamically import the SupplyChainMap component with no SSR
const SupplyChainMap = dynamic(
  () => import('../../components/map/SupplyChainMap'),
  { ssr: false }
);

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState('map');
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample KPI data
  const kpiData = [
    { 
      id: 'fulfillment', 
      label: 'Order Fulfillment Rate', 
      value: '94.7%', 
      change: '+2.3%', 
      positive: true,
      color: 'bg-[#32C8CD]' 
    },
    { 
      id: 'leadtime', 
      label: 'Average Lead Time', 
      value: '3.2 days', 
      change: '-0.5 days', 
      positive: true,
      color: 'bg-[#683cec]' 
    },
    { 
      id: 'inventory', 
      label: 'Inventory Turnover', 
      value: '12.5x', 
      change: '+1.2x', 
      positive: true,
      color: 'bg-green-500' 
    },
    { 
      id: 'utilization', 
      label: 'Network Utilization', 
      value: '78.3%', 
      change: '+4.6%', 
      positive: true,
      color: 'bg-blue-500' 
    },
  ];
  
  // Sample bottleneck data
  const bottlenecks = [
    {
      id: 'bn-1',
      location: 'Denver Warehouse',
      issue: 'Capacity constraint',
      impact: 'Causing 2-day shipping delays',
      severity: 'high'
    },
    {
      id: 'bn-2',
      location: 'Seattle to Chicago route',
      issue: 'Weather disruption',
      impact: 'Reducing throughput by 15%',
      severity: 'medium'
    },
    {
      id: 'bn-3',
      location: 'Atlanta Distribution',
      issue: 'Staffing shortage',
      impact: 'Processing backlog of 420 orders',
      severity: 'low'
    }
  ];
  
  // Sample inventory alerts
  const inventoryAlerts = [
    {
      id: 'inv-1',
      product: 'Electronics Component XC-55',
      location: 'Chicago Assembly Plant',
      status: 'Low stock (2 days remaining)',
      action: 'Emergency order placed'
    },
    {
      id: 'inv-2',
      product: 'Packaging Materials B-12',
      location: 'Dallas Distribution Center',
      status: 'Overstocked (125% capacity)',
      action: 'Redistribution scheduled'
    }
  ];
  
  return (
    <AppLayout>
      <div>
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display text-[#111827]">
              Northern Morocco Supply Chain
            </h1>
            <p className="text-[#556068]">Interactive visualization and analytics of the Tanger-Tetouan-Al Hoceima logistics network</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#683cec] focus:border-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="bg-white border border-gray-200 text-[#111827] rounded-lg py-2 px-3 flex items-center text-sm hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
            <button className="bg-[#683cec] text-white rounded-lg py-2 px-4 flex items-center text-sm hover:bg-[#5429e0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Run Simulation
            </button>
          </div>
        </div>
        
        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi) => (
            <div 
              key={kpi.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#556068]">{kpi.label}</h3>
                <div className={`p-2 rounded-lg ${kpi.color} bg-opacity-10`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${kpi.color.replace('bg-', 'text-')}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#291859]">{kpi.value}</div>
              <div className="mt-2 flex items-center text-sm">
                <span className={`${kpi.positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    {kpi.positive ? (
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414l4.586 4.586H12z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span>{kpi.change}</span>
                </span>
                <span className="text-[#556068] ml-2">from previous period</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'map' 
                ? 'border-[#683cec] text-[#683cec]' 
                : 'border-transparent text-[#556068] hover:text-[#111827]'
            }`}
            onClick={() => setActiveTab('map')}
          >
            Network Map
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'bottlenecks' 
                ? 'border-[#683cec] text-[#683cec]' 
                : 'border-transparent text-[#556068] hover:text-[#111827]'
            }`}
            onClick={() => setActiveTab('bottlenecks')}
          >
            Bottlenecks
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'inventory' 
                ? 'border-[#683cec] text-[#683cec]' 
                : 'border-transparent text-[#556068] hover:text-[#111827]'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory Alerts
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
              activeTab === 'optimization' 
                ? 'border-[#683cec] text-[#683cec]' 
                : 'border-transparent text-[#556068] hover:text-[#111827]'
            }`}
            onClick={() => setActiveTab('optimization')}
          >
            Route Optimization
          </button>
        </div>
        
        {/* Tab content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Network Map */}
          {activeTab === 'map' && (
            <SupplyChainMap height="650px" />
          )}
          
          {/* Bottlenecks */}
          {activeTab === 'bottlenecks' && (
            <div className="p-6 overflow-x-auto">
              <h2 className="text-lg font-medium text-[#111827] mb-4">Current Supply Chain Bottlenecks</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Issue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Impact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {bottlenecks.map((bottleneck) => (
                      <tr key={bottleneck.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{bottleneck.location}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#556068]">{bottleneck.issue}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#556068]">{bottleneck.impact}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            bottleneck.severity === 'high' ? 'bg-red-100 text-red-800' :
                            bottleneck.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {bottleneck.severity.charAt(0).toUpperCase() + bottleneck.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#556068]">
                          <button className="text-[#683cec] hover:text-[#5429e0] font-medium">
                            View Solutions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Inventory Alerts */}
          {activeTab === 'inventory' && (
            <div className="p-6 overflow-x-auto">
              <h2 className="text-lg font-medium text-[#111827] mb-4">Inventory Alerts</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#556068] uppercase tracking-wider">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {inventoryAlerts.map((alert) => (
                      <tr key={alert.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{alert.product}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#556068]">{alert.location}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">{alert.status}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-[#556068]">{alert.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Route Optimization */}
          {activeTab === 'optimization' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-[#111827] mb-4">AI Route Optimization</h2>
              
              <div className="bg-[#F8F9FB] rounded-lg p-6 mb-6">
                <p className="text-sm text-[#556068] mb-4">
                  AI analysis has identified 3 route optimizations that could reduce costs by 18.3% and improve delivery times by 24.6%.
                </p>
                <button className="bg-[#683cec] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#5429e0]">
                  Apply Optimizations
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="font-medium text-[#111827] mb-2">Dallas to Miami Route Modification</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#556068]">Current: 1,320 miles (26 hours)</span>
                    <span className="text-green-600">Optimized: 1,185 miles (22 hours)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                  <div className="text-xs text-[#556068]">Projected savings: 16% fuel cost reduction</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="font-medium text-[#111827] mb-2">Chicago Warehouse to NYC Direct Route</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#556068]">Current: Multiple hops, 3-day delivery</span>
                    <span className="text-green-600">Optimized: Direct route, 1-day delivery</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <div className="text-xs text-[#556068]">Projected savings: 67% time reduction</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h3 className="font-medium text-[#111827] mb-2">Denver to LA Load Consolidation</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#556068]">Current: 3 half-filled trucks weekly</span>
                    <span className="text-green-600">Optimized: 2 full trucks weekly</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                  <div className="text-xs text-[#556068]">Projected savings: 33% cost reduction</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 