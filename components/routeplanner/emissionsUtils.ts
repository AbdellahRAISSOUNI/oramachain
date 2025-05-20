// Emission factors by vehicle/fuel type (kg CO2e per km)
export const EMISSION_FACTORS = {
  car: {
    petrol: 0.192,
    diesel: 0.171,
    hybrid: 0.118,
    electric: 0.053
  },
  truck: {
    small: 0.207,
    medium: 0.583,
    large: 0.932
  },
  van: {
    small: 0.142,
    medium: 0.217,
    large: 0.293
  }
};

// Carbon impact equivalents
export const CARBON_EQUIVALENTS = {
  treeDay: 0.022, // kg CO2 absorbed by one tree in one day
  treeYear: 8.0,  // kg CO2 absorbed by one tree in one year
  carKm: 0.192,   // kg CO2 from average car per km
  flightKm: 0.115, // kg CO2 per passenger km in economy flight
  smartphone: 80,  // kg CO2 to manufacture a smartphone
  laptop: 300,     // kg CO2 to manufacture a laptop
  beef1kg: 60,     // kg CO2 to produce 1kg of beef
};

// Types for emissions calculations
export interface VehicleData {
  type: 'car' | 'truck' | 'van';
  subtype: string; // petrol/diesel/hybrid/electric for cars, small/medium/large for trucks/vans
  efficiency: number; // 0-1 scale, relative efficiency within its category
  capacity: number; // passengers or cargo capacity in kg
  utilization: number; // 0-1 scale, how full the vehicle is
}

export interface RouteEmissionsParams {
  distance: number; // km
  vehicleData: VehicleData;
  trafficFactor: number; // 1.0 = no impact, higher = more emissions due to traffic
  weatherFactor: number; // 1.0 = no impact, higher = more emissions due to weather
  terrain: 'flat' | 'hilly' | 'mountainous';
  cargoWeight?: number; // kg, optional for freight
}

export interface EmissionsBreakdown {
  total: number;
  base: number;
  traffic: number;
  weather: number;
  terrain: number;
  byDistance: number;
  perKm: number;
  perPassengerKm?: number;
  perTonneKm?: number;
}

/**
 * Calculate detailed emissions breakdown for a route
 */
export function calculateEmissions(params: RouteEmissionsParams): EmissionsBreakdown {
  const { distance, vehicleData, trafficFactor, weatherFactor, terrain, cargoWeight } = params;
  const { type, subtype, efficiency, capacity, utilization } = vehicleData;
  
  // Get base emission factor
  let baseFactor = 0;
  if (type === 'car') {
    baseFactor = EMISSION_FACTORS.car[subtype as keyof typeof EMISSION_FACTORS.car];
  } else if (type === 'truck') {
    baseFactor = EMISSION_FACTORS.truck[subtype as keyof typeof EMISSION_FACTORS.truck];
  } else if (type === 'van') {
    baseFactor = EMISSION_FACTORS.van[subtype as keyof typeof EMISSION_FACTORS.van];
  }
  
  // Apply efficiency factor (better efficiency = lower emissions)
  const efficiencyFactor = 1 - (efficiency * 0.3); // Max 30% reduction for high efficiency
  
  // Apply terrain factor
  const terrainFactors = {
    flat: 1.0,
    hilly: 1.15,
    mountainous: 1.35
  };
  const terrainFactor = terrainFactors[terrain];
  
  // Calculate base emissions for the distance
  const baseEmissions = baseFactor * distance * efficiencyFactor;
  
  // Calculate additional emissions from each factor
  const trafficEmissions = baseEmissions * (trafficFactor - 1);
  const weatherEmissions = baseEmissions * (weatherFactor - 1);
  const terrainEmissions = baseEmissions * (terrainFactor - 1);
  
  // Total emissions
  const totalEmissions = baseEmissions + trafficEmissions + weatherEmissions + terrainEmissions;
  
  // Per kilometer and passenger/tonne calculations
  const emissionsPerKm = totalEmissions / distance;
  
  let result: EmissionsBreakdown = {
    total: parseFloat(totalEmissions.toFixed(2)),
    base: parseFloat(baseEmissions.toFixed(2)),
    traffic: parseFloat(trafficEmissions.toFixed(2)),
    weather: parseFloat(weatherEmissions.toFixed(2)),
    terrain: parseFloat(terrainEmissions.toFixed(2)),
    byDistance: parseFloat((totalEmissions / distance * 100).toFixed(2)), // per 100km
    perKm: parseFloat(emissionsPerKm.toFixed(3))
  };
  
  // Add passenger or freight specific metrics
  if (type === 'car') {
    // For passenger vehicles, calculate per passenger-km
    const passengerCount = Math.max(1, Math.round(capacity * utilization));
    const perPassengerKm = emissionsPerKm / passengerCount;
    result.perPassengerKm = parseFloat(perPassengerKm.toFixed(3));
  } else {
    // For freight vehicles, calculate per tonne-km if cargo weight is provided
    if (cargoWeight && cargoWeight > 0) {
      const cargoTonnes = cargoWeight / 1000; // Convert kg to tonnes
      const perTonneKm = emissionsPerKm / cargoTonnes;
      result.perTonneKm = parseFloat(perTonneKm.toFixed(3));
    }
  }
  
  return result;
}

