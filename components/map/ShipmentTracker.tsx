'use client';

import { useState, useEffect, useRef } from 'react';

interface ShipmentData {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: 'in-transit' | 'delayed' | 'delivered' | 'processing';
  lastUpdate: string;
  currentLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  eta: string;
  etaActual: string;
  etaDeviation: number;
  cargo: {
    type: string;
    quantity: string;
    value: string;
  };
  routePoints: Array<{
    lat: number;
    lng: number;
    name: string;
    timestamp: string;
    status: string;
  }>;
  alerts: Array<{
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

interface ShipmentTrackerProps {
  shipmentId?: string;
  onSelectShipment?: (id: string) => void;
  standalone?: boolean;
}

const SAMPLE_SHIPMENTS: ShipmentData[] = [
  {
    id: 'TNG-1234',
    name: 'Electronics Package TNG-1234',
    origin: 'Tangier Med Port',
    destination: 'Tetouan Distribution Center',
    status: 'in-transit',
    lastUpdate: '10 minutes ago',
    currentLocation: {
      lat: 35.7832,
      lng: -5.6765,
      name: 'N2 Highway, 23km south of Tangier'
    },
    eta: '14:30 today',
    etaActual: '2023-05-30T14:30:00',
    etaDeviation: -12, // minutes ahead of schedule
    cargo: {
      type: 'Electronic Components',
      quantity: '240 units',
      value: '186,000 MAD'
    },
    routePoints: [
      {
        lat: 35.8838,
        lng: -5.5088,
        name: 'Tangier Med Port',
        timestamp: '2023-05-30T08:15:00',
        status: 'departed'
      },
      {
        lat: 35.7832,
        lng: -5.6765,
        name: 'N2 Highway Checkpoint',
        timestamp: '2023-05-30T09:45:00',
        status: 'passed'
      },
      {
        lat: 35.6728,
        lng: -5.4134,
        name: 'Midpoint Rest Area',
        timestamp: '2023-05-30T11:30:00',
        status: 'upcoming'
      },
      {
        lat: 35.5728,
        lng: -5.3934,
        name: 'Tetouan Distribution Center',
        timestamp: '2023-05-30T14:30:00',
        status: 'destination'
      }
    ],
    alerts: [
      {
        type: 'info',
        message: 'Shipment departed Tangier Med Port on time',
        timestamp: '2023-05-30T08:15:00'
      },
      {
        type: 'info',
        message: 'Vehicle passed N2 Highway checkpoint',
        timestamp: '2023-05-30T09:45:00'
      }
    ]
  },
  {
    id: 'AH-5678',
    name: 'Textile Shipment AH-5678',
    origin: 'Tangier Free Zone',
    destination: 'Al Hoceima Warehouse',
    status: 'delayed',
    lastUpdate: '5 minutes ago',
    currentLocation: {
      lat: 35.4250,
      lng: -4.8142,
      name: 'P41 Road, Near Bni Hadifa'
    },
    eta: '19:45 today (delayed)',
    etaActual: '2023-05-30T19:45:00',
    etaDeviation: 85, // minutes behind schedule
    cargo: {
      type: 'Textile Products',
      quantity: '1,800 units',
      value: '320,000 MAD'
    },
    routePoints: [
      {
        lat: 35.7395,
        lng: -5.9140,
        name: 'Tangier Free Zone',
        timestamp: '2023-05-30T07:30:00',
        status: 'departed'
      },
      {
        lat: 35.5889,
        lng: -5.3626,
        name: 'Tetouan Transit Point',
        timestamp: '2023-05-30T10:15:00',
        status: 'passed'
      },
      {
        lat: 35.4250,
        lng: -4.8142,
        name: 'P41 Road Checkpoint',
        timestamp: '2023-05-30T13:45:00',
        status: 'current'
      },
      {
        lat: 35.2408,
        lng: -3.9292,
        name: 'Al Hoceima Warehouse',
        timestamp: '2023-05-30T19:45:00',
        status: 'destination'
      }
    ],
    alerts: [
      {
        type: 'info',
        message: 'Shipment departed Tangier Free Zone',
        timestamp: '2023-05-30T07:30:00'
      },
      {
        type: 'warning',
        message: 'Traffic congestion detected on P41 Road',
        timestamp: '2023-05-30T12:30:00'
      },
      {
        type: 'critical',
        message: 'Shipment delayed by 85 minutes due to road condition',
        timestamp: '2023-05-30T13:45:00'
      }
    ]
  },
  {
    id: 'TTN-9012',
    name: 'Agricultural Products TTN-9012',
    origin: 'Larache Logistics Park',
    destination: 'Chefchaouen Depot',
    status: 'delivered',
    lastUpdate: '2 hours ago',
    currentLocation: {
      lat: 35.1788,
      lng: -5.2536,
      name: 'Chefchaouen Depot'
    },
    eta: 'Delivered at 11:23 today',
    etaActual: '2023-05-30T11:23:00',
    etaDeviation: 0,
    cargo: {
      type: 'Agricultural Products',
      quantity: '5.2 tons',
      value: '95,000 MAD'
    },
    routePoints: [
      {
        lat: 35.2063,
        lng: -6.1467,
        name: 'Larache Logistics Park',
        timestamp: '2023-05-30T06:45:00',
        status: 'departed'
      },
      {
        lat: 35.1963,
        lng: -5.7201,
        name: 'Midpoint Checkpoint',
        timestamp: '2023-05-30T08:30:00',
        status: 'passed'
      },
      {
        lat: 35.1788,
        lng: -5.2536,
        name: 'Chefchaouen Depot',
        timestamp: '2023-05-30T11:23:00',
        status: 'delivered'
      }
    ],
    alerts: [
      {
        type: 'info',
        message: 'Shipment departed Larache Logistics Park',
        timestamp: '2023-05-30T06:45:00'
      },
      {
        type: 'info',
        message: 'Shipment arrived at Chefchaouen Depot',
        timestamp: '2023-05-30T11:23:00'
      }
    ]
  },
  {
    id: 'TET-3456',
    name: 'Automotive Parts TET-3456',
    origin: 'Tetouan Industrial Park',
    destination: 'Tangier Automotive Hub',
    status: 'processing',
    lastUpdate: '15 minutes ago',
    currentLocation: {
      lat: 35.5728,
      lng: -5.3934,
      name: 'Tetouan Industrial Park'
    },
    eta: '15:45 today (scheduled)',
    etaActual: '2023-05-30T15:45:00',
    etaDeviation: 0,
    cargo: {
      type: 'Automotive Components',
      quantity: '350 units',
      value: '450,000 MAD'
    },
    routePoints: [
      {
        lat: 35.5728,
        lng: -5.3934,
        name: 'Tetouan Industrial Park',
        timestamp: '2023-05-30T15:45:00',
        status: 'processing'
      },
      {
        lat: 35.6728,
        lng: -5.5134,
        name: 'Midpoint Checkpoint',
        timestamp: '2023-05-30T17:30:00',
        status: 'upcoming'
      },
      {
        lat: 35.7395,
        lng: -5.9140,
        name: 'Tangier Automotive Hub',
        timestamp: '2023-05-30T19:15:00',
        status: 'destination'
      }
    ],
    alerts: [
      {
        type: 'info',
        message: 'Shipment processing at Tetouan Industrial Park',
        timestamp: '2023-05-30T13:15:00'
      }
    ]
  }
];

const ShipmentTracker = ({ shipmentId, onSelectShipment, standalone = false }: ShipmentTrackerProps) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | undefined>(shipmentId);
  const [shipments, setShipments] = useState<ShipmentData[]>(SAMPLE_SHIPMENTS);
  const [progressAnimation, setProgressAnimation] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update selected shipment if props change
    if (shipmentId) {
      setSelectedShipmentId(shipmentId);
    }
  }, [shipmentId]);

  useEffect(() => {
    // Start the progress animation
    progressRef.current = setInterval(() => {
      setProgressAnimation((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [selectedShipmentId]);

  const selectedShipment = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const handleSelectShipment = (id: string) => {
    setSelectedShipmentId(id);
    setProgressAnimation(0);
    if (onSelectShipment) {
      onSelectShipment(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit':
        return 'text-blue-600 bg-blue-100';
      case 'delayed':
        return 'text-orange-600 bg-orange-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-blue-700 bg-blue-50 border-blue-300';
      case 'warning':
        return 'text-orange-700 bg-orange-50 border-orange-300';
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-300';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-300';
    }
  };

  // Calculate progress percentage based on route points
  const getProgressPercentage = () => {
    const { routePoints } = selectedShipment;
    const passedPoints = routePoints.filter(point => 
      point.status === 'departed' || point.status === 'passed' || point.status === 'delivered'
    ).length;
    
    if (selectedShipment.status === 'delivered') return 100;
    if (selectedShipment.status === 'processing') return 5;
    
    return Math.round((passedPoints / routePoints.length) * 100);
  };

  return (
    <div className={`${standalone ? 'bg-white rounded-xl shadow-sm border border-gray-100 p-6' : ''}`}>
      <h2 className="text-xl font-display text-[#111827] mb-4">Shipment Tracker</h2>
      
      {/* Shipment selector */}
      <div className="flex overflow-x-auto space-x-2 pb-4 mb-6">
        {shipments.map((shipment) => (
          <button
            key={shipment.id}
            onClick={() => handleSelectShipment(shipment.id)}
            className={`flex flex-shrink-0 items-center px-4 py-2 rounded-full border ${
              selectedShipment.id === shipment.id 
                ? 'border-[#683cec] text-[#683cec] bg-[#683cec]/5' 
                : 'border-gray-200 text-[#556068] hover:border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${
              shipment.status === 'in-transit' ? 'bg-blue-500' :
              shipment.status === 'delayed' ? 'bg-orange-500' :
              shipment.status === 'delivered' ? 'bg-green-500' :
              'bg-purple-500'
            }`}></span>
            <span className="text-sm font-medium">{shipment.id}</span>
          </button>
        ))}
      </div>
      
      {/* Shipment details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Shipment info */}
        <div className="space-y-6">
          {/* Header & status */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-[#111827] mb-1">{selectedShipment.name}</h3>
              <div className="text-[#556068] text-sm">Last updated: {selectedShipment.lastUpdate}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedShipment.status)}`}>
              {selectedShipment.status === 'in-transit' ? 'In Transit' :
               selectedShipment.status === 'delayed' ? 'Delayed' :
               selectedShipment.status === 'delivered' ? 'Delivered' :
               'Processing'}
            </div>
          </div>
          
          {/* Route progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#556068]">Origin</span>
              <span className="text-sm text-[#556068]">Destination</span>
            </div>
            <div className="relative">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#683cec] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressAnimation < getProgressPercentage() ? progressAnimation : getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm font-medium mt-1">
                <span className="text-[#111827]">{selectedShipment.origin}</span>
                <span className="text-[#111827]">{selectedShipment.destination}</span>
              </div>
            </div>
          </div>
          
          {/* ETA and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-[#556068] mb-1">Estimated Arrival</div>
              <div className="font-medium text-[#111827]">{selectedShipment.eta}</div>
              {selectedShipment.etaDeviation !== 0 && (
                <div className={`text-xs ${selectedShipment.etaDeviation < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {selectedShipment.etaDeviation < 0 
                    ? `${Math.abs(selectedShipment.etaDeviation)} minutes ahead` 
                    : `${selectedShipment.etaDeviation} minutes behind`
                  }
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-[#556068] mb-1">Current Location</div>
              <div className="font-medium text-[#111827]">{selectedShipment.currentLocation.name}</div>
            </div>
          </div>
          
          {/* Cargo info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-[#111827] mb-3">Cargo Information</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-[#556068] mb-1">Type</div>
                <div className="font-medium text-[#111827]">{selectedShipment.cargo.type}</div>
              </div>
              <div>
                <div className="text-[#556068] mb-1">Quantity</div>
                <div className="font-medium text-[#111827]">{selectedShipment.cargo.quantity}</div>
              </div>
              <div>
                <div className="text-[#556068] mb-1">Value</div>
                <div className="font-medium text-[#111827]">{selectedShipment.cargo.value}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column: Journey & alerts */}
        <div className="space-y-6">
          {/* Journey timeline */}
          <div>
            <h4 className="font-medium text-[#111827] mb-4">Journey Timeline</h4>
            <div className="space-y-4">
              {selectedShipment.routePoints.map((point, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-3 h-3 rounded-full ${
                      point.status === 'departed' || point.status === 'passed' || point.status === 'delivered'
                        ? 'bg-[#683cec]'
                        : point.status === 'current'
                        ? 'bg-orange-500'
                        : 'bg-gray-300'
                    }`}></div>
                    {index < selectedShipment.routePoints.length - 1 && (
                      <div className={`w-0.5 h-16 ${
                        point.status === 'departed' || point.status === 'passed' || point.status === 'delivered'
                          ? 'bg-[#683cec]'
                          : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-[#111827]">{point.name}</div>
                    <div className="text-sm text-[#556068]">
                      {new Date(point.timestamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                      point.status === 'departed' ? 'bg-blue-100 text-blue-800' :
                      point.status === 'passed' ? 'bg-green-100 text-green-800' :
                      point.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      point.status === 'current' ? 'bg-orange-100 text-orange-800' :
                      point.status === 'upcoming' ? 'bg-gray-100 text-gray-800' :
                      point.status === 'destination' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {point.status.charAt(0).toUpperCase() + point.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Alerts */}
          <div>
            <h4 className="font-medium text-[#111827] mb-4">Shipment Alerts</h4>
            <div className="space-y-3">
              {selectedShipment.alerts.length > 0 ? (
                selectedShipment.alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-3 ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs opacity-80">
                        {new Date(alert.timestamp).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[#556068] text-sm">No alerts for this shipment</div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-[#683cec] text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-[#5429e0]">
              Track on Map
            </button>
            <button className="flex-1 border border-gray-200 text-[#111827] rounded-lg py-2 px-4 text-sm font-medium hover:bg-gray-50">
              View Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracker; 