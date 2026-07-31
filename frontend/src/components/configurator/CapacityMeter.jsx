import React from 'react';
import '../../styles/CapacityMeter.css';

export function CapacityMeter({ capacity }) {
  if (!capacity) return null;

  const { usedSlots, maxSlots, percentUsed, isOverCapacity } = capacity;

  let statusColor = '#27ae60'; // Verde
  if (percentUsed >= 80 && percentUsed < 100) statusColor = '#f39c12'; // Amarillo
  if (isOverCapacity) statusColor = '#e74c3c'; // Rojo

  return (
    <div className="capacity-meter">
      <h3>Capacidad del Trailer</h3>
      <div className="meter-display">
        <div className="meter-bar">
          <div className="meter-fill" style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: statusColor }} />
        </div>
        <div className="meter-text">
          <span className="used">{usedSlots}</span>
          <span className="separator">/</span>
          <span className="max">{maxSlots}</span>
          <span className="percent">{percentUsed}%</span>
        </div>
      </div>
      {isOverCapacity && (
        <p className="warning-text">Excediste la capacidad. El trailer puede no tener espacio suficiente para movimiento.</p>
      )}
      {percentUsed >= 80 && !isOverCapacity && (
        <p className="warning-text">Trailer casi lleno. Ten cuidado con el espacio de trabajo.</p>
      )}
    </div>
  );
}