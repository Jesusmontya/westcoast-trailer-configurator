export type DealStage =
  | "nuevo"
  | "contactado"
  | "cotizado"
  | "aceptado"
  | "en_produccion"
  | "entregado"
  | "perdido";

export type PaymentType = "contado" | "financiamiento" | "enganche_saldo";

export type Deal = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  language: string;
  stage: DealStage;
  payment_type: PaymentType | null;
  total_amount: number | null;
  trailer_type: string | null;
  notes: string | null;
  created_at: string;
  stage_updated_at: string;
  quote_sent_at: string | null;
  converted_at: string | null;
};

export const STAGE_LABELS: Record<DealStage, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cotizado: "Cotizado",
  aceptado: "Aceptado",
  en_produccion: "En producción",
  entregado: "Entregado",
  perdido: "Perdido",
};

export const STAGE_ORDER: DealStage[] = [
  "nuevo",
  "contactado",
  "cotizado",
  "aceptado",
  "en_produccion",
  "entregado",
];

export const SOURCE_LABELS: Record<string, string> = {
  gallery: "Gallery",
  contact_form: "Contact form",
  custom_request: "Custom build",
  configurator: "Configurator",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  contado: "Contado",
  financiamiento: "Financiamiento",
  enganche_saldo: "Enganche + saldo",
};

// El pago solo aplica una vez que el deal fue aceptado en adelante
export function paymentApplies(stage: DealStage) {
  return ["aceptado", "en_produccion", "entregado"].includes(stage);
}

// Un deal "nuevo" sin contactar por más de 48h, o "cotizado" sin
// respuesta por más de 5 días, se marca como urgente.
export function isStale(deal: Deal) {
  if (deal.stage === "nuevo") {
    const hours = (Date.now() - new Date(deal.created_at).getTime()) / 36e5;
    return hours > 48;
  }
  if (deal.stage === "cotizado" && deal.quote_sent_at) {
    const days = (Date.now() - new Date(deal.quote_sent_at).getTime()) / 864e5;
    return days > 5;
  }
  return false;
}