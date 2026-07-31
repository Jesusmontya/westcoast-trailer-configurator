import { useCallback, useMemo } from 'react';
import { EQUIPMENT_CATALOG, SERVICE_WINDOW_AREA, TRAILER_SPECS } from '../data/equipment';

const GRID_SIZE = 0.5; // 0.5 ft grid
const FLOOR_RAYCAST_OFFSET = 0.15; // Grosor del piso en 3D, documentado para raycast

export function useTrailerPhysics(trailerSize) {
  const trailerSpec = useMemo(() => TRAILER_SPECS[trailerSize] || TRAILER_SPECS['12ft'], [trailerSize]);

  // Snap a la cuadricula
  const snapToGrid = useCallback((x, z) => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      z: Math.round(z / GRID_SIZE) * GRID_SIZE,
    };
  }, []);

  // AABB collision detection
  const checkAABBCollision = useCallback((piece1, piece2) => {
    const equipment1 = EQUIPMENT_CATALOG[piece1.equipmentId];
    const equipment2 = EQUIPMENT_CATALOG[piece2.equipmentId];

    if (!equipment1 || !equipment2) return false;

    const x1Min = piece1.x - equipment1.width / 2;
    const x1Max = piece1.x + equipment1.width / 2;
    const z1Min = piece1.z - equipment1.depth / 2;
    const z1Max = piece1.z + equipment1.depth / 2;

    const x2Min = piece2.x - equipment2.width / 2;
    const x2Max = piece2.x + equipment2.width / 2;
    const z2Min = piece2.z - equipment2.depth / 2;
    const z2Max = piece2.z + equipment2.depth / 2;

    return !(x1Max < x2Min || x1Min > x2Max || z1Max < z2Min || z1Min > z2Max);
  }, []);

  // Colision con ventana de servicio
  const checkServiceWindowCollision = useCallback((piece) => {
    const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
    if (!equipment) return false;

    const xMin = piece.x - equipment.width / 2;
    const xMax = piece.x + equipment.width / 2;
    const zMin = piece.z - equipment.depth / 2;
    const zMax = piece.z + equipment.depth / 2;

    const sxMin = SERVICE_WINDOW_AREA.x - SERVICE_WINDOW_AREA.width / 2;
    const sxMax = SERVICE_WINDOW_AREA.x + SERVICE_WINDOW_AREA.width / 2;
    const szMin = SERVICE_WINDOW_AREA.z - SERVICE_WINDOW_AREA.depth / 2;
    const szMax = SERVICE_WINDOW_AREA.z + SERVICE_WINDOW_AREA.depth / 2;

    return !(xMax < sxMin || xMin > sxMax || zMax < szMin || zMin > szMax);
  }, []);

  // Chequear si pieza sale del trailer
  const checkOutOfBounds = useCallback((piece) => {
    const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
    if (!equipment) return false;

    const xMin = piece.x - equipment.width / 2;
    const xMax = piece.x + equipment.width / 2;
    const zMin = piece.z - equipment.depth / 2;
    const zMax = piece.z + equipment.depth / 2;

    const trailerXMin = -trailerSpec.width / 2;
    const trailerXMax = trailerSpec.width / 2;
    const trailerZMin = -trailerSpec.length / 2;
    const trailerZMax = trailerSpec.length / 2;

    return xMin < trailerXMin || xMax > trailerXMax || zMin < trailerZMin || zMax > trailerZMax;
  }, [trailerSpec]);

  // Validar posicion de pieza
  const isValidPosition = useCallback((piece, allPieces) => {
    if (checkOutOfBounds(piece)) return false;
    if (checkServiceWindowCollision(piece)) return false;

    // Chequear colisiones con otras piezas
    for (const otherPiece of allPieces) {
      if (otherPiece.id === piece.id) continue;
      if (checkAABBCollision(piece, otherPiece)) return false;
    }

    return true;
  }, [checkOutOfBounds, checkServiceWindowCollision, checkAABBCollision]);

  // Validar capacidad (slots)
  const validateCapacity = useCallback((equipmentList) => {
    let usedSlots = 0;
    for (const piece of equipmentList) {
      const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
      if (equipment && equipment.mountType === 'floor') {
        usedSlots += equipment.sizeInSlots;
      }
    }
    const maxSlots = trailerSpec.maxSlots;
    const isFull = usedSlots >= maxSlots;
    const isOverCapacity = usedSlots > maxSlots;

    return {
      usedSlots,
      maxSlots,
      percentUsed: Math.round((usedSlots / maxSlots) * 100),
      isFull,
      isOverCapacity,
    };
  }, [trailerSpec]);

  // Validaciones de flujo (recomendaciones)
  const checkWorkflowRecommendations = useCallback((equipmentList) => {
    const equipmentIds = equipmentList.map((p) => EQUIPMENT_CATALOG[p.equipmentId]?.id).filter(Boolean);
    const recommendations = [];

    // Si hay parrilla o freidora, recomendar ventilacion
    const hasHeatEquipment = equipmentIds.some((id) =>
      ['grill-2burner', 'grill-3burner', 'grill-4burner', 'fryer-double'].includes(id)
    );
    const hasVentilation = equipmentIds.includes('hood-ventilation');

    if (hasHeatEquipment && !hasVentilation) {
      recommendations.push({
        type: 'ventilation',
        message: 'Se recomienda una campana de ventilacion para equipos con calor',
        equipmentId: 'hood-ventilation',
      });
    }

    return recommendations;
  }, []);

  // Raycast para arrastre (simplificado, retorna hit point)
  const raycastFloor = useCallback((screenX, screenY, camera, canvas) => {
    // Esta es una simplificacion - en el codigo 3D real usaras Raycaster de Three.js
    // Aqui solo retornamos coords dummy para que el hook sea completo
    return { x: 0, z: 0 };
  }, []);

  return {
    snapToGrid,
    checkAABBCollision,
    checkServiceWindowCollision,
    checkOutOfBounds,
    isValidPosition,
    validateCapacity,
    checkWorkflowRecommendations,
    raycastFloor,
    trailerSpec,
    GRID_SIZE,
    FLOOR_RAYCAST_OFFSET,
  };
}