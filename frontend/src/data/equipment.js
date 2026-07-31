export const EQUIPMENT_CATALOG = {
  // KITCHEN
  'grill-2burner': {
    id: 'grill-2burner',
    name: 'Parrilla 2 Quemadores',
    category: 'Kitchen',
    price: 1200,
    sizeInSlots: 2,
    width: 2.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '2 quemadores, temperatura máx 400C',
    icon: 'grill'
  },
  'grill-3burner': {
    id: 'grill-3burner',
    name: 'Parrilla 3 Quemadores',
    category: 'Kitchen',
    price: 1800,
    sizeInSlots: 3,
    width: 3.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '3 quemadores, temperatura máx 400C',
    icon: 'grill'
  },
  'grill-4burner': {
    id: 'grill-4burner',
    name: 'Parrilla 4 Quemadores',
    category: 'Kitchen',
    price: 2400,
    sizeInSlots: 4,
    width: 4.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '4 quemadores, temperatura máx 400C',
    icon: 'grill'
  },
  'fryer-double': {
    id: 'fryer-double',
    name: 'Freidora Doble',
    category: 'Kitchen',
    price: 2200,
    sizeInSlots: 3,
    width: 2.5,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '2x 8L, aceite, temperatura 180-200C',
    icon: 'fryer'
  },
  'prep-counter': {
    id: 'prep-counter',
    name: 'Mesón de Preparación',
    category: 'Kitchen',
    price: 800,
    sizeInSlots: 2,
    width: 2.0,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: 'Acero inoxidable, 2x1 pies',
    icon: 'counter'
  },
  'prep-counter-long': {
    id: 'prep-counter-long',
    name: 'Mesón de Preparación Largo',
    category: 'Kitchen',
    price: 1400,
    sizeInSlots: 4,
    width: 4.0,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: 'Acero inoxidable, 4x1 pies',
    icon: 'counter'
  },

  // REFRIGERATION
  'cooler-single': {
    id: 'cooler-single',
    name: 'Nevera Simple',
    category: 'Refrigeration',
    price: 1500,
    sizeInSlots: 2,
    width: 2.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '250L, temp 0-5C',
    icon: 'fridge'
  },
  'cooler-double': {
    id: 'cooler-double',
    name: 'Nevera Doble',
    category: 'Refrigeration',
    price: 2800,
    sizeInSlots: 4,
    width: 2.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '2x300L, temp 0-5C',
    icon: 'fridge'
  },
  'cooler-triple': {
    id: 'cooler-triple',
    name: 'Nevera Triple',
    category: 'Refrigeration',
    price: 4200,
    sizeInSlots: 6,
    width: 3.0,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '3x300L, temp 0-5C',
    icon: 'fridge'
  },
  'freezer-large': {
    id: 'freezer-large',
    name: 'Congelador Grande',
    category: 'Refrigeration',
    price: 3500,
    sizeInSlots: 5,
    width: 2.5,
    depth: 1.5,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '400L, temp -18C',
    icon: 'freezer'
  },
  'ice-maker': {
    id: 'ice-maker',
    name: 'Fabricador de Hielo',
    category: 'Refrigeration',
    price: 1200,
    sizeInSlots: 1,
    width: 0.8,
    depth: 0.8,
    mountType: 'floor',
    requiresVentilation: true,
    requiresPower: true,
    specs: '30kg/dia',
    icon: 'ice'
  },

  // PLUMBING
  'sink-single': {
    id: 'sink-single',
    name: 'Fregadero Simple',
    category: 'Plumbing',
    price: 600,
    sizeInSlots: 1,
    width: 1.0,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: '1 poceta, drenaje',
    icon: 'sink'
  },
  'sink-double': {
    id: 'sink-double',
    name: 'Fregadero Doble',
    category: 'Plumbing',
    price: 1000,
    sizeInSlots: 2,
    width: 1.5,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: '2 pocetas, drenaje',
    icon: 'sink'
  },
  'sink-triple': {
    id: 'sink-triple',
    name: 'Fregadero Triple',
    category: 'Plumbing',
    price: 1500,
    sizeInSlots: 3,
    width: 2.0,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: '3 pocetas, drenaje',
    icon: 'sink'
  },
  'hand-sink': {
    id: 'hand-sink',
    name: 'Lavamanos',
    category: 'Plumbing',
    price: 400,
    sizeInSlots: 1,
    width: 0.6,
    depth: 0.6,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: false,
    specs: 'Manual, pequeño',
    icon: 'sink'
  },

  // COMFORT
  'ac-unit': {
    id: 'ac-unit',
    name: 'Aire Acondicionado',
    category: 'Comfort',
    price: 3000,
    sizeInSlots: 0,
    width: 0,
    depth: 0,
    mountType: 'wall',
    requiresVentilation: false,
    requiresPower: true,
    specs: 'Capacidad 12000 BTU, montaje en pared',
    icon: 'ac'
  },
  'heater': {
    id: 'heater',
    name: 'Calefactor',
    category: 'Comfort',
    price: 500,
    sizeInSlots: 0,
    width: 0,
    depth: 0,
    mountType: 'wall',
    requiresVentilation: false,
    requiresPower: true,
    specs: 'Electrico, 2kW',
    icon: 'heater'
  },

  // VENTILATION & EXHAUST
  'hood-ventilation': {
    id: 'hood-ventilation',
    name: 'Campana de Ventilación',
    category: 'Ventilation',
    price: 2000,
    sizeInSlots: 3,
    width: 3.0,
    depth: 1.2,
    mountType: 'wall',
    requiresVentilation: false,
    requiresPower: true,
    specs: 'Extrae humo, instalada en pared trasera',
    icon: 'hood'
  },

  // STORAGE
  'storage-shelf': {
    id: 'storage-shelf',
    name: 'Repisa de Almacenamiento',
    category: 'Storage',
    price: 400,
    sizeInSlots: 1,
    width: 2.0,
    depth: 0.5,
    mountType: 'wall',
    requiresVentilation: false,
    requiresPower: false,
    specs: 'Metal, montaje pared',
    icon: 'shelf'
  },
  'storage-shelf-2': {
    id: 'storage-shelf-2',
    name: 'Repisa Doble',
    category: 'Storage',
    price: 800,
    sizeInSlots: 2,
    width: 2.0,
    depth: 0.5,
    mountType: 'wall',
    requiresVentilation: false,
    requiresPower: false,
    specs: '2 repisas, metal',
    icon: 'shelf'
  },

  // BEVERAGE SPECIFIC
  'coffee-machine': {
    id: 'coffee-machine',
    name: 'Máquina de Café',
    category: 'Kitchen',
    price: 2500,
    sizeInSlots: 2,
    width: 1.5,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: true,
    specs: 'Automatica, 15L/hora',
    icon: 'coffee'
  },
  'blender-station': {
    id: 'blender-station',
    name: 'Estación de Licuadoras',
    category: 'Kitchen',
    price: 1500,
    sizeInSlots: 2,
    width: 1.5,
    depth: 1.0,
    mountType: 'floor',
    requiresVentilation: false,
    requiresPower: true,
    specs: '3 licuadoras',
    icon: 'blender'
  },
};

