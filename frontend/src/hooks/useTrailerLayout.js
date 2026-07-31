import { useMemo } from 'react';
import { EQUIPMENT_CATALOG, TRAILER_SPECS, SERVICE_WINDOW_AREA } from '../data/equipment';

export function useTrailerLayout(trailerSize, equipmentList, collisions) {
  const layout = useMemo(() => {
    const trailerSpec = TRAILER_SPECS[trailerSize] || TRAILER_SPECS['12ft'];

    const pieces = equipmentList.map((piece) => {
      const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
      if (!equipment) return null;

      return {
        id: piece.id,
        equipmentId: piece.equipmentId,
        name: equipment.name,
        x: piece.x,
        z: piece.z,
        width: equipment.width,
        depth: equipment.depth,
        color: getColorByCategory(equipment.category),
        hasCollision: collisions[piece.id] || false,
        mountType: equipment.mountType,
      };
    }).filter(Boolean);

    const serviceWindow = {
      x: SERVICE_WINDOW_AREA.x,
      z: SERVICE_WINDOW_AREA.z,
      width: SERVICE_WINDOW_AREA.width,
      depth: SERVICE_WINDOW_AREA.depth,
      color: '#FFD700',
      isServiceWindow: true,
    };

    return {
      dimensions: trailerSpec,
      pieces,
      serviceWindow,
    };
  }, [trailerSize, equipmentList, collisions]);

  return layout;
}

function getColorByCategory(category) {
  const colorMap = {
    'Kitchen': '#FF6B6B',
    'Refrigeration': '#4ECDC4',
    'Plumbing': '#45B7D1',
    'Comfort': '#FFA07A',
    'Ventilation': '#98D8C8',
    'Storage': '#95A5A6',
  };
  return colorMap[category] || '#95A5A6';
}