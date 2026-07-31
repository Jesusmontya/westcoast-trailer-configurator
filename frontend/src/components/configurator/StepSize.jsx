import { useContext } from 'react';
import { BuildContext } from '../../context/BuildContext';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import { SizeComparison } from './SizeComparison';
import { TRAILER_SPECS, formatCurrency } from '../../utils/pricing';

export function StepSize() {
  const { trailerSize, setTrailerSize } = useContext(BuildContext);
  const { nextStep, prevStep } = useContext(ConfiguratorUIContext);

  const handleSelectSize = (size) => {
    setTrailerSize(size);
  };

  const handleNext = () => {
    if (trailerSize) {
      nextStep();
    }
  };

  return (
    <div className="step-size">
      <div className="step-header">
        <h2>Elige el Tamaño del Trailer</h2>
        <p>Visualiza las opciones y elige la que mejor se adapte a tu negocio</p>
      </div>

      <SizeComparison />

      <div className="size-selector">
        <h3>Selecciona tu Tamaño</h3>
        <div className="size-buttons">
          {Object.entries(TRAILER_SPECS).map(([size, spec]) => (
            <button
              key={size}
              className={`size-button ${trailerSize === size ? 'active' : ''}`}
              onClick={() => handleSelectSize(size)}
            >
              <div className="size-number">{size}</div>
              <div className="size-dims">
                {spec.length}ft x {spec.width}ft
              </div>
              <div className="size-price">{formatCurrency(spec.price)}</div>
              <div className="size-persons">{spec.recommendedPersons} operador(es)</div>
            </button>
          ))}
        </div>
      </div>

      {trailerSize && (
        <div className="size-selected-info">
          <h4>Seleccion Actual</h4>
          <p>
            Has elegido un trailer de <strong>{trailerSize}</strong> con precio base de{' '}
            <strong>{formatCurrency(TRAILER_SPECS[trailerSize].price)}</strong>
          </p>
          <p className="note">El precio total se ajustara cuando agregues equipos en el proximo paso.</p>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>
          Atras
        </button>
        <button className="btn-next" onClick={handleNext} disabled={!trailerSize}>
          Continuar
        </button>
      </div>
    </div>
  );
}