/**
 * Calculate environmental impact equivalents
 */
export function calculateEquivalents(emissions: number) {
  return {
    treeDays: Math.round(emissions / CARBON_EQUIVALENTS.treeDay),
    treeYears: parseFloat((emissions / CARBON_EQUIVALENTS.treeYear).toFixed(2)),
    carKm: Math.round(emissions / CARBON_EQUIVALENTS.carKm),
    flightKm: Math.round(emissions / CARBON_EQUIVALENTS.flightKm),
    smartphones: parseFloat((emissions / CARBON_EQUIVALENTS.smartphone).toFixed(2)),
    laptops: parseFloat((emissions / CARBON_EQUIVALENTS.laptop).toFixed(2)),
    beefKg: parseFloat((emissions / CARBON_EQUIVALENTS.beef1kg).toFixed(1))
  };
}

/**
 * Calculate emissions reduction from optimization strategies
 */
export function calculateOptimizationSavings(baseEmissions: number, strategies: Record<string, number>) {
  const results: Record<string, { absolute: number, percentage: number }> = {};
  
  for (const [strategy, factor] of Object.entries(strategies)) {
    const reduction = baseEmissions * factor;
    results[strategy] = {
      absolute: parseFloat(reduction.toFixed(2)),
      percentage: parseFloat((factor * 100).toFixed(1))
    };
  }
  
  return results;
}

/**
 * Convert traffic and weather sliders (0-100) to factors for calculations
 */
export function getEnvironmentalFactors(trafficLevel: number, weatherConditions: number) {
  // Traffic factor ranges from 1.0 (no traffic) to 1.5 (heavy traffic)
  const trafficFactor = 1 + (trafficLevel / 100 * 0.5);
  
  // Weather factor ranges from 1.0 (perfect weather) to 1.3 (severe weather)
  const weatherFactor = 1 + (weatherConditions / 100 * 0.3);
  
  return { trafficFactor, weatherFactor };
}

/**
 * Predefined vehicle profiles for easy selection
 */
export const VEHICLE_PROFILES: Record<string, VehicleData> = {
  smallCar: {
    type: 'car',
    subtype: 'petrol',
    efficiency: 0.7,
    capacity: 5,
    utilization: 0.4 // 2 people in 5-seater
  },
  efficientCar: {
    type: 'car',
    subtype: 'hybrid',
    efficiency: 0.9,
    capacity: 5,
    utilization: 0.4
  },
  electricCar: {
    type: 'car',
    subtype: 'electric',
    efficiency: 0.95,
    capacity: 5,
    utilization: 0.4
  },
  deliveryVan: {
    type: 'van',
    subtype: 'medium',
    efficiency: 0.7,
    capacity: 1500, // kg
    utilization: 0.6
  },
  heavyTruck: {
    type: 'truck',
    subtype: 'large',
    efficiency: 0.6,
    capacity: 25000, // kg
    utilization: 0.8
  }
}; 