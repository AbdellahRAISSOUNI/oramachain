import { City, RouteOption } from './RoutePlannerInterface';

// Define major cities in Morocco
export const cities: City[] = [
  {
    id: 'tangier',
    name: 'Tangier',
    position: [35.7673, -5.7998],
    description: 'Major port city in northern Morocco'
  },
  {
    id: 'tetouan',
    name: 'Tetouan',
    position: [35.5889, -5.3626],
    description: 'Cultural center in the Rif Mountains'
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    position: [35.1715, -5.2697],
    description: 'The blue city in the mountains'
  },
  {
    id: 'larache',
    name: 'Larache',
    position: [35.1959, -6.1565],
    description: 'Port city on the Atlantic coast'
  },
  {
    id: 'al_hoceima',
    name: 'Al Hoceima',
    position: [35.2517, -3.9372],
    description: 'Coastal city on the Mediterranean'
  },
  {
    id: 'asilah',
    name: 'Asilah',
    position: [35.4659, -6.0337],
    description: 'Coastal town known for its arts festival'
  },
  {
    id: 'mdiq',
    name: 'M\'diq',
    position: [35.6813, -5.3352],
    description: 'Coastal resort town'
  },
  {
    id: 'fnideq',
    name: 'Fnideq',
    position: [35.8480, -5.3565],
    description: 'Border town near Ceuta'
  }
];

// Current standard routes
export const routes: RouteOption[] = [
  // Tangier to Tetouan
  {
    id: 'tangier-tetouan-current',
    name: 'Tangier to Tetouan via N2',
    origin: 'tangier',
    destination: 'tetouan',
    distance: 78,
    duration: 105, // minutes
    fuel: 8.2, // liters
    emissions: 19.5, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.7384, -5.7201],
      [35.6992, -5.6120],
      [35.6728, -5.5134],
      [35.6321, -5.4489],
      [35.5889, -5.3626]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 7,
    weatherSensitivity: 5,
    restrictions: []
  },
  // Tetouan to Chefchaouen
  {
    id: 'tetouan-chefchaouen-current',
    name: 'Tetouan to Chefchaouen via N2',
    origin: 'tetouan',
    destination: 'chefchaouen',
    distance: 63,
    duration: 85, // minutes
    fuel: 6.8, // liters
    emissions: 16.3, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.4928, -5.3534],
      [35.3728, -5.3134],
      [35.2728, -5.2834],
      [35.1715, -5.2697]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 6,
    weatherSensitivity: 8,
    restrictions: []
  },
  // Tangier to Larache
  {
    id: 'tangier-larache-current',
    name: 'Tangier to Larache via N1',
    origin: 'tangier',
    destination: 'larache',
    distance: 92,
    duration: 122, // minutes
    fuel: 9.5, // liters
    emissions: 22.8, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.6230, -5.9140],
      [35.4978, -6.0120],
      [35.3450, -6.1120],
      [35.1959, -6.1565]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 6,
    weatherSensitivity: 4,
    restrictions: []
  },
  // Tetouan to Al Hoceima
  {
    id: 'tetouan-al-hoceima-current',
    name: 'Tetouan to Al Hoceima via N16',
    origin: 'tetouan',
    destination: 'al_hoceima',
    distance: 142,
    duration: 205, // minutes
    fuel: 14.8, // liters
    emissions: 35.5, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.5089, -5.2822],
      [35.4250, -5.0651],
      [35.3576, -4.8142],
      [35.3122, -4.6320],
      [35.2745, -4.2986],
      [35.2517, -3.9372]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 5,
    weatherSensitivity: 9,
    restrictions: []
  },
  // Tangier to Asilah
  {
    id: 'tangier-asilah-current',
    name: 'Tangier to Asilah via N1',
    origin: 'tangier',
    destination: 'asilah',
    distance: 45,
    duration: 50, // minutes
    fuel: 4.7, // liters
    emissions: 11.3, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.6653, -5.8756],
      [35.5584, -5.9667],
      [35.4659, -6.0337]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 5,
    weatherSensitivity: 3,
    restrictions: []
  },
  // Tetouan to M'diq
  {
    id: 'tetouan-mdiq-current',
    name: 'Tetouan to M\'diq via N13',
    origin: 'tetouan',
    destination: 'mdiq',
    distance: 25,
    duration: 35, // minutes
    fuel: 2.6, // liters
    emissions: 6.2, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.6328, -5.3456],
      [35.6813, -5.3352]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 8,
    weatherSensitivity: 2,
    restrictions: []
  },
  // M'diq to Fnideq
  {
    id: 'mdiq-fnideq-current',
    name: 'M\'diq to Fnideq via N13',
    origin: 'mdiq',
    destination: 'fnideq',
    distance: 22,
    duration: 30, // minutes
    fuel: 2.3, // liters
    emissions: 5.5, // kg CO2
    path: [
      [35.6813, -5.3352],
      [35.7651, -5.3458],
      [35.8480, -5.3565]
    ],
    color: '#F97316',
    type: 'current',
    trafficSensitivity: 7,
    weatherSensitivity: 2,
    restrictions: []
  }
];

