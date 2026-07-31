import { useContext, useEffect } from 'react';
import { PresetsContext } from '../../context/PresetsContext';
import { BuildContext } from '../../context/BuildContext';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import { CardPreset } from './CardPreset';

export function StepPreset() {
  const { presets, loading, error, isOffline, retryLoadPresets } = useContext(PresetsContext);
  const { setFocusedEquipmentId } = useContext(BuildContext);
  const { selectedPresetId, setSelectedPresetId, nextStep } = useContext(ConfiguratorUIContext);

  useEffect(() => {
    setFocusedEquipmentId(null);
  }, [setFocusedEquipmentId]);

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
  };

  const handleStartFromScratch = () => {
    setSelectedPresetId(null);
  };

  const handleNext = () => {
    if (selectedPresetId || selectedPresetId === null) {
      nextStep();
    }
  };

  if (loading) {
    return (
      <div className="step-preset">
        <h2>Cargando opciones...</h2>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="step-preset">
      <div className="step-header">
        <h2>Elige tu Punto de Partida</h2>
        <p>Selecciona un combo predefinido o arma desde cero</p>
      </div>

      {error && (
        <div className="warning-banner">
          <span>{error}</span>
          {isOffline && (
            <button className="retry-btn" onClick={retryLoadPresets}>
              Reintentar
            </button>
          )}
        </div>
      )}

      <div className="preset-grid">
        {presets.map((preset) => (
          <CardPreset
            key={preset.id}
            preset={preset}
            isSelected={selectedPresetId === preset.id}
            onSelect={handleSelectPreset}
          />
        ))}
      </div>

      <div className="step-preset-scratch">
        <div className="scratch-card">
          <h3>Empezar desde Cero</h3>
          <p>
            Sin preset. Elige cada equipo manualmente y arma tu trailer exacto como lo necesitas.
          </p>
          <button
            className={`scratch-button ${selectedPresetId === null ? 'selected' : ''}`}
            onClick={handleStartFromScratch}
          >
            {selectedPresetId === null ? 'Seleccionado' : 'Elegir'}
          </button>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-next" onClick={handleNext}>
          Continuar
        </button>
      </div>
    </div>
  );
}