'use client';

import { useEffect } from 'react';

// Create a component that uses the useMap hook internally
// This pattern ensures the hook is only used during client-side rendering
const MapControllerComponent = (props: { center: [number, number]; zoom: number }) => {
  // Only render the actual controller on the client side
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Dynamically render MapController that uses useMap
  // This ensures useMap is only called on the client side
  return <ClientSideMapController center={props.center} zoom={props.zoom} />;
};

// This component will only be rendered on the client side
function ClientSideMapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  // Import useMap directly since we're guaranteed to be on the client side
  const { useMap } = require('react-leaflet');
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

export default MapControllerComponent; 