// Categorias para agrupar en UI
export const EQUIPMENT_CATEGORIES = {
  'Kitchen': 'Cocina',
  'Refrigeration': 'Refrigeración',
  'Plumbing': 'Plomería',
  'Comfort': 'Comodidad',
  'Ventilation': 'Ventilación',
  'Storage': 'Almacenamiento',
};

// Reglas de validacion
export const WORKFLOW_RULES = [
  {
    trigger: ['grill-2burner', 'grill-3burner', 'grill-4burner', 'fryer-double'],
    recommendation: 'Campana de Ventilación',
    recommendedEquipmentId: 'hood-ventilation',
    message: 'Se recomienda agregar ventilacion para equipos con llama/calor'
  },
  {
    trigger: ['fryer-double'],
    recommendation: 'Fregadero Cercano',
    message: 'La freidora debe estar cerca de un fregadero para limpiar'
  },
];

export const TRAILER_SPECS = {
  '12ft': {
    length: 12,
    width: 8.5,
    height: 10,
    maxSlots: 10,
    price: 8000,
    recommendedPersons: 1,
  },
  '16ft': {
    length: 16,
    width: 8.5,
    height: 10,
    maxSlots: 15,
    price: 12000,
    recommendedPersons: 2,
  },
  '20ft': {
    length: 20,
    width: 8.5,
    height: 10,
    maxSlots: 20,
    price: 16000,
    recommendedPersons: 3,
  },
};

export const SERVICE_WINDOW_AREA = {
  x: 0,
  z: -1.5,
  width: 2.0,
  depth: 0.5,
};

export const SHIPPING_COST = 1500; // USD, Nevada shipping
export const FINANCING_RATE = 0.08; // 8% anual