'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Supplier } from './suppliersData';

interface SupplierMapProps {
  suppliers: Supplier[];
  selectedSupplierId?: string;
  comparisonSupplierId?: string;
}

export default function SupplierMap({ suppliers, selectedSupplierId, comparisonSupplierId }: SupplierMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get selected supplier and comparison supplier
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
  const comparisonSupplier = suppliers.find(s => s.id === comparisonSupplierId);
  
  // Map boundaries approximately covering Morocco
  const mapBounds = {
    west: -13.2, // Westernmost point
    east: -1, // Easternmost point 
    north: 36, // Northernmost point
    south: 27.5, // Southernmost point
  };
  
  // Cities to display on the map
  const majorCities = [
    { name: 'Casablanca', coords: [-7.5898, 33.5731] },
    { name: 'Rabat', coords: [-6.8498, 34.0209] },
    { name: 'Marrakech', coords: [-8.0083, 31.6295] },
    { name: 'Fez', coords: [-5.0078, 34.0181] },
    { name: 'Tangier', coords: [-5.8326, 35.7595] },
    { name: 'Agadir', coords: [-9.5981, 30.4278] },
    { name: 'Meknes', coords: [-5.5574, 33.8935] }
  ];
  
  // Draw the map on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Function to convert coordinates to canvas position
        const coordToCanvasPos = (lon: number, lat: number) => {
          const x = ((lon - mapBounds.west) / (mapBounds.east - mapBounds.west)) * canvas.width;
          const y = canvas.height - ((lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * canvas.height;
          return { x, y };
        };
        
        // Function to draw a circle at a specific location
        const drawCircle = (lon: number, lat: number, radius: number, color: string, fill = true) => {
          const { x, y } = coordToCanvasPos(lon, lat);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
          } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        };
        
        // Draw connecting line if both selected and comparison suppliers exist
        if (selectedSupplier && comparisonSupplier) {
          const startPos = coordToCanvasPos(selectedSupplier.coordinates[0], selectedSupplier.coordinates[1]);
          const endPos = coordToCanvasPos(comparisonSupplier.coordinates[0], comparisonSupplier.coordinates[1]);
          
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(endPos.x, endPos.y);
          ctx.strokeStyle = '#683cec40';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Draw distance text
          const midX = (startPos.x + endPos.x) / 2;
          const midY = (startPos.y + endPos.y) / 2;
          
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#111827';
          ctx.fillText(`${selectedSupplier.distance} km`, midX + 10, midY - 10);
        }
        
        // Draw border of Morocco (simplified)
        const moroccoPath = [
          [-5.0, 35.8], // North coast near Tangier
          [-1.5, 35.0], // Northeast border with Algeria
          [-1.0, 32.5], // East border
          [-4.0, 30.0], // Southeast
          [-9.0, 28.0], // Southwest
          [-12.0, 28.5], // Western Sahara coast
          [-11.0, 33.0], // West coast
          [-9.5, 34.0], // Northwest coast
          [-6.5, 35.5], // North coast
          [-5.0, 35.8], // Back to start
        ];
        
        ctx.beginPath();
        const firstPoint = coordToCanvasPos(moroccoPath[0][0], moroccoPath[0][1]);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        
        for (let i = 1; i < moroccoPath.length; i++) {
          const { x, y } = coordToCanvasPos(moroccoPath[i][0], moroccoPath[i][1]);
          ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#556068';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw cities
        majorCities.forEach(city => {
          const { x, y } = coordToCanvasPos(city.coords[0], city.coords[1]);
          
          // City dot
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#556068';
          ctx.fill();
          
          // City name
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#556068';
          ctx.fillText(city.name, x + 6, y - 4);
        });
        
        // Draw all suppliers as small dots
        suppliers.forEach(supplier => {
          // Skip selected supplier and comparison supplier, they'll be drawn larger
          if (supplier.id !== selectedSupplierId && supplier.id !== comparisonSupplierId) {
            drawCircle(supplier.coordinates[0], supplier.coordinates[1], 5, '#32C8CD');
          }
        });
        
        // Draw selected supplier
        if (selectedSupplier) {
          drawCircle(selectedSupplier.coordinates[0], selectedSupplier.coordinates[1], 8, '#683cec');
          drawCircle(selectedSupplier.coordinates[0], selectedSupplier.coordinates[1], 12, '#683cec', false);
          
          // Draw name
          const { x, y } = coordToCanvasPos(selectedSupplier.coordinates[0], selectedSupplier.coordinates[1]);
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#111827';
          ctx.fillText(selectedSupplier.name, x + 15, y + 5);
          
          // Draw location
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#556068';
          ctx.fillText(selectedSupplier.location, x + 15, y + 20);
        }
        
        // Draw comparison supplier
        if (comparisonSupplier) {
          drawCircle(comparisonSupplier.coordinates[0], comparisonSupplier.coordinates[1], 8, '#9747FF');
          drawCircle(comparisonSupplier.coordinates[0], comparisonSupplier.coordinates[1], 12, '#9747FF', false);
          
          // Draw name
          const { x, y } = coordToCanvasPos(comparisonSupplier.coordinates[0], comparisonSupplier.coordinates[1]);
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#111827';
          ctx.fillText(comparisonSupplier.name, x + 15, y + 5);
          
          // Draw location
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#556068';
          ctx.fillText(comparisonSupplier.location, x + 15, y + 20);
        }
        
        // Drawing complete, set loading to false
        setIsLoading(false);
      }
    }
  }, [suppliers, selectedSupplierId, comparisonSupplierId, mapBounds]);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-[#111827]">Supplier Location Map</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#683cec] mr-2"></div>
            <span className="text-xs text-[#556068]">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#9747FF] mr-2"></div>
            <span className="text-xs text-[#556068]">Comparison</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#32C8CD] mr-2"></div>
            <span className="text-xs text-[#556068]">Other Suppliers</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#683cec]"></div>
          </div>
        )}
        <canvas 
          ref={canvasRef}
          className="w-full h-full rounded-lg bg-gray-50"
        />
      </div>
      
      {selectedSupplier && (
        <div className="mt-3 text-xs text-[#556068]">
          <p>
            <span className="font-medium">Proximity advantages:</span> 
            {selectedSupplier.distance < 100 
              ? ' Excellent proximity for daily deliveries and rapid response. Minimal shipping costs.'
              : selectedSupplier.distance < 200 
                ? ' Good proximity for frequent deliveries and fast response. Low shipping costs.'
                : ' Within reasonable distance for regular scheduled shipments.'}
          </p>
        </div>
      )}
    </div>
  );
} 