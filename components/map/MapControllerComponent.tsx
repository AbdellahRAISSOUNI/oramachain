'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

// Component to control the map view
const MapControllerComponent = ({ center, zoom }: MapControllerProps) => {
  // We can't use useMap directly at the module level with Next.js
  // because it's not available during server-side rendering
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Import react-leaflet and get the map
    const getMap = async () => {
      try {
        // Dynamically import useMap
        const { useMap } = await import('react-leaflet');
        
        // Get the map instance
        const map = useMap();
        
        if (map) {
          map.setView(center, zoom);
        }
      } catch (error) {
        console.error('Error setting map view:', error);
      }
    };
    
    getMap();
  }, [center, zoom]);
  
  return null;
};

export default MapControllerComponent; 