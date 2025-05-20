'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define our facility and route types
interface Facility {
  id: number;
  name: string;
  position: [number, number];
  type: string;
  capacity: string;
  throughput: string;
  efficiency: number;
}

interface Route {
  id: number;
  from: string;
  to: string;
  positions: [number, number][];
  efficiency: number;
  vehicles: number;
  distance: number;
  carbonEmission: number;
}

// Define our coordinates for major cities in Northern Morocco
const CITY_COORDINATES: Record<string, [number, number]> = {
  tangier: [35.7595, -5.8340],
  tetouan: [35.5889, -5.3626],
  alHoceima: [35.2518, -3.9372],
  larache: [35.1963, -6.1567],
  chefchaouen: [35.1688, -5.2636]
};

// Define our distribution centers and warehouses
const FACILITIES: Facility[] = [
  { 
    id: 1, 
    name: "Tangier Med Port Logistics Hub", 
    position: [35.8838, -5.5088], 
    type: "port", 
    capacity: "280,000 sq m",
    throughput: "4.8M containers/year",
    efficiency: 92
  },
  { 
    id: 2, 
    name: "Tetouan Distribution Center", 
    position: [35.5728, -5.3934], 
    type: "distribution", 
    capacity: "45,000 sq m",
    throughput: "850 vehicles/day",
    efficiency: 78
  },
  { 
    id: 3, 
    name: "Al Hoceima Warehouse", 
    position: [35.2408, -3.9292], 
    type: "warehouse", 
    capacity: "18,000 sq m",
    throughput: "320 shipments/day",
    efficiency: 83
  },
  { 
    id: 4, 
    name: "Larache Logistics Park", 
    position: [35.2063, -6.1467], 
    type: "logistics", 
    capacity: "35,000 sq m",
    throughput: "580 vehicles/day",
    efficiency: 89
  },
  { 
    id: 5, 
    name: "Chefchaouen Depot", 
    position: [35.1788, -5.2536], 
    type: "depot", 
    capacity: "12,000 sq m",
    throughput: "210 shipments/day",
    efficiency: 72
  },
  { 
    id: 6, 
    name: "Tangier Free Zone Hub", 
    position: [35.7395, -5.9140], 
    type: "free-zone", 
    capacity: "180,000 sq m",
    throughput: "1.2M tons/year",
    efficiency: 94
  }
];

// Define our routes between cities with efficiency ratings
const ROUTES: Route[] = [
  { 
    id: 1, 
    from: "tangier", 
    to: "tetouan", 
    positions: [CITY_COORDINATES.tangier, CITY_COORDINATES.tetouan],
    efficiency: 85,
    vehicles: 3,
    distance: 64,
    carbonEmission: 8.2
  },
  { 
    id: 2, 
    from: "tetouan", 
    to: "alHoceima", 
    positions: [CITY_COORDINATES.tetouan, CITY_COORDINATES.alHoceima],
    efficiency: 62,
    vehicles: 2,
    distance: 152,
    carbonEmission: 18.4
  },
  { 
    id: 3, 
    from: "tangier", 
    to: "larache", 
    positions: [CITY_COORDINATES.tangier, CITY_COORDINATES.larache],
    efficiency: 91,
    vehicles: 4,
    distance: 87,
    carbonEmission: 11.3
  },
  { 
    id: 4, 
    from: "tetouan", 
    to: "chefchaouen", 
    positions: [CITY_COORDINATES.tetouan, CITY_COORDINATES.chefchaouen],
    efficiency: 79,
    vehicles: 2,
    distance: 63,
    carbonEmission: 7.8
  },
  { 
    id: 5, 
    from: "alHoceima", 
    to: "chefchaouen", 
    positions: [CITY_COORDINATES.alHoceima, CITY_COORDINATES.chefchaouen],
    efficiency: 55,
    vehicles: 1,
    distance: 135,
    carbonEmission: 14.2
  }
];

// Custom marker icons for cities and facilities
const createIcon = (iconUrl: string, iconSize: [number, number] = [32, 32]) => {
  return new L.Icon({
    iconUrl,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
    popupAnchor: [0, -iconSize[1] / 2]
  });
};

