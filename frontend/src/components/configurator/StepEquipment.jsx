import { useContext } from 'react';
import { BuildContext } from '../../context/BuildContext';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import { PriceBreakdown } from './PriceBreakdown';
import { CapacityMeter } from './CapacityMeter';
import { WorkflowWarnings } from './WorkflowWarnings';
import { EQUIPMENT_CATALOG, EQUIPMENT_CATEGORIES } from '../../data/equipment';
import { useTrailerPhysics } from '../../hooks/useTrailerPhysics';

export function StepEquipment() {
  const { trailerSize, equipmentList, acPosition, notes, addEquipment, removeEquipment, setAcPosition, setNotes } =
    useContext(BuildContext);
  const { nextStep, prevStep } = useContext(ConfiguratorUIContext);
  const { validateCapacity, checkWorkflowRecommendations } = useTrailerPhysics(trailerSize);

  const [selectedCategory, setSelectedCategory] = useState('Kitchen');

  const capacity = useMemo(() => validateCapacity(equipmentList), [equipmentList, validateCapacity]);
  const recommendations = useMemo(() => checkWorkflowRecommendations(equipmentList), [equipmentList, checkWorkflowRecommendations]);

  const equipmentByCategory = useMemo(() => {
    const grouped = {};
    Object.entries(EQUIPMENT_CATEGORIES).forEach(([key]) => {
      grouped[key] = Object.values(EQUIPMENT_CATALOG).filter((eq) => eq.category === key);
    });
    return grouped;
  }, []);

  const handleAddEquipment = (equipmentId) => {
    addEquipment(equipmentId);
  };

  const handleRemoveEquipment = (pieceId) => {
    removeEquipment(pieceId);
  };

  const handleAcPositionChange = (position) => {
    setAcPosition(position);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const floorEquipment = equipmentList.filter((p) => EQUIPMENT_CATALOG[p.equipmentId]?.mountType === 'floor');
  const wallEquipment = equipmentList.filter((p) => EQUIPMENT_CATALOG[p.equipmentId]?.mountType === 'wall');

  return (
    <div className="step-equipment">
      <div className="step-header">
        <h2>Equipa tu Trailer</h2>
        <p>Elige los equipos que necesitas. Arrastralos en el 3D para posicionar.</p>
      </div>

      <div className="equipment-layout">
        {/* Panel izquierdo: catalogo de equipos */}
        <div className="equipment-catalog">
          <div className="catalog-categories">
            {Object.entries(EQUIPMENT_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="catalog-items">
            {equipmentByCategory[selectedCategory]?.map((equipment) => {
              const isAdded = equipmentList.some((p) => p.equipmentId === equipment.id);
              return (
                <div key={equipment.id} className="catalog-item">
                  <div className="item-header">
                    <h4>{equipment.name}</h4>
                    <span className="item-price">${equipment.price}</span>
                  </div>
                  <p className="item-specs">{equipment.specs}</p>
                  <button
                    className={`btn-add ${isAdded ? 'added' : ''}`}
                    onClick={() => handleAddEquipment(equipment.id)}
                  >
                    {isAdded ? 'Agregado' : 'Agregar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho: resumen y controles */}
        <div className="equipment-summary">
          <CapacityMeter capacity={capacity} />

          {recommendations.length > 0 && (
            <WorkflowWarnings recommendations={recommendations} />
          )}

          <div className="ac-selector">
            <h3>Aire Acondicionado</h3>
            <p className="ac-info">Posicion en pared trasera</p>
            <div className="ac-positions">
              {['left', 'center', 'right'].map((pos) => (
                <button
                  key={pos}
                  className={`ac-btn ${acPosition === pos ? 'active' : ''}`}
                  onClick={() => handleAcPositionChange(pos)}
                >
                  {pos === 'left' ? 'Izquierda' : pos === 'center' ? 'Centro' : 'Derecha'}
                </button>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label htmlFor="notes">Notas Especiales</label>
            <textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Ej: Necesito conexion a agua cerca del sink, espacio para...registro"
              rows={4}
            />
          </div>

          <PriceBreakdown trailerSize={trailerSize} equipmentList={equipmentList} />
        </div>
      </div>

      {/* Resumen de equipos agregados */}
      <div className="equipment-added">
        <h3>Equipos Agregados ({floorEquipment.length})</h3>
        <div className="added-list">
          {floorEquipment.map((piece) => {
            const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
            return (
              <div key={piece.id} className="added-item">
                <div className="added-info">
                  <span className="added-name">{equipment?.name}</span>
                  <span className="added-price">${equipment?.price}</span>
                </div>
                <button className="btn-remove" onClick={() => handleRemoveEquipment(piece.id)}>
                  Remover
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>
          Atras
        </button>
        <button className="btn-next" onClick={nextStep} disabled={floorEquipment.length === 0}>
          Continuar
        </button>
      </div>
    </div>
  );
}