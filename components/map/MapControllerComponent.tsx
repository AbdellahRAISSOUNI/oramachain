'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

// Component to control the map view
const MapControllerComponent = ({ center, zoom }: MapControllerProps) => {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

export default MapControllerComponent; 