// Animation component to move vehicles along routes
const AnimatedVehicle = ({ route, speed = 5000 }: { route: Route; speed?: number }) => {
  const [position, setPosition] = useState<[number, number]>(route.positions[0]);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min(elapsed / speed, 1);
      setProgress(newProgress);
      
      // Linear interpolation between start and end points
      const startPoint = route.positions[0];
      const endPoint = route.positions[1];
      const newPosition: [number, number] = [
        startPoint[0] + (endPoint[0] - startPoint[0]) * newProgress,
        startPoint[1] + (endPoint[1] - startPoint[1]) * newProgress
      ];
      setPosition(newPosition);
      
      if (newProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Reset and start over
        startTimeRef.current = null;
        setProgress(0);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [route.positions, speed]);
  
  // Vehicle icon based on efficiency
  const vehicleColor = route.efficiency > 80 ? '#32C8CD' : 
                      route.efficiency > 60 ? '#f59e0b' : 
                      '#ef4444';
  
  const vehicleIcon = new L.DivIcon({
    className: 'custom-vehicle-icon',
    html: `<div style="background-color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
             <div style="background-color: ${vehicleColor}; width: 10px; height: 10px; border-radius: 50%;"></div>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  
  return <Marker position={position} icon={vehicleIcon} />;
};

// Efficiency color for routes
const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 80) return '#22c55e'; // Green
  if (efficiency >= 60) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

// Component to set the map view
const MapViewSetter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface MoroccoMapProps {
  height?: string;
}

// Main MoroccoMap component
const MoroccoMap = ({ height = "600px" }: MoroccoMapProps) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.26, -5.0]);
  const [mapZoom, setMapZoom] = useState(8);
  
  // Initialize leaflet icons and ensure they work in Next.js
  useEffect(() => {
    // Fix Leaflet icons in Next.js
    if (typeof window !== 'undefined') {
      // @ts-ignore - _getIconUrl is a private property that we need to access
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);
  
  // Custom icons for different facility types
  const facilityIcons = {
    port: createIcon('https://cdn-icons-png.flaticon.com/512/1146/1146217.png', [28, 28]),
    distribution: createIcon('https://cdn-icons-png.flaticon.com/512/2991/2991441.png', [28, 28]),
    warehouse: createIcon('https://cdn-icons-png.flaticon.com/512/3028/3028358.png', [28, 28]),
    logistics: createIcon('https://cdn-icons-png.flaticon.com/512/2721/2721294.png', [28, 28]),
    depot: createIcon('https://cdn-icons-png.flaticon.com/512/4320/4320350.png', [28, 28]),
    'free-zone': createIcon('https://cdn-icons-png.flaticon.com/512/4310/4310852.png', [28, 28])
  };
  
  // City icon
  const cityIcon = createIcon('https://cdn-icons-png.flaticon.com/512/1719/1719666.png', [26, 26]);
  
  // Handle facility click
  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setMapCenter(facility.position);
    setMapZoom(10);
  };
  
  // Reset view to show all of northern Morocco
  const resetView = () => {
    setMapCenter([35.26, -5.0]);
    setMapZoom(8);
    setSelectedFacility(null);
  };
  
  return (
    <div className="relative" style={{ height, width: '100%' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        attributionControl={false}
      >
        <MapViewSetter center={mapCenter} zoom={mapZoom} />
        
        {/* Satellite base layer */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        
        {/* Routes with efficiency colors */}
        {ROUTES.map(route => (
          <div key={route.id}>
            <Polyline 
              positions={route.positions} 
              pathOptions={{ 
                color: getEfficiencyColor(route.efficiency),
                weight: 4,
                opacity: 0.7,
                dashArray: route.efficiency < 70 ? "5, 10" : undefined
              }} 
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-medium text-[#111827] mb-1">
                    {route.from.charAt(0).toUpperCase() + route.from.slice(1)} to {route.to.charAt(0).toUpperCase() + route.to.slice(1)}
                  </div>
                  <div className="text-[#556068] grid grid-cols-2 gap-x-2 gap-y-1">
                    <span>Distance:</span>
                    <span className="font-medium">{route.distance} km</span>
                    <span>Efficiency:</span>
                    <span className="font-medium">{route.efficiency}%</span>
                    <span>Vehicles:</span>
                    <span className="font-medium">{route.vehicles}</span>
                    <span>Emissions:</span>
                    <span className="font-medium">{route.carbonEmission} tons/mo</span>
                  </div>
                </div>
              </Popup>
            </Polyline>
            
            {/* Animated vehicles on routes */}
            <AnimatedVehicle route={route} speed={route.distance * 100} />
          </div>
        ))}
        
        {/* City markers */}
        {Object.entries(CITY_COORDINATES).map(([city, position]) => (
          <Marker 
            key={city} 
            position={position} 
            icon={cityIcon}
          >
            <Popup>
              <div className="font-medium text-[#111827]">
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Facility markers */}
        {FACILITIES.map(facility => (
          <Marker 
            key={facility.id} 
            position={facility.position} 
            icon={facilityIcons[facility.type as keyof typeof facilityIcons] || facilityIcons.warehouse}
            eventHandlers={{
              click: () => handleFacilityClick(facility)
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium text-[#111827] mb-1">{facility.name}</div>
                <div className="text-[#556068] grid grid-cols-2 gap-x-2 gap-y-1">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{facility.type}</span>
                  <span>Capacity:</span>
                  <span className="font-medium">{facility.capacity}</span>
                  <span>Throughput:</span>
                  <span className="font-medium">{facility.throughput}</span>
                  <span>Efficiency:</span>
                  <span className="font-medium">{facility.efficiency}%</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Reset view button */}
      <button 
        onClick={resetView}
        className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 text-[#683cec]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Facility details panel (when a facility is selected) */}
      {selectedFacility && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-4 max-w-xs">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-md font-display text-[#111827]">{selectedFacility.name}</h3>
            <button 
              onClick={() => setSelectedFacility(null)} 
              className="text-[#556068] hover:text-[#111827]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#556068] mb-1">Facility Type</div>
              <div className="text-sm font-medium text-[#111827] capitalize">{selectedFacility.type}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#556068] mb-1">Capacity</div>
              <div className="text-sm font-medium text-[#111827]">{selectedFacility.capacity}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#556068] mb-1">Throughput</div>
              <div className="text-sm font-medium text-[#111827]">{selectedFacility.throughput}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#556068] mb-1">Efficiency Rating</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedFacility.efficiency >= 80 ? 'bg-green-500' : 
                      selectedFacility.efficiency >= 60 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${selectedFacility.efficiency}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#111827]">{selectedFacility.efficiency}%</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                className="w-full bg-[#683cec] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#5429e0]"
              >
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Live indicator */}
      <div className="absolute top-4 right-4 z-[1000] bg-white bg-opacity-90 rounded-full py-1 px-3 flex items-center shadow-sm">
        <div className="h-2 w-2 rounded-full bg-red-500 mr-2 relative">
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
        </div>
        <span className="text-xs font-medium text-[#111827]">LIVE</span>
      </div>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white bg-opacity-90 rounded-lg p-2 shadow-sm text-xs">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-[#111827]">Optimized Routes ({'>'}80%)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-[#111827]">Standard Routes (60-80%)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-[#111827]">Inefficient Routes ({'<'}60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoroccoMap; 