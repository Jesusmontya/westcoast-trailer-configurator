import React, { useMemo } from 'react';
import { calculatePricing } from '../../utils/pricing';
import '../../styles/PriceBreakdown.css';


export function PriceBreakdown({ trailerSize, equipmentList }) {
  const pricing = useMemo(() => {
    if (!trailerSize) return null;
    return calculatePricing(trailerSize, equipmentList);
  }, [trailerSize, equipmentList]);

  if (!pricing || pricing.error) {
    return (
      <div className="price-breakdown empty">
        <p>Selecciona un trailer para ver el desglose de precios</p>
      </div>
    );
  }

  const {
    basePrice,
    equipmentPrice,
    subtotal,
    shipping,
    total,
    monthlyPayment,
    financingMonths,
    financingRate,
  } = pricing;

  return (
    <div className="price-breakdown">
      <h3>Desglose de Precios</h3>

      <div className="breakdown-table">
        <div className="breakdown-row">
          <span className="label">Tamaño del Trailer</span>
          <span className="value">${basePrice.toLocaleString()}</span>
        </div>

        {equipmentList.length > 0 && (
          <div className="breakdown-row">
            <span className="label">Equipo ({equipmentList.length} items)</span>
            <span className="value">${equipmentPrice.toLocaleString()}</span>
          </div>
        )}

        <div className="breakdown-row subtotal">
          <span className="label">Subtotal</span>
          <span className="value">${subtotal.toLocaleString()}</span>
        </div>

        <div className="breakdown-row">
          <span className="label">Envio (Nevada)</span>
          <span className="value">${shipping.toLocaleString()}</span>
        </div>

        <div className="breakdown-row total">
          <span className="label">TOTAL</span>
          <span className="value">${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="financing-info">
        <h4>Opciones de Financiamiento</h4>
        <div className="financing-option">
          <span className="months">{financingMonths} meses</span>
          <span className="rate">({(financingRate * 100).toFixed(0)}% anual)</span>
        </div>
        <div className="monthly-payment">
          <span className="label">Pago Mensual Aproximado:</span>
          <span className="amount">${monthlyPayment.toLocaleString()}</span>
        </div>
        <p className="financing-note">
          Estimacion basada en financiamiento estandar. Consulta con nuestro equipo para opciones exactas.
        </p>
      </div>
    </div>
  );
}