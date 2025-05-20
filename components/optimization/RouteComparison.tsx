'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import leaflet with no SSR
const L = dynamic(() => import('leaflet').then(mod => mod.default), {
  ssr: false
});

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

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Define icon object creator function that only runs client-side
const createIcon = (iconUrl: string, iconSize: [number, number] = [25, 41], iconAnchor: [number, number] = [12, 41], popupAnchor: [number, number] = [1, -34], shadowSize: [number, number] = [41, 41]) => {
  if (typeof window === 'undefined') return null;
  
  return {
    iconUrl,
    shadowUrl: '/images/map/marker-shadow.png',
    iconSize,
    iconAnchor,
    popupAnchor,
    shadowSize
  };
};

// Setup icons with default values - will only be initialized on client
const DefaultIconProps = createIcon('/images/map/marker-icon.png');
const WarehouseIconProps = createIcon('/images/map/warehouse-icon.png', [32, 32], [16, 32], [0, -32]);
const FactoryIconProps = createIcon('/images/map/factory-icon.png', [32, 32], [16, 32], [0, -32]);
const PortIconProps = createIcon('/images/map/port-icon.png', [32, 32], [16, 32], [0, -32]);
const StoreIconProps = createIcon('/images/map/store-icon.png', [32, 32], [16, 32], [0, -32]);

// Icons will be initialized on the client-side only
let DefaultIcon: any = null;
let WarehouseIcon: any = null;
let factoryIcon: any = null;
let portIcon: any = null;
let storeIcon: any = null;

interface Facility {
  id: string;
  name: string;
  type: 'warehouse' | 'factory' | 'port' | 'store';
  position: [number, number];
  description: string;
}

interface Route {
  id: string;
  name: string;
  path: [number, number][];
  color: string;
  dashArray?: string;
  weight: number;
  efficiency: number;
  distance: number;
  time: number;
  emissions: number;
}

interface RouteComparisonProps {
  isOptimized: boolean;
}