// AI-optimized alternative routes
export const optimizedRoutes: RouteOption[] = [
  // Tangier to Tetouan - Alternative 1
  {
    id: 'tangier-tetouan-opt1',
    name: 'Coastal Route via M\'diq',
    origin: 'tangier',
    destination: 'tetouan',
    distance: 72,
    duration: 88, // minutes
    fuel: 7.1, // liters
    emissions: 17.0, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.7224, -5.6901],
      [35.6813, -5.3352], // M'diq waypoint
      [35.5889, -5.3626]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 6,
    weatherSensitivity: 3,
    restrictions: []
  },
  // Tangier to Tetouan - Alternative 2
  {
    id: 'tangier-tetouan-opt2',
    name: 'Express Route (Toll)',
    origin: 'tangier',
    destination: 'tetouan',
    distance: 70,
    duration: 75, // minutes
    fuel: 6.8, // liters
    emissions: 16.3, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.7124, -5.6732],
      [35.6632, -5.5301],
      [35.5889, -5.3626]
    ],
    color: '#10B981',
    type: 'optimized',
    trafficSensitivity: 3,
    weatherSensitivity: 2,
    restrictions: ['toll_road']
  },
  // Tangier to Tetouan - Alternative 3
  {
    id: 'tangier-tetouan-opt3',
    name: 'Scenic Mountain Route',
    origin: 'tangier',
    destination: 'tetouan',
    distance: 85,
    duration: 115, // minutes
    fuel: 8.9, // liters
    emissions: 21.3, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.7026, -5.7456],
      [35.6321, -5.6589],
      [35.5932, -5.5432],
      [35.5763, -5.4326],
      [35.5889, -5.3626]
    ],
    color: '#8B5CF6',
    type: 'optimized',
    trafficSensitivity: 4,
    weatherSensitivity: 9,
    restrictions: ['difficult_terrain']
  },
  // Tetouan to Chefchaouen - Alternative 1
  {
    id: 'tetouan-chefchaouen-opt1',
    name: 'Direct Mountain Pass',
    origin: 'tetouan',
    destination: 'chefchaouen',
    distance: 58,
    duration: 72, // minutes
    fuel: 5.9, // liters
    emissions: 14.1, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.3928, -5.3134],
      [35.1715, -5.2697]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 3,
    weatherSensitivity: 8,
    restrictions: ['narrow_roads']
  },
  // Tetouan to Chefchaouen - Alternative 2
  {
    id: 'tetouan-chefchaouen-opt2',
    name: 'Low Emission Route',
    origin: 'tetouan',
    destination: 'chefchaouen',
    distance: 61,
    duration: 80, // minutes
    fuel: 5.2, // liters
    emissions: 12.5, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.4326, -5.3451],
      [35.3128, -5.3012],
      [35.1715, -5.2697]
    ],
    color: '#10B981',
    type: 'optimized',
    trafficSensitivity: 5,
    weatherSensitivity: 6,
    restrictions: ['ev_optimized']
  },
  // Tangier to Larache - Alternative 1
  {
    id: 'tangier-larache-opt1',
    name: 'Coastal Highway',
    origin: 'tangier',
    destination: 'larache',
    distance: 86,
    duration: 104, // minutes
    fuel: 8.1, // liters
    emissions: 19.4, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.6230, -5.9140],
      [35.4659, -6.0337], // Asilah waypoint
      [35.1959, -6.1565]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 6,
    weatherSensitivity: 3,
    restrictions: []
  },
  // Tangier to Larache - Alternative 2
  {
    id: 'tangier-larache-opt2',
    name: 'Inland Express Route',
    origin: 'tangier',
    destination: 'larache',
    distance: 82,
    duration: 95, // minutes
    fuel: 7.8, // liters
    emissions: 18.7, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.6432, -5.8768],
      [35.4923, -5.9876],
      [35.3254, -6.0987],
      [35.1959, -6.1565]
    ],
    color: '#10B981',
    type: 'optimized',
    trafficSensitivity: 4,
    weatherSensitivity: 4,
    restrictions: ['toll_road']
  },
  // Tetouan to Al Hoceima - Alternative 1
  {
    id: 'tetouan-al-hoceima-opt1',
    name: 'Coastal Mediterranean Route',
    origin: 'tetouan',
    destination: 'al_hoceima',
    distance: 132,
    duration: 174, // minutes
    fuel: 12.6, // liters
    emissions: 30.2, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.4659, -5.0987],
      [35.3576, -4.7652],
      [35.2890, -4.3891],
      [35.2517, -3.9372]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 4,
    weatherSensitivity: 7,
    restrictions: []
  },
  // Tetouan to Al Hoceima - Alternative 2
  {
    id: 'tetouan-al-hoceima-opt2',
    name: 'Inland Mountain Route',
    origin: 'tetouan',
    destination: 'al_hoceima',
    distance: 138,
    duration: 185, // minutes
    fuel: 13.5, // liters
    emissions: 32.4, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.5123, -5.2134],
      [35.4256, -4.9876],
      [35.3678, -4.6543],
      [35.3012, -4.3216],
      [35.2517, -3.9372]
    ],
    color: '#8B5CF6',
    type: 'optimized',
    trafficSensitivity: 3,
    weatherSensitivity: 9,
    restrictions: ['difficult_terrain', 'seasonal']
  },
  // Tangier to Asilah - Alternative 1
  {
    id: 'tangier-asilah-opt1',
    name: 'Coastal Scenic Route',
    origin: 'tangier',
    destination: 'asilah',
    distance: 47,
    duration: 55, // minutes
    fuel: 4.2, // liters
    emissions: 10.1, // kg CO2
    path: [
      [35.7673, -5.7998],
      [35.6987, -5.8543],
      [35.6123, -5.9234],
      [35.5345, -5.9876],
      [35.4659, -6.0337]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 4,
    weatherSensitivity: 5,
    restrictions: ['scenic']
  },
  // Tetouan to M'diq - Alternative 1
  {
    id: 'tetouan-mdiq-opt1',
    name: 'Coastal Expressway',
    origin: 'tetouan',
    destination: 'mdiq',
    distance: 23,
    duration: 28, // minutes
    fuel: 2.1, // liters
    emissions: 5.0, // kg CO2
    path: [
      [35.5889, -5.3626],
      [35.6545, -5.3423],
      [35.6813, -5.3352]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 6,
    weatherSensitivity: 2,
    restrictions: ['toll_road']
  },
  // M'diq to Fnideq - Alternative 1
  {
    id: 'mdiq-fnideq-opt1',
    name: 'Coastal Highway',
    origin: 'mdiq',
    destination: 'fnideq',
    distance: 21,
    duration: 25, // minutes
    fuel: 1.9, // liters
    emissions: 4.6, // kg CO2
    path: [
      [35.6813, -5.3352],
      [35.7765, -5.3412],
      [35.8480, -5.3565]
    ],
    color: '#2563EB',
    type: 'optimized',
    trafficSensitivity: 5,
    weatherSensitivity: 2,
    restrictions: []
  }
]; 