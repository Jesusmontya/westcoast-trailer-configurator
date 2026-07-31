import React from 'react';
import { TRAILER_SPECS, formatCurrency } from '../../utils/pricing';
import '../../styles/SizeComparison.css';

export function SizeComparison() {
  const sizes = ['12ft', '16ft', '20ft'];
  const trailerLength = 8; // SVG units
  const trailerWidth = 2.5; // SVG units
  const spacing = 12;

  return (
    <div className="size-comparison">
      <svg viewBox="0 0 50 20" className="comparison-svg">
        {sizes.map((size, index) => {
          const xOffset = index * (trailerLength + spacing);
          const spec = TRAILER_SPECS[size];

          return (
            <g key={size} className="trailer-group">
              {/* Piso del trailer */}
              <rect
                x={xOffset}
                y={6}
                width={trailerLength}
                height={trailerWidth}
                fill="none"
                stroke="#333"
                strokeWidth="0.15"
              />

              {/* Paredes (lineas) */}
              <line x1={xOffset} y1={4} x2={xOffset} y2={6} stroke="#333" strokeWidth="0.1" />
              <line
                x1={xOffset + trailerLength}
                y1={4}
                x2={xOffset + trailerLength}
                y2={6}
                stroke="#333"
                strokeWidth="0.1"
              />
              <line x1={xOffset} y1={4} x2={xOffset + trailerLength} y2={4} stroke="#333" strokeWidth="0.1" />

              {/* Etiqueta de tamaño */}
              <text x={xOffset + trailerLength / 2} y={3} textAnchor="middle" fontSize="0.8" fontWeight="bold" fill="#333">
                {size}
              </text>

              {/* Dimensiones debajo */}
              <text
                x={xOffset + trailerLength / 2}
                y={14}
                textAnchor="middle"
                fontSize="0.5"
                fill="#666"
              >
                {spec.length}ft x {spec.width}ft
              </text>
            </g>
          );
        })}
      </svg>

      <table className="size-specs-table">
        <thead>
          <tr>
            <th>Tamaño</th>
            <th>Largo x Ancho</th>
            <th>Altura Interior</th>
            <th>Personas Recomendadas</th>
            <th>Precio Base</th>
            <th>Espacio Máximo</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => {
            const spec = TRAILER_SPECS[size];
            return (
              <tr key={size}>
                <td className="bold">{size}</td>
                <td>{spec.length}ft x {spec.width}ft</td>
                <td>{spec.height}ft</td>
                <td>{spec.recommendedPersons}</td>
                <td className="price">{formatCurrency(spec.price)}</td>
                <td>{spec.maxSlots} slots</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="size-info">
        <h4>Guia de Selección</h4>
        <ul>
          <li>
            <strong>12ft:</strong> Ideal para 1 operador. Espacio justo, bueno para operacion individual o pareja.
          </li>
          <li>
            <strong>16ft:</strong> Equilibrio perfecto. Espacio para 2 operadores, versatil para multiples tipos de comida.
          </li>
          <li>
            <strong>20ft:</strong> Premium. Maxima capacidad, ideal para operaciones grandes o volumen alto. 2-3 operadores.
          </li>
        </ul>
      </div>
    </div>
  );
}