export default function RouteComparison({ isOptimized }: RouteComparisonProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [currentRoutes, setCurrentRoutes] = useState<Route[]>([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState<Route[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Initialize the client-side only data
  useEffect(() => {
    setIsClient(true);
    
    // Initialize Leaflet icons on client-side only
    if (typeof window !== 'undefined' && L) {
      // Create icons
      DefaultIcon = DefaultIconProps ? L.icon(DefaultIconProps) : null;
      WarehouseIcon = WarehouseIconProps ? L.icon(WarehouseIconProps) : null;
      factoryIcon = FactoryIconProps ? L.icon(FactoryIconProps) : null;
      portIcon = PortIconProps ? L.icon(PortIconProps) : null;
      storeIcon = StoreIconProps ? L.icon(StoreIconProps) : null;
      
      // Set default icon
      if (DefaultIcon && L.Marker && L.Marker.prototype) {
        L.Marker.prototype.options.icon = DefaultIcon;
      }
    }
    
    // Sample facilities data
    const sampleFacilities: Facility[] = [
      {
        id: 'port1',
        name: 'Tangier Med Port',
        type: 'port',
        position: [35.8838, -5.5088],
        description: 'Main shipping port serving the region'
      },
      {
        id: 'wh1',
        name: 'Tangier Distribution Center',
        type: 'warehouse',
        position: [35.7691, -5.8034],
        description: 'Primary distribution hub for northern Morocco'
      },
      {
        id: 'fac1',
        name: 'Tetouan Manufacturing',
        type: 'factory',
        position: [35.5728, -5.3934],
        description: 'Manufacturing facility for automotive components'
      },
      {
        id: 'wh2',
        name: 'Al Hoceima Warehouse',
        type: 'warehouse',
        position: [35.2408, -3.9292],
        description: 'Regional warehouse serving eastern areas'
      },
      {
        id: 'fac2',
        name: 'Larache Factory',
        type: 'factory',
        position: [35.2063, -6.1467],
        description: 'Production facility for textiles'
      },
      {
        id: 'store1',
        name: 'Chefchaouen Depot',
        type: 'store',
        position: [35.1788, -5.2536],
        description: 'Retail distribution center'
      },
      {
        id: 'store2',
        name: 'Asilah Outlet',
        type: 'store',
        position: [35.4659, -6.0337],
        description: 'Retail outlet for local distribution'
      },
      {
        id: 'wh3',
        name: 'Mdiq Distribution Center',
        type: 'warehouse',
        position: [35.6813, -5.3352],
        description: 'Coastal distribution center'
      }
    ];
    
    // Sample current routes
    const sampleCurrentRoutes: Route[] = [
      {
        id: 'route1',
        name: 'Port to Tangier DC',
        path: [
          [35.8838, -5.5088],
          [35.8505, -5.5776],
          [35.8102, -5.6532],
          [35.7691, -5.8034]
        ],
        color: '#F97316',
        weight: 4,
        efficiency: 65,
        distance: 42,
        time: 65,
        emissions: 3.8
      },
      {
        id: 'route2',
        name: 'Tangier DC to Tetouan',
        path: [
          [35.7691, -5.8034],
          [35.7384, -5.7201],
          [35.6992, -5.6120],
          [35.6728, -5.5134],
          [35.6321, -5.4489],
          [35.5728, -5.3934]
        ],
        color: '#F97316',
        weight: 4,
        efficiency: 58,
        distance: 78,
        time: 105,
        emissions: 6.2
      },
      {
        id: 'route3',
        name: 'Tetouan to Al Hoceima',
        path: [
          [35.5728, -5.3934],
          [35.5089, -5.2822],
          [35.4250, -5.0651],
          [35.3576, -4.8142],
          [35.3122, -4.6320],
          [35.2745, -4.2986],
          [35.2408, -3.9292]
        ],
        color: '#F97316',
        weight: 4,
        efficiency: 52,
        distance: 142,
        time: 205,
        emissions: 12.7
      },
      {
        id: 'route4',
        name: 'Tangier DC to Larache',
        path: [
          [35.7691, -5.8034],
          [35.6230, -5.9140],
          [35.4978, -6.0120],
          [35.3450, -6.1120],
          [35.2063, -6.1467]
        ],
        color: '#F97316',
        weight: 4,
        efficiency: 61,
        distance: 92,
        time: 122,
        emissions: 7.8
      },
      {
        id: 'route5',
        name: 'Tetouan to Chefchaouen',
        path: [
          [35.5728, -5.3934],
          [35.4728, -5.3534],
          [35.3728, -5.3134],
          [35.2728, -5.2834],
          [35.1788, -5.2536]
        ],
        color: '#F97316',
        weight: 4,
        efficiency: 72,
        distance: 63,
        time: 85,
        emissions: 4.9
      }
    ];
    
    // Sample optimized routes - will be shown if optimization is completed
    const sampleOptimizedRoutes: Route[] = [
      {
        id: 'opt-route1',
        name: 'Port to Tangier DC (Optimized)',
        path: [
          [35.8838, -5.5088],
          [35.8359, -5.5492],
          [35.8005, -5.6321],
          [35.7691, -5.8034]
        ],
        color: '#2563EB',
        weight: 4,
        efficiency: 85,
        distance: 38,
        time: 52,
        emissions: 3.2
      },
      {
        id: 'opt-route2',
        name: 'Tangier DC to Tetouan (Optimized)',
        path: [
          [35.7691, -5.8034],
          [35.7224, -5.6901],
          [35.6813, -5.3352], // Added M'diq waypoint
          [35.5728, -5.3934]
        ],
        color: '#2563EB',
        weight: 4,
        efficiency: 81,
        distance: 72,
        time: 88,
        emissions: 5.1
      },
      {
        id: 'opt-route3',
        name: 'Tetouan to Al Hoceima (Optimized)',
        path: [
          [35.5728, -5.3934],
          [35.4659, -5.0987],
          [35.3576, -4.7652],
          [35.2890, -4.3891],
          [35.2408, -3.9292]
        ],
        color: '#2563EB',
        weight: 4,
        efficiency: 79,
        distance: 132,
        time: 174,
        emissions: 9.8
      },
      {
        id: 'opt-route4',
        name: 'Tangier DC to Larache (Optimized)',
        path: [
          [35.7691, -5.8034],
          [35.6230, -5.9140],
          [35.4659, -6.0337], // Added Asilah waypoint
          [35.2063, -6.1467]
        ],
        color: '#2563EB',
        weight: 4,
        efficiency: 88,
        distance: 86,
        time: 104,
        emissions: 6.5
      },
      {
        id: 'opt-route5',
        name: 'Tetouan to Chefchaouen (Optimized)',
        path: [
          [35.5728, -5.3934],
          [35.3728, -5.3134],
          [35.1788, -5.2536]
        ],
        color: '#2563EB',
        weight: 4,
        efficiency: 94,
        distance: 58,
        time: 72,
        emissions: 3.9
      }
    ];
    
    setFacilities(sampleFacilities);
    setCurrentRoutes(sampleCurrentRoutes);
    setOptimizedRoutes(sampleOptimizedRoutes);
  }, []);
  
  const getFacilityIcon = (type: string) => {
    if (typeof window === 'undefined') return null;
    
    switch (type) {
      case 'warehouse':
        return WarehouseIcon;
      case 'factory':
        return factoryIcon;
      case 'port':
        return portIcon;
      case 'store':
        return storeIcon;
      default:
        return DefaultIcon;
    }
  };
  
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Calculate statistics for both route sets
  const calculateStats = (routes: Route[]) => {
    const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
    const totalTime = routes.reduce((sum, route) => sum + route.time, 0);
    const totalEmissions = routes.reduce((sum, route) => sum + route.emissions, 0);
    const avgEfficiency = routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length;
    
    return {
      totalDistance,
      totalTime,
      totalEmissions,
      avgEfficiency
    };
  };
  
  const currentStats = calculateStats(currentRoutes);
  const optimizedStats = calculateStats(optimizedRoutes);
  
  // Calculate improvements
  const improvements = {
    distance: ((currentStats.totalDistance - optimizedStats.totalDistance) / currentStats.totalDistance * 100).toFixed(1),
    time: ((currentStats.totalTime - optimizedStats.totalTime) / currentStats.totalTime * 100).toFixed(1),
    emissions: ((currentStats.totalEmissions - optimizedStats.totalEmissions) / currentStats.totalEmissions * 100).toFixed(1),
    efficiency: (optimizedStats.avgEfficiency - currentStats.avgEfficiency).toFixed(1)
  };
  
  if (!isClient) {
    // Return a loading state or placeholder when server-side rendering
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-display text-[#111827] mb-4">Route Comparison</h2>
        <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-display text-[#111827] mb-4">Route Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Route Map */}
        <div>
          <h3 className="font-medium text-[#111827] mb-3">Current Routes</h3>
          <div className="h-[400px] rounded-lg border border-gray-200 overflow-hidden">
            {/* MapContainer has to be client-side rendered */}
            <MapContainer 
              center={[35.5, -5.5]} 
              zoom={8} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Facilities */}
              {facilities.map(facility => (
                <Marker 
                  key={facility.id}
                  position={facility.position}
                  icon={getFacilityIcon(facility.type)}
                >
                  <Popup>
                    <div>
                      <h4 className="font-medium">{facility.name}</h4>
                      <p className="text-sm">{facility.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Current routes */}
              {currentRoutes.map(route => (
                <Polyline
                  key={route.id}
                  positions={route.path}
                  color={route.color}
                  weight={route.weight}
                  dashArray={route.dashArray}
                >
                  <Popup>
                    <div>
                      <h4 className="font-medium">{route.name}</h4>
                      <p className="text-sm">Distance: {route.distance} km</p>
                      <p className="text-sm">Estimated Time: {Math.floor(route.time / 60)}h {route.time % 60}m</p>
                      <p className="text-sm">CO₂ Emissions: {route.emissions} tons</p>
                      <p className="text-sm">
                        Efficiency: <span className={getEfficiencyColor(route.efficiency)}>{route.efficiency}%</span>
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              ))}
            </MapContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[#556068] mb-1">Total Distance</div>
              <div className="font-medium text-[#111827]">{currentStats.totalDistance} km</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-[#556068] mb-1">Average Efficiency</div>
              <div className={`font-medium ${getEfficiencyColor(currentStats.avgEfficiency)}`}>
                {currentStats.avgEfficiency.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Optimized Route Map */}
        <div>
          <h3 className="font-medium text-[#111827] mb-3">
            {isOptimized ? 'Optimized Routes' : 'Route Optimization Preview'}
          </h3>
          <div className="h-[400px] rounded-lg border border-gray-200 overflow-hidden">
            <MapContainer 
              center={[35.5, -5.5]} 
              zoom={8} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Facilities */}
              {facilities.map(facility => (
                <Marker 
                  key={facility.id}
                  position={facility.position}
                  icon={getFacilityIcon(facility.type)}
                >
                  <Popup>
                    <div>
                      <h4 className="font-medium">{facility.name}</h4>
                      <p className="text-sm">{facility.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Show optimized routes or current routes with dash pattern */}
              {isOptimized ? (
                optimizedRoutes.map(route => (
                  <Polyline
                    key={route.id}
                    positions={route.path}
                    color={route.color}
                    weight={route.weight}
                  >
                    <Popup>
                      <div>
                        <h4 className="font-medium">{route.name}</h4>
                        <p className="text-sm">Distance: {route.distance} km</p>
                        <p className="text-sm">Estimated Time: {Math.floor(route.time / 60)}h {route.time % 60}m</p>
                        <p className="text-sm">CO₂ Emissions: {route.emissions} tons</p>
                        <p className="text-sm">
                          Efficiency: <span className={getEfficiencyColor(route.efficiency)}>{route.efficiency}%</span>
                        </p>
                      </div>
                    </Popup>
                  </Polyline>
                ))
              ) : (
                currentRoutes.map(route => (
                  <Polyline
                    key={`preview-${route.id}`}
                    positions={route.path}
                    color="#999999"
                    weight={3}
                    dashArray="5, 10"
                    opacity={0.7}
                  />
                ))
              )}
            </MapContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {isOptimized ? (
              <>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-[#556068] mb-1">Total Distance</div>
                  <div className="font-medium text-[#111827]">
                    {optimizedStats.totalDistance} km
                    <span className="ml-2 text-green-600 text-xs">
                      (-{improvements.distance}%)
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-[#556068] mb-1">Average Efficiency</div>
                  <div className={`font-medium ${getEfficiencyColor(optimizedStats.avgEfficiency)}`}>
                    {optimizedStats.avgEfficiency.toFixed(1)}%
                    <span className="ml-2 text-green-600 text-xs">
                      (+{improvements.efficiency}%)
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-2 bg-[#683cec]/5 border border-[#683cec]/20 rounded-lg p-3 text-center">
                <div className="text-[#683cec] mb-1">Run optimization to see improved routes</div>
                <div className="text-[#556068] text-xs">
                  Set your parameters and click "Run AI Route Optimization"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Summary comparison */}
      {isOptimized && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="font-medium text-[#111827] mb-4">Optimization Impact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-700 font-medium mb-1">Distance Reduction</div>
              <div className="text-2xl font-display text-green-600">{improvements.distance}%</div>
              <div className="text-sm text-[#556068] mt-1">
                {currentStats.totalDistance - optimizedStats.totalDistance} km saved
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-blue-700 font-medium mb-1">Time Savings</div>
              <div className="text-2xl font-display text-blue-600">{improvements.time}%</div>
              <div className="text-sm text-[#556068] mt-1">
                {Math.floor((currentStats.totalTime - optimizedStats.totalTime) / 60)}h {(currentStats.totalTime - optimizedStats.totalTime) % 60}m saved
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-emerald-700 font-medium mb-1">Emissions Reduction</div>
              <div className="text-2xl font-display text-emerald-600">{improvements.emissions}%</div>
              <div className="text-sm text-[#556068] mt-1">
                {(currentStats.totalEmissions - optimizedStats.totalEmissions).toFixed(1)} tons CO₂ saved
              </div>
            </div>
            
            <div className="bg-[#683cec]/5 rounded-lg p-4">
              <div className="text-[#683cec] font-medium mb-1">Efficiency Improvement</div>
              <div className="text-2xl font-display text-[#683cec]">{improvements.efficiency}%</div>
              <div className="text-sm text-[#556068] mt-1">
                Overall network performance gain
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 