export interface Supplier {
  id: string;
  name: string;
  location: string;
  distance: number; // Distance in km
  coordinates: [number, number];
  category: 'agriculture' | 'textiles' | 'electronics' | 'automotive' | 'construction';
  established: number;
  employees: number;
  certifications: string[];
  metrics: {
    reliabilityScore: number; // 0-100
    qualityScore: number; // 0-100
    priceCompetitiveness: number; // 0-100
    deliverySpeed: number; // 0-100
    onTimeDelivery: number; // 0-100
    defectRate: number; // Percentage
    responseTime: number; // Hours
  };
  sustainability: {
    score: number; // 0-100
    carbonFootprint: number; // tons CO2e per year
    waterUsage: number; // cubic meters per month
    renewableEnergy: number; // Percentage
    wasteReduction: number; // Percentage
    localResourcing: number; // Percentage
    communityImpact: number; // 0-100
  };
  costSavings: {
    transportCost: number; // % reduction
    importTaxes: number; // % reduction
    leadTime: number; // % reduction
    inventoryCost: number; // % reduction
    riskMitigation: number; // % reduction
  };
  materials: string[];
  currentlyUsed: boolean;
  recommended: boolean;
}

const suppliers: Supplier[] = [
  // Currently used supplier (international)
  {
    id: 'sup_001',
    name: 'GlobalTech Industries',
    location: 'Valencia, Spain',
    distance: 1080,
    coordinates: [-0.3773, 39.4699],
    category: 'electronics',
    established: 1998,
    employees: 2300,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 27001'],
    metrics: {
      reliabilityScore: 81,
      qualityScore: 84,
      priceCompetitiveness: 72,
      deliverySpeed: 65,
      onTimeDelivery: 79,
      defectRate: 3.2,
      responseTime: 19,
    },
    sustainability: {
      score: 69,
      carbonFootprint: 2850,
      waterUsage: 32000,
      renewableEnergy: 37,
      wasteReduction: 41,
      localResourcing: 28,
      communityImpact: 55,
    },
    costSavings: {
      transportCost: 0,
      importTaxes: 0,
      leadTime: 0,
      inventoryCost: 0,
      riskMitigation: 0,
    },
    materials: ['Circuit boards', 'Microcontrollers', 'Sensors', 'Displays', 'Casing materials'],
    currentlyUsed: true,
    recommended: false,
  },
  
  // Recommended Moroccan supplier
  {
    id: 'sup_002',
    name: 'Maroc Électronique',
    location: 'Casablanca, Morocco',
    distance: 92,
    coordinates: [-7.5898, 33.5731],
    category: 'electronics',
    established: 2012,
    employees: 380,
    certifications: ['ISO 9001', 'ISO 14001'],
    metrics: {
      reliabilityScore: 87,
      qualityScore: 86,
      priceCompetitiveness: 89,
      deliverySpeed: 92,
      onTimeDelivery: 88,
      defectRate: 2.8,
      responseTime: 6,
    },
    sustainability: {
      score: 82,
      carbonFootprint: 470,
      waterUsage: 8700,
      renewableEnergy: 72,
      wasteReduction: 63,
      localResourcing: 87,
      communityImpact: 78,
    },
    costSavings: {
      transportCost: 82,
      importTaxes: 100,
      leadTime: 73,
      inventoryCost: 40,
      riskMitigation: 65,
    },
    materials: ['Circuit boards', 'Microcontrollers', 'Sensors', 'Displays', 'Casing materials'],
    currentlyUsed: false,
    recommended: true,
  },
  
  // Other Moroccan alternatives
  {
    id: 'sup_003',
    name: 'Tanger Components',
    location: 'Tangier, Morocco',
    distance: 212,
    coordinates: [-5.8326, 35.7595],
    category: 'electronics',
    established: 2007,
    employees: 425,
    certifications: ['ISO 9001'],
    metrics: {
      reliabilityScore: 78,
      qualityScore: 82,
      priceCompetitiveness: 92,
      deliverySpeed: 85,
      onTimeDelivery: 81,
      defectRate: 4.1,
      responseTime: 9,
    },
    sustainability: {
      score: 73,
      carbonFootprint: 620,
      waterUsage: 12300,
      renewableEnergy: 51,
      wasteReduction: 58,
      localResourcing: 89,
      communityImpact: 81,
    },
    costSavings: {
      transportCost: 73,
      importTaxes: 100,
      leadTime: 68,
      inventoryCost: 35,
      riskMitigation: 55,
    },
    materials: ['Circuit boards', 'Microcontrollers', 'Casing materials', 'Sensors'],
    currentlyUsed: false,
    recommended: false,
  },
  {
    id: 'sup_004',
    name: 'Atlas Tech',
    location: 'Rabat, Morocco',
    distance: 87,
    coordinates: [-6.8498, 34.0209],
    category: 'electronics',
    established: 2009,
    employees: 195,
    certifications: ['ISO 9001', 'ISO 27001'],
    metrics: {
      reliabilityScore: 82,
      qualityScore: 79,
      priceCompetitiveness: 88,
      deliverySpeed: 91,
      onTimeDelivery: 87,
      defectRate: 3.7,
      responseTime: 8,
    },
    sustainability: {
      score: 77,
      carbonFootprint: 390,
      waterUsage: 9800,
      renewableEnergy: 68,
      wasteReduction: 51,
      localResourcing: 79,
      communityImpact: 84,
    },
    costSavings: {
      transportCost: 81,
      importTaxes: 100,
      leadTime: 75,
      inventoryCost: 32,
      riskMitigation: 59,
    },
    materials: ['Circuit boards', 'Sensors', 'Displays', 'Casing materials'],
    currentlyUsed: false,
    recommended: false,
  },
  {
    id: 'sup_005',
    name: 'Fès Composants',
    location: 'Fez, Morocco',
    distance: 180,
    coordinates: [-5.0078, 34.0181],
    category: 'electronics',
    established: 2014,
    employees: 112,
    certifications: ['ISO 9001'],
    metrics: {
      reliabilityScore: 75,
      qualityScore: 76,
      priceCompetitiveness: 94,
      deliverySpeed: 83,
      onTimeDelivery: 79,
      defectRate: 5.2,
      responseTime: 11,
    },
    sustainability: {
      score: 79,
      carbonFootprint: 310,
      waterUsage: 7600,
      renewableEnergy: 83,
      wasteReduction: 47,
      localResourcing: 92,
      communityImpact: 89,
    },
    costSavings: {
      transportCost: 71,
      importTaxes: 100,
      leadTime: 61,
      inventoryCost: 30,
      riskMitigation: 52,
    },
    materials: ['Circuit boards', 'Microcontrollers', 'Displays'],
    currentlyUsed: false,
    recommended: false,
  },
  
  // Agricultural suppliers
  {
    id: 'sup_006',
    name: 'Maroc Agrumes',
    location: 'Agadir, Morocco',
    distance: 435,
    coordinates: [-9.5981, 30.4278],
    category: 'agriculture',
    established: 2001,
    employees: 780,
    certifications: ['GlobalG.A.P', 'Organic', 'HACCP'],
    metrics: {
      reliabilityScore: 89,
      qualityScore: 91,
      priceCompetitiveness: 87,
      deliverySpeed: 82,
      onTimeDelivery: 85,
      defectRate: 2.3,
      responseTime: 10,
    },
    sustainability: {
      score: 86,
      carbonFootprint: 420,
      waterUsage: 89000,
      renewableEnergy: 70,
      wasteReduction: 75,
      localResourcing: 95,
      communityImpact: 90,
    },
    costSavings: {
      transportCost: 70,
      importTaxes: 100,
      leadTime: 68,
      inventoryCost: 45,
      riskMitigation: 72,
    },
    materials: ['Citrus fruits', 'Vegetables', 'Herbs'],
    currentlyUsed: false,
    recommended: false,
  },
  
  // Textile suppliers
  {
    id: 'sup_007',
    name: 'Fès Textiles',
    location: 'Fez, Morocco',
    distance: 180,
    coordinates: [-5.0111, 34.0372],
    category: 'textiles',
    established: 1995,
    employees: 625,
    certifications: ['ISO 9001', 'OEKO-TEX', 'BSCI'],
    metrics: {
      reliabilityScore: 88,
      qualityScore: 92,
      priceCompetitiveness: 85,
      deliverySpeed: 79,
      onTimeDelivery: 83,
      defectRate: 1.8,
      responseTime: 12,
    },
    sustainability: {
      score: 81,
      carbonFootprint: 580,
      waterUsage: 24000,
      renewableEnergy: 62,
      wasteReduction: 68,
      localResourcing: 93,
      communityImpact: 88,
    },
    costSavings: {
      transportCost: 76,
      importTaxes: 100,
      leadTime: 65,
      inventoryCost: 39,
      riskMitigation: 61,
    },
    materials: ['Cotton fabrics', 'Leather', 'Wool', 'Silk'],
    currentlyUsed: false,
    recommended: false,
  },
  
  // Automotive suppliers
  {
    id: 'sup_008',
    name: 'Tanger Auto Parts',
    location: 'Tangier, Morocco',
    distance: 212,
    coordinates: [-5.8190, 35.7611],
    category: 'automotive',
    established: 2004,
    employees: 870,
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001'],
    metrics: {
      reliabilityScore: 86,
      qualityScore: 88,
      priceCompetitiveness: 81,
      deliverySpeed: 83,
      onTimeDelivery: 87,
      defectRate: 1.2,
      responseTime: 7,
    },
    sustainability: {
      score: 74,
      carbonFootprint: 1400,
      waterUsage: 18000,
      renewableEnergy: 55,
      wasteReduction: 62,
      localResourcing: 75,
      communityImpact: 72,
    },
    costSavings: {
      transportCost: 78,
      importTaxes: 100,
      leadTime: 72,
      inventoryCost: 51,
      riskMitigation: 68,
    },
    materials: ['Engine components', 'Body parts', 'Electrical systems', 'Interior components'],
    currentlyUsed: false,
    recommended: false,
  },
];

