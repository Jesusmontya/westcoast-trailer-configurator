export { TRAILER_SPECS } from '../data/equipment';
import { EQUIPMENT_CATALOG, TRAILER_SPECS, SHIPPING_COST, FINANCING_RATE } from '../data/equipment';


export function calculatePricing(trailerSize, equipmentList) {
  const trailerSpec = TRAILER_SPECS[trailerSize];
  if (!trailerSpec) {
    return { error: 'Tamaño de trailer no válido' };
  }

  const basePrice = trailerSpec.price;

  let equipmentPrice = 0;
  const equipmentBreakdown = [];

  for (const piece of equipmentList) {
    const equipment = EQUIPMENT_CATALOG[piece.equipmentId];
    if (equipment) {
      equipmentPrice += equipment.price;
      equipmentBreakdown.push({
        name: equipment.name,
        price: equipment.price,
      });
    }
  }

  const subtotal = basePrice + equipmentPrice;
  const total = subtotal + SHIPPING_COST;

  const monthlyPayment = calculateMonthlyPayment(total, FINANCING_RATE, 36);

  return {
    basePrice,
    equipmentPrice,
    equipmentBreakdown,
    subtotal,
    shipping: SHIPPING_COST,
    total,
    monthlyPayment,
    financingMonths: 36,
    financingRate: FINANCING_RATE,
  };
}

function calculateMonthlyPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
