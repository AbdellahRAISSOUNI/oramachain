'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Import Leaflet types only for type checking
import type { Icon, DivIcon } from 'leaflet';

// Dynamically import react-leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

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

// Dynamically import the useMap component with no SSR
const MapControllerComponent = dynamic(
  () => import('./MapControllerComponent').then(mod => mod.default),
  { ssr: false }
);

// Animation component to move vehicles along routes
const AnimatedVehicle = ({ route, speed = 5000 }: { route: Route; speed?: number }) => {
  const [position, setPosition] = useState<[number, number]>(route.positions[0]);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [vehicleIcon, setVehicleIcon] = useState<any>(null);
  
  useEffect(() => {
    // Skip animation on server side
    if (typeof window === 'undefined') return;
    
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
  
  // Vehicle color based on efficiency
  const vehicleColor = route.efficiency > 80 ? '#32C8CD' : 
                      route.efficiency > 60 ? '#f59e0b' : 
                      '#ef4444';
  
  // Create DivIcon only on client-side
  useEffect(() => {
    const initIcon = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Create the vehicle icon
        const newIcon = L.divIcon({
          className: 'custom-vehicle-icon',
          html: `<div style="background-color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  <div style="background-color: ${vehicleColor}; width: 10px; height: 10px; border-radius: 50%;"></div>
                </div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        
        setVehicleIcon(newIcon);
      } catch (error) {
        console.error('Error creating vehicle icon:', error);
      }
    };
    
    initIcon();
  }, [vehicleColor]);
  
  if (!vehicleIcon) return null;
  
  return <Marker position={position} icon={vehicleIcon} />;
};

// Efficiency color for routes
const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 80) return '#22c55e'; // Green
  if (efficiency >= 60) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

interface MoroccoMapProps {
  height?: string;
}

// Main MoroccoMap component
const MoroccoMap = ({ height = "600px" }: MoroccoMapProps) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.26, -5.0]);
  const [mapZoom, setMapZoom] = useState(8);
  const [isClient, setIsClient] = useState(false);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [facilityIcons, setFacilityIcons] = useState<Record<string, any>>({});
  const [hasError, setHasError] = useState(false);
  
  // Initialize leaflet icons and ensure they work in Next.js
  useEffect(() => {
    setIsClient(true);
    
    // Load and create icons
    const loadIcons = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Create icons for each facility type
        const icons: Record<string, any> = {};
        
        // Use a default icon for all types to avoid 404 errors
        const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Assign the default icon to all facility types
        icons.port = defaultIcon;
        icons.distribution = defaultIcon;
        icons.warehouse = defaultIcon;
        icons.logistics = defaultIcon;
        icons.depot = defaultIcon;
        icons['free-zone'] = defaultIcon;
        
        setFacilityIcons(icons);
        setIconsLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet icons:', error);
        setHasError(true);
      }
    };
    
    loadIcons();
  }, []);
  
  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setMapCenter(facility.position);
    setMapZoom(11);
  };
  
  const resetView = () => {
    setSelectedFacility(null);
    setMapCenter([35.26, -5.0]);
    setMapZoom(8);
  };
  
  // If server-side rendering or error, show a placeholder
  if (!isClient || hasError) {
    return (
      <div 
        className="relative bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 border-t-4 border-[#683cec] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-[#556068]">{hasError ? "Error loading map" : "Loading map..."}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer 
        center={mapCenter}
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <MapControllerComponent center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Facilities */}
        {iconsLoaded && FACILITIES.map(facility => {
          const facilityIcon = facilityIcons[facility.type];
          
          return (
            <Marker 
              key={facility.id}
              position={facility.position}
              icon={facilityIcon}
              eventHandlers={{
                click: () => handleFacilityClick(facility)
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium text-base">{facility.name}</h3>
                  <p className="text-sm text-gray-600">{facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}</p>
                  <div className="text-xs mt-2">
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{facility.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Throughput:</span>
                      <span className="font-medium">{facility.throughput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency:</span>
                      <span className={`font-medium ${facility.efficiency >= 80 ? 'text-green-600' : facility.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {facility.efficiency}%
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Routes */}
        {ROUTES.map(route => {
          const color = getEfficiencyColor(route.efficiency);
          
          return (
            <div key={route.id}>
              <Polyline
                positions={route.positions}
                color={color}
                weight={3}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-medium text-base">{route.from.charAt(0).toUpperCase() + route.from.slice(1)} → {route.to.charAt(0).toUpperCase() + route.to.slice(1)}</h3>
                    <div className="text-xs mt-2">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{route.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vehicles:</span>
                        <span className="font-medium">{route.vehicles} trucks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CO₂:</span>
                        <span className="font-medium">{route.carbonEmission} tons/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className={`font-medium ${route.efficiency >= 80 ? 'text-green-600' : route.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {route.efficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
              
              {/* Animated vehicle on the route */}
              <AnimatedVehicle route={route} speed={10000 - (route.efficiency * 50)} />
            </div>
          );
        })}
      </MapContainer>
      
      {/* Map controls */}
      <div className="absolute top-3 right-3 z-[1000]">
        <button 
          onClick={resetView}
          className="bg-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#556068]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <h4 className="text-sm font-medium text-[#111827] mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#22c55e] mr-2"></div>
            <span>High Efficiency (80%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
            <span>Medium Efficiency (60-79%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
            <span>Low Efficiency (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoroccoMap; 