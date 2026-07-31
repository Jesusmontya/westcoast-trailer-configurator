import React from 'react';
import { formatCurrency } from '../../utils/pricing';
import '../../styles/CardPreset.css';

export function CardPreset({ preset, isSelected, onSelect }) {
  return (
    <div
      className={`card-preset ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(preset.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrapper">
        <img
          src={preset.imageUrl}
          alt={preset.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
          }}
        />
        <div className="card-image-fallback" style={{ backgroundColor: '#e0e0e0' }} />
      </div>

      <div className="card-content">
        <h3 className="card-title">{preset.name}</h3>

        <p className="card-description">{preset.description}</p>

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-label">Ideal para:</span>
            <span className="meta-value">{preset.idealFor}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Tamaño:</span>
            <span className="meta-value">{preset.trailerSizeRecommended}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Precio base:</span>
            <span className="meta-price">{formatCurrency(preset.basePrice)}</span>
          </div>
        </div>

        <p className="card-equipment-count">
          {preset?.equipmentIds?.length || 0} equipos incluidos
        </p>

        <button className="card-button" onClick={(e) => { e.stopPropagation(); onSelect(preset.id); }}>
          {isSelected ? 'Seleccionado' : 'Elegir'}
        </button>
      </div>

      {isSelected && <div className="card-checkmark">✓</div>}
    </div>
  );
}
