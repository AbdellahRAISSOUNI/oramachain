'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define types for nodes in our supply chain
interface SupplyChainNode {
  id: string;
  name: string;
  type: 'supplier' | 'manufacturer' | 'warehouse' | 'distribution' | 'retailer';
  position: [number, number];
  description: string;
  metrics: {
    capacity: number;
    utilization: number;
    throughput: number;
    efficiency: number;
  };
}

// Define types for connections between nodes
interface SupplyChainConnection {
  id: string;
  source: string;
  target: string;
  type: 'primary' | 'secondary' | 'emergency';
  metrics: {
    volume: number;
    cost: number;
    time: number;
    reliability: number;
  };
}

// Define types for flowing data packets
interface FlowingData {
  id: string;
  connectionId: string;
  position: [number, number];
  progress: number;
  direction: 'forward' | 'backward';
}

// Helper to interpolate position along a connection path
const interpolatePosition = (
  startPos: [number, number], 
  endPos: [number, number], 
  progress: number
): [number, number] => {
  return [
    startPos[0] + (endPos[0] - startPos[0]) * progress,
    startPos[1] + (endPos[1] - startPos[1]) * progress
  ];
};

// Component to animate data flow along connections
const AnimatedDataFlow = ({ 
  connection, 
  nodes, 
  speed = 5000 
}: { 
  connection: SupplyChainConnection; 
  nodes: SupplyChainNode[];
  speed?: number;
}) => {
  const [dataPackets, setDataPackets] = useState<FlowingData[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Find the source and target nodes
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);
  
  useEffect(() => {
    if (!sourceNode || !targetNode) return;
    
    // Initialize data packets
    const packets: FlowingData[] = [];
    const packetCount = Math.max(1, Math.round(connection.metrics.volume / 20));
    
    for (let i = 0; i < packetCount; i++) {
      packets.push({
        id: `packet-${connection.id}-${i}`,
        connectionId: connection.id,
        position: sourceNode.position,
        progress: (i / packetCount) * 0.8, // Distribute packets along the path
        direction: 'forward'
      });
    }
    
    setDataPackets(packets);
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      
      setDataPackets(prevPackets => 
        prevPackets.map(packet => {
          // Increment progress, wrapping around at 1
          let newProgress = packet.progress + (0.0005 * (connection.metrics.reliability / 100));
          if (newProgress > 1) newProgress = 0;
          
          // Calculate new position
          const newPosition = interpolatePosition(
            sourceNode.position,
            targetNode.position,
            newProgress
          );
          
          return {
            ...packet,
            position: newPosition,
            progress: newProgress
          };
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sourceNode, targetNode, connection]);
  
  return (
    <>
      {dataPackets.map(packet => (
        <CircleMarker
          key={packet.id}
          center={packet.position}
          radius={3}
          pathOptions={{ 
            fillColor: connection.type === 'primary' ? '#32C8CD' : 
                      connection.type === 'secondary' ? '#f59e0b' : 
                      '#ef4444',
            fillOpacity: 0.8,
            stroke: false
          }}
        />
      ))}
    </>
  );
};

// Supply Chain Map Component
const SupplyChainMap = ({ height = "800px" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<SupplyChainNode | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.26, -5.56]); // Center on northern Morocco
  const [mapZoom, setMapZoom] = useState(9); // Higher zoom level for the region
  const [showMetrics, setShowMetrics] = useState(true);
  const [animateData, setAnimateData] = useState(true);
  
  // Sample data for the supply chain network in Northern Morocco
  const [nodes, setNodes] = useState<SupplyChainNode[]>([
    {
      id: 'sup-1',
      name: 'Tanger Free Zone Production',
      type: 'supplier',
      position: [35.725, -5.898], // Tanger Free Zone
      description: 'Main automotive and electronics component manufacturing facility',
      metrics: { capacity: 1000, utilization: 82, throughput: 820, efficiency: 92 }
    },
    {
      id: 'sup-2',
      name: 'Tetouan Industrial Park',
      type: 'supplier',
      position: [35.575, -5.365], // Tetouan
      description: 'Textiles and consumer goods production center',
      metrics: { capacity: 800, utilization: 75, throughput: 600, efficiency: 85 }
    },
    {
      id: 'man-1',
      name: 'Tanger Automotive City',
      type: 'manufacturer',
      position: [35.68, -5.81], // Tanger Automotive City
      description: 'Vehicle assembly and manufacturing hub',
      metrics: { capacity: 1200, utilization: 90, throughput: 1080, efficiency: 88 }
    },
    {
      id: 'wh-1',
      name: 'Tanger Med Port Warehouse',
      type: 'warehouse',
      position: [35.895, -5.5], // Tanger Med Port
      description: 'Maritime logistics and container storage',
      metrics: { capacity: 5000, utilization: 65, throughput: 3250, efficiency: 78 }
    },
    {
      id: 'wh-2',
      name: 'Fnideq Storage Facility',
      type: 'warehouse',
      position: [35.85, -5.35], // Fnideq
      description: 'Border logistics and customs storage',
      metrics: { capacity: 2500, utilization: 72, throughput: 1800, efficiency: 82 }
    },
    {
      id: 'dist-1',
      name: 'Tetouan Distribution Center',
      type: 'distribution',
      position: [35.55, -5.4], // Tetouan
      description: 'Regional distribution hub for northern Morocco',
      metrics: { capacity: 2500, utilization: 88, throughput: 2200, efficiency: 91 }
    },
    {
      id: 'dist-2',
      name: 'Chefchaouen Distribution Point',
      type: 'distribution',
      position: [35.17, -5.27], // Chefchaouen
      description: 'Mountain region distribution center',
      metrics: { capacity: 1200, utilization: 62, throughput: 740, efficiency: 79 }
    },
    {
      id: 'ret-1',
      name: 'Tangier City Mall',
      type: 'retailer',
      position: [35.76, -5.8], // Tangier city center
      description: 'Main urban retail center',
      metrics: { capacity: 500, utilization: 95, throughput: 475, efficiency: 93 }
    },
    {
      id: 'ret-2',
      name: 'Martil Coastal Outlet',
      type: 'retailer',
      position: [35.62, -5.28], // Martil
      description: 'Coastal tourist retail center',
      metrics: { capacity: 350, utilization: 92, throughput: 322, efficiency: 89 }
    },
    {
      id: 'ret-3',
      name: 'Al Hoceima Market',
      type: 'retailer',
      position: [35.25, -3.94], // Al Hoceima
      description: 'Eastern regional retail hub',
      metrics: { capacity: 400, utilization: 78, throughput: 312, efficiency: 81 }
    },
    {
      id: 'ret-4',
      name: 'Larache Retail Center',
      type: 'retailer',
      position: [35.19, -6.15], // Larache
      description: 'Southwestern retail distribution',
      metrics: { capacity: 320, utilization: 68, throughput: 218, efficiency: 77 }
    }
  ]);
  
  const [connections, setConnections] = useState<SupplyChainConnection[]>([
    {
      id: 'conn-1',
      source: 'sup-1',
      target: 'man-1',
      type: 'primary',
      metrics: { volume: 100, cost: 250, time: 2, reliability: 98 }
    },
    {
      id: 'conn-2',
      source: 'sup-2',
      target: 'man-1',
      type: 'primary',
      metrics: { volume: 85, cost: 320, time: 3, reliability: 94 }
    },
    {
      id: 'conn-3',
      source: 'man-1',
      target: 'wh-1',
      type: 'primary',
      metrics: { volume: 120, cost: 180, time: 2, reliability: 95 }
    },
    {
      id: 'conn-4',
      source: 'man-1',
      target: 'wh-2',
      type: 'primary',
      metrics: { volume: 140, cost: 220, time: 2, reliability: 92 }
    },
    {
      id: 'conn-5',
      source: 'wh-1',
      target: 'dist-1',
      type: 'secondary',
      metrics: { volume: 70, cost: 350, time: 4, reliability: 89 }
    },
    {
      id: 'conn-6',
      source: 'wh-2',
      target: 'dist-1',
      type: 'secondary',
      metrics: { volume: 65, cost: 135, time: 1, reliability: 87 }
    },
    {
      id: 'conn-7',
      source: 'dist-1',
      target: 'dist-2',
      type: 'secondary',
      metrics: { volume: 40, cost: 280, time: 3, reliability: 85 }
    },
    {
      id: 'conn-8',
      source: 'dist-1',
      target: 'ret-1',
      type: 'primary',
      metrics: { volume: 55, cost: 260, time: 3, reliability: 91 }
    },
    {
      id: 'conn-9',
      source: 'dist-1',
      target: 'ret-2',
      type: 'primary',
      metrics: { volume: 60, cost: 120, time: 1, reliability: 93 }
    },
    {
      id: 'conn-10',
      source: 'dist-2',
      target: 'ret-3',
      type: 'secondary',
      metrics: { volume: 35, cost: 450, time: 5, reliability: 82 }
    },
    {
      id: 'conn-11',
      source: 'wh-1',
      target: 'ret-4',
      type: 'emergency',
      metrics: { volume: 25, cost: 350, time: 4, reliability: 79 }
    },
    {
      id: 'conn-12',
      source: 'wh-1',
      target: 'ret-1',
      type: 'emergency',
      metrics: { volume: 15, cost: 220, time: 2, reliability: 80 }
    }
  ]);
  
  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter(node => {
    // Apply search term filter
    const matchesSearch = searchTerm === '' || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter.length === 0 || typeFilter.includes(node.type);
    
    return matchesSearch && matchesType;
  });
  
  // Filter connections based on filtered nodes
  const filteredConnections = connections.filter(conn => {
    const sourceExists = filteredNodes.some(node => node.id === conn.source);
    const targetExists = filteredNodes.some(node => node.id === conn.target);
    return sourceExists && targetExists;
  });
  
  // Get node colors based on type
  const getNodeColor = (type: string) => {
    switch(type) {
      case 'supplier': return '#3A86FF';
      case 'manufacturer': return '#FF006E';
      case 'warehouse': return '#FFBE0B';
      case 'distribution': return '#8338EC';
      case 'retailer': return '#3BD16F';
      default: return '#CCCCCC';
    }
  };
  
  // Get connection color based on type
  const getConnectionColor = (type: string) => {
    switch(type) {
      case 'primary': return '#32C8CD';
      case 'secondary': return '#f59e0b';
      case 'emergency': return '#ef4444';
      default: return '#CCCCCC';
    }
  };
  
  // Calculate node size based on capacity and utilization
  const getNodeSize = (node: SupplyChainNode) => {
    // Base size on capacity, with a min of 5 and max of 15
    const baseSize = Math.max(5, Math.min(15, node.metrics.capacity / 100));
    // Adjust size slightly based on utilization
    return baseSize * (0.8 + (node.metrics.utilization / 500));
  };
  
  // Update map center and zoom when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setMapCenter(selectedNode.position);
      setMapZoom(11);
    } else {
      // Reset to Northern Morocco view
      setMapCenter([35.26, -5.56]);
      setMapZoom(9);
    }
  }, [selectedNode]);
  
  // MapViewSetter component to update map view
  const MapViewSetter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  // Toggle node type in filter
  const toggleTypeFilter = (type: string) => {
    if (typeFilter.includes(type)) {
      setTypeFilter(typeFilter.filter(t => t !== type));
    } else {
      setTypeFilter([...typeFilter, type]);
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Controls bar */}
      <div className="bg-white p-4 rounded-t-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-grow max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search facilities in Northern Morocco..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#683cec]"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Filter:</span>
          {['supplier', 'manufacturer', 'warehouse', 'distribution', 'retailer'].map(type => (
            <button
              key={type}
              onClick={() => toggleTypeFilter(type)}
              className={`px-3 py-1 text-xs rounded-full border ${
                typeFilter.includes(type) 
                  ? 'bg-[#683cec] text-white border-[#683cec]' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        
        {/* View controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className={`px-3 py-1 text-xs rounded-lg border ${
              showMetrics 
                ? 'bg-[#683cec] text-white border-[#683cec]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
          </button>
          <button
            onClick={() => setAnimateData(!animateData)}
            className={`px-3 py-1 text-xs rounded-lg border ${
              animateData 
                ? 'bg-[#683cec] text-white border-[#683cec]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {animateData ? 'Pause Flow' : 'Animate Flow'}
          </button>
          <button
            onClick={() => {
              setSelectedNode(null);
              setMapCenter([35.26, -5.56]);
              setMapZoom(9);
            }}
            className="px-3 py-1 text-xs rounded-lg border bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            Reset View
          </button>
        </div>
      </div>
    
      {/* Map container */}
      <div className="flex-grow relative border-x border-b border-gray-200 rounded-b-xl overflow-hidden" style={{ height }}>
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapViewSetter center={mapCenter} zoom={mapZoom} />
          
          {/* Base map layer - using satellite view for Morocco */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
          />
          
          {/* Optional additional layer for labels */}
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
          />
          
          {/* Connection lines */}
          {filteredConnections.map(conn => {
            // Find source and target nodes
            const source = nodes.find(n => n.id === conn.source);
            const target = nodes.find(n => n.id === conn.target);
            
            if (!source || !target) return null;
            
            return (
              <div key={conn.id}>
                <Polyline
                  positions={[source.position, target.position]}
                  pathOptions={{
                    color: getConnectionColor(conn.type),
                    weight: Math.max(1, Math.min(5, conn.metrics.volume / 30)),
                    opacity: 0.7,
                    dashArray: conn.type === 'emergency' ? '5,10' : undefined
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs">
                      <div className="font-medium">{source.name} → {target.name}</div>
                      <div className="text-gray-500 grid grid-cols-2 gap-x-2 gap-y-1">
                        <span>Volume:</span>
                        <span className="font-medium">{conn.metrics.volume} units/day</span>
                        <span>Cost:</span>
                        <span className="font-medium">{conn.metrics.cost} MAD/shipment</span>
                        <span>Transit time:</span>
                        <span className="font-medium">{conn.metrics.time} hours</span>
                        <span>Reliability:</span>
                        <span className="font-medium">{conn.metrics.reliability}%</span>
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
                
                {/* Animated data flow */}
                {animateData && (
                  <AnimatedDataFlow connection={conn} nodes={nodes} />
                )}
              </div>
            );
          })}
          
          {/* Facility nodes */}
          {filteredNodes.map(node => (
            <CircleMarker
              key={node.id}
              center={node.position}
              radius={getNodeSize(node)}
              eventHandlers={{
                click: () => setSelectedNode(node)
              }}
              pathOptions={{
                fillColor: getNodeColor(node.type),
                fillOpacity: 0.8,
                color: selectedNode?.id === node.id ? '#111827' : getNodeColor(node.type),
                weight: selectedNode?.id === node.id ? 3 : 1
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={showMetrics}>
                <div className="text-xs font-medium">
                  {node.name}
                  {showMetrics && (
                    <div className="mt-1 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${node.metrics.utilization}%` }}
                      />
                    </div>
                  )}
                </div>
              </Tooltip>
              
              <Popup>
                <div className="text-sm">
                  <div className="font-medium text-[#111827] mb-1">{node.name}</div>
                  <div className="text-[#556068] text-xs mb-2">{node.description}</div>
                  <div className="text-[#556068] grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{node.type}</span>
                    <span>Capacity:</span>
                    <span className="font-medium">{node.metrics.capacity} units</span>
                    <span>Utilization:</span>
                    <span className="font-medium">{node.metrics.utilization}%</span>
                    <span>Throughput:</span>
                    <span className="font-medium">{node.metrics.throughput} units/day</span>
                    <span>Efficiency:</span>
                    <span className="font-medium">{node.metrics.efficiency}%</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Selected node details panel */}
        {selectedNode && (
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-4 max-w-xs border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-md font-medium text-[#111827]">{selectedNode.name}</h3>
              <button 
                onClick={() => setSelectedNode(null)} 
                className="text-[#556068] hover:text-[#111827]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#556068] mb-1">Facility Type</div>
                <div className="text-sm font-medium text-[#111827] capitalize">{selectedNode.type}</div>
              </div>
              
              <div>
                <div className="text-xs text-[#556068] mb-1">Description</div>
                <div className="text-sm text-[#111827]">{selectedNode.description}</div>
              </div>
              
              <div>
                <div className="text-xs text-[#556068] mb-1">Capacity Utilization</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedNode.metrics.utilization >= 90 ? 'bg-red-500' : 
                        selectedNode.metrics.utilization >= 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} 
                      style={{ width: `${selectedNode.metrics.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[#111827]">{selectedNode.metrics.utilization}%</span>
                </div>
                <div className="text-xs text-[#556068] mt-1">
                  {selectedNode.metrics.throughput} of {selectedNode.metrics.capacity} units/day
                </div>
              </div>
              
              <div>
                <div className="text-xs text-[#556068] mb-1">Efficiency Rating</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedNode.metrics.efficiency >= 90 ? 'bg-green-500' : 
                        selectedNode.metrics.efficiency >= 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} 
                      style={{ width: `${selectedNode.metrics.efficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[#111827]">{selectedNode.metrics.efficiency}%</span>
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
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white bg-opacity-90 rounded-lg p-3 shadow-sm text-xs border border-gray-200">
          <div className="font-medium mb-1 text-gray-700">Northern Morocco Supply Chain</div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#3A86FF] mr-1"></div>
              <span className="text-[#111827]">Supplier</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#FF006E] mr-1"></div>
              <span className="text-[#111827]">Manufacturer</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#FFBE0B] mr-1"></div>
              <span className="text-[#111827]">Warehouse</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#8338EC] mr-1"></div>
              <span className="text-[#111827]">Distribution Center</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#3BD16F] mr-1"></div>
              <span className="text-[#111827]">Retailer</span>
            </div>
            <div className="mt-1 border-t border-gray-200 pt-1">
              <div className="flex items-center">
                <div className="h-1 w-5 bg-[#32C8CD] mr-1"></div>
                <span className="text-[#111827]">Primary Route</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-5 bg-[#f59e0b] mr-1"></div>
                <span className="text-[#111827]">Secondary Route</span>
              </div>
              <div className="flex items-center">
                <div className="h-1 w-5 bg-[#ef4444] mr-1 border-0 border-t border-dashed"></div>
                <span className="text-[#111827]">Emergency Route</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainMap; 