export const procurementScenarios = [
  {
    id: 'scenario_1',
    name: 'Current Approach',
    description: 'Continue with existing international supplier',
    totalCost: 1250000,
    leadTime: 45, // days
    carbonFootprint: 2850, // tons CO2e
    riskLevel: 'Moderate',
    sustainabilityScore: 69,
    benefits: [],
    drawbacks: [
      'High transport costs',
      'Import taxes and duties',
      'Extended lead times',
      'Higher carbon footprint',
      'Currency exchange risks',
      'Complex logistics',
    ],
  },
  {
    id: 'scenario_2',
    name: 'Local Supplier Transition',
    description: 'Switch to recommended Moroccan supplier',
    totalCost: 920000,
    leadTime: 12, // days
    carbonFootprint: 470, // tons CO2e
    riskLevel: 'Low',
    sustainabilityScore: 82,
    benefits: [
      'Reduced transport costs (82%)',
      'No import taxes',
      'Faster lead times (73%)',
      'Lower carbon footprint (83%)',
      'Local currency transactions',
      'Simplified logistics',
      'Government incentives',
      'Enhanced local economy',
    ],
    drawbacks: [
      'Transition costs',
      'Integration period needed',
      'Potential specification adjustments',
    ],
  },
  {
    id: 'scenario_3',
    name: 'Hybrid Approach',
    description: 'Gradually transition with dual sourcing',
    totalCost: 1085000,
    leadTime: 30, // days
    carbonFootprint: 1660, // tons CO2e
    riskLevel: 'Low-Moderate',
    sustainabilityScore: 75,
    benefits: [
      'Risk diversification',
      'Gradual transition',
      'Partial cost savings',
      'Progressive carbon reduction',
      'Knowledge transfer opportunities',
    ],
    drawbacks: [
      'Complex supplier management',
      'Higher administrative overhead',
      'Inconsistent production processes',
      'Extended transition period',
    ],
  },
];

export const categories = [
  { id: 'electronics', name: 'Electronics', count: 5 },
  { id: 'agriculture', name: 'Agriculture', count: 1 },
  { id: 'textiles', name: 'Textiles', count: 1 },
  { id: 'automotive', name: 'Automotive', count: 1 },
];

export default suppliers; 