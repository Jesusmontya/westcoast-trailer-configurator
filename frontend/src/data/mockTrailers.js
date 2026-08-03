// Datos de prueba — cuando conectemos Supabase, esto se reemplaza por
// una consulta a la tabla `gallery_trailers`.
export const MOCK_TRAILERS = [
  {
    id: 'trailer-1',
    name: 'Taco Trailer Classic',
    category: 'Food Trailer',
    priceFrom: 9500,
    modelUrl: '/models/trailer-optimized.glb',
    rotationFix: [0, 0, 0], // ajustar según el escaneo real
    cameraAngles: {
      front: [0, 0.15, 1.4],
      side: [1.4, 0.15, 0],
      interior: [0, 0.05, 0.15],
    },
  },
  // Cuando escanees más trailers, agrega uno por cada uno aquí:
  // {
  //   id: 'trailer-2',
  //   name: 'Cafecito Bar',
  //   category: 'Cafetería',
  //   priceFrom: 8000,
  //   modelUrl: '/models/cafecito.glb',
  //   rotationFix: [0, 0, 0],
  //   cameraAngles: { front: [...], side: [...], interior: [...] },
  // },
]

export const CATEGORIES = ['All', 'Food Trailer', 'Cafetería', 'Beverage Bar']