import React from 'react';
import { useTrailerLayout } from '../../hooks/useTrailerLayout';
import { TRAILER_SPECS } from '../../data/equipment';
import '../../styles/TrailerMiniMap.css';

export function TrailerMiniMap({ trailerSize, equipmentList, collisions = {} }) {
  const layout = useTrailerLayout(trailerSize, equipmentList, collisions);

  if (!layout) {
    return <div className="mini-map empty">Sin información del trailer</div>;
  }

  const { dimensions, pieces, serviceWindow } = layout;

  // Escala SVG
  const svgWidth = 300;
  const svgHeight = 200;
  const scaleX = svgWidth / dimensions.width;
  const scaleZ = svgHeight / dimensions.length;

  // Convertir coordenadas reales a SVG
  const toSvgX = (x) => svgWidth / 2 + x * scaleX;
  const toSvgZ = (z) => svgHeight / 2 - z * scaleZ; // Z inverso para SVG

  return (
    <div className="mini-map">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mini-map-svg">
        {/* Trailer perimetro */}
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Ventana de servicio */}
        <rect
          x={toSvgX(serviceWindow.x - serviceWindow.width / 2)}
          y={toSvgZ(serviceWindow.z - serviceWindow.depth / 2)}
          width={serviceWindow.width * scaleX}
          height={serviceWindow.depth * scaleZ}
          fill={serviceWindow.color}
          opacity="0.5"
        />
        <text
          x={toSvgX(serviceWindow.x)}
          y={toSvgZ(serviceWindow.z) + 4}
          textAnchor="middle"
          fontSize="10"
          fill="#999"
        >
          Ventana
        </text>

        {/* Piezas de equipo */}
        {pieces.map((piece) => {
          const xSvg = toSvgX(piece.x - piece.width / 2);
          const zSvg = toSvgZ(piece.z - piece.depth / 2);
          const wSvg = piece.width * scaleX;
          const hSvg = piece.depth * scaleZ;
          const fillColor = piece.hasCollision ? '#e74c3c' : piece.color;

          return (
            <g key={piece.id}>
              <rect
                x={xSvg}
                y={zSvg}
                width={wSvg}
                height={hSvg}
                fill={fillColor}
                stroke={piece.hasCollision ? '#c0392b' : '#333'}
                strokeWidth="1"
                opacity="0.7"
              />
              {wSvg > 30 && hSvg > 20 && (
                <text
                  x={xSvg + wSvg / 2}
                  y={zSvg + hSvg / 2 + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill={piece.hasCollision ? 'white' : '#333'}
                  fontWeight="bold"
                >
                  {piece.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}

        {/* Ejes de referencia */}
        <line
          x1={svgWidth / 2}
          y1={0}
          x2={svgWidth / 2}
          y2={svgHeight}
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        <line
          x1={0}
          y1={svgHeight / 2}
          x2={svgWidth}
          y2={svgHeight / 2}
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      </svg>

      <div className="mini-map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD700' }} />
          Ventana de Servicio
        </div>
        {pieces.some((p) => p.hasCollision) && (
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }} />
            Colision
          </div>
        )}
      </div>
    </div>
  );
}