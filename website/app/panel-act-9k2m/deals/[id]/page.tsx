"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { generateQuotePdf, QuoteLineItem } from "../../../../lib/generateQuotePdf";
import {
  Deal,
  DealStage,
  PaymentType,
  STAGE_LABELS,
  PAYMENT_TYPE_LABELS,
  SOURCE_LABELS,
  paymentApplies,
  isStale,
} from "../../../../lib/deals";

type Activity = { id: string; deal_id: string; note: string; created_at: string };
type Payment = { id: string; deal_id: string; amount: number; paid_at: string };
type Quote = {
  id: string;
  deal_id: string;
  quote_number: string;
  trailer_model: string | null;
  trailer_size: string | null;
  items: QuoteLineItem[];
  total: number;
  monthly_estimate: number | null;
  notes: string | null;
  created_at: string;
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeal();
  }, [dealId]);

  async function loadDeal() {
    setLoading(true);
    const { data } = await supabase.from("deals").select("*").eq("id", dealId).single();
    setDeal(data as Deal);
    setLoading(false);
  }

  if (loading) return <p className="text-[#8f8477] font-mono text-sm">Cargando...</p>;
  if (!deal) return <p className="text-[#8f8477] font-mono text-sm">No encontrado.</p>;

  return <DealDetail deal={deal} onUpdated={loadDeal} onDeleted={() => router.push("/panel-act-9k2m")} />;
}

function DealDetail({
  deal,
  onUpdated,
  onDeleted,
}: {
  deal: Deal;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [stage, setStage] = useState<DealStage>(deal.stage);
  const [paymentType, setPaymentType] = useState(deal.payment_type || "");
  const [totalAmount, setTotalAmount] = useState(
    deal.total_amount ? String(deal.total_amount) : ""
  );
  const [saving, setSaving] = useState(false);

  async function saveDetails() {
    setSaving(true);
    const wasSentBefore = deal.stage === "cotizado";
    const isCotizandoNow = stage === "cotizado";
    const stageChanged = stage !== deal.stage;

    await supabase
      .from("deals")
      .update({
        stage,
        payment_type: (paymentType || null) as PaymentType | null,
        total_amount: totalAmount ? parseFloat(totalAmount) : null,
        ...(stageChanged ? { stage_updated_at: new Date().toISOString() } : {}),
        ...(isCotizandoNow && !wasSentBefore
          ? { quote_sent_at: new Date().toISOString() }
          : {}),
        ...(stage === "aceptado" && deal.stage !== "aceptado"
          ? { converted_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", deal.id);

    setSaving(false);
    onUpdated();
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f2ece2]">
            {deal.name}
          </h1>
          <p className="font-mono text-sm text-[#c9c2b6]">{deal.phone}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="tag-pill">{SOURCE_LABELS[deal.source] || deal.source}</span>
            {isStale(deal) && (
              <span className="font-mono text-[10px] text-[#e63946] uppercase">
                ⚠ Sin avance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="mb-6">
        <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
          Etapa
        </label>
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value as DealStage)}
          className="w-full px-4 py-3 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
        >
          {Object.entries(STAGE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Payment — solo si aplica según la etapa */}
      {paymentApplies(stage) && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
              Tipo de pago
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            >
              <option value="">—</option>
              <option value="contado">Contado</option>
              <option value="financiamiento">Financiamiento</option>
              <option value="enganche_saldo">Enganche + saldo</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
              Monto total
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            />
          </div>
        </div>
      )}

      <button
        onClick={saveDetails}
        disabled={saving}
        className="w-full mb-8 px-4 py-3 bg-[#b8562f] text-white rounded text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      <QuoteSection deal={deal} />

      {paymentApplies(stage) && deal.total_amount ? (
        <PaymentSection deal={{ ...deal, total_amount: parseFloat(totalAmount) || 0 }} />
      ) : null}

      <ActivitySection deal={deal} />
    </div>
  );
}

// ============================================
// ACTIVIDAD
// ============================================
function ActivitySection({ deal }: { deal: Deal }) {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    load();
  }, [deal.id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("deal_activity")
      .select("*")
      .eq("deal_id", deal.id)
      .order("created_at", { ascending: false });
    setActivity((data as Activity[]) || []);
    setLoading(false);
  }

  async function addNote() {
    if (!note.trim()) return;
    await supabase.from("deal_activity").insert({ deal_id: deal.id, note });
    setNote("");
    load();
  }

  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-3">
        Actividad
      </p>
      <div className="flex gap-2 mb-4">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. Le llamé, dijo que lo pensaba, volver el viernes"
          className="flex-1 px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-[#2b241d] border border-[#f2ece2]/15 rounded text-sm font-mono text-[#f2ece2] hover:border-[#b8562f]"
        >
          Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#8f8477]">Cargando...</p>
      ) : activity.length === 0 ? (
        <p className="text-xs text-[#8f8477]">Sin actividad registrada.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {activity.map((a) => (
            <div key={a.id} className="text-sm bg-[#211c17] rounded px-3 py-2.5">
              <p className="text-[#f2ece2]">{a.note}</p>
              <p className="font-mono text-[10px] text-[#8f8477] mt-1">
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// COTIZACIONES
// ============================================
function QuoteSection({ deal }: { deal: Deal }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [trailerModel, setTrailerModel] = useState("");
  const [trailerSize, setTrailerSize] = useState("");
  const [items, setItems] = useState<QuoteLineItem[]>([{ label: "", price: 0 }]);
  const [monthlyEstimate, setMonthlyEstimate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, [deal.id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("deal_id", deal.id)
      .order("created_at", { ascending: false });
    setQuotes((data as Quote[]) || []);
    setLoading(false);
  }

  function addItem() {
    setItems((prev) => [...prev, { label: "", price: 0 }]);
  }

  function updateItem(i: number, field: keyof QuoteLineItem, value: string) {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === i
          ? { ...item, [field]: field === "price" ? parseFloat(value) || 0 : value }
          : item
      )
    );
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function generateAndSave() {
    setSaving(true);
    const quoteNumber = String(quotes.length + 1).padStart(4, "0");

    const total = generateQuotePdf({
      quoteNumber,
      clientName: deal.name,
      clientPhone: deal.phone,
      trailerModel,
      trailerSize,
      items,
      monthlyEstimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes,
    });

    await supabase.from("quotes").insert({
      deal_id: deal.id,
      quote_number: quoteNumber,
      trailer_model: trailerModel || null,
      trailer_size: trailerSize || null,
      items,
      total,
      monthly_estimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes: notes || null,
    });

    setSaving(false);
    setShowForm(false);
    setTrailerModel("");
    setTrailerSize("");
    setItems([{ label: "", price: 0 }]);
    setMonthlyEstimate("");
    setNotes("");
    load();
  }

  function redownload(q: Quote) {
    generateQuotePdf({
      quoteNumber: q.quote_number,
      clientName: deal.name,
      clientPhone: deal.phone,
      trailerModel: q.trailer_model || "",
      trailerSize: q.trailer_size || "",
      items: q.items,
      monthlyEstimate: q.monthly_estimate,
      notes: q.notes,
    });
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477]">
          Cotizaciones
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="font-mono text-[11px] text-[#e8794a]"
        >
          {showForm ? "Cancelar" : "+ Nueva cotización"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-[#211c17] rounded">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              placeholder="Modelo de trailer"
              value={trailerModel}
              onChange={(e) => setTrailerModel(e.target.value)}
              className="px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            />
            <input
              placeholder="Tamaño (ej. 16 ft)"
              value={trailerSize}
              onChange={(e) => setTrailerSize(e.target.value)}
              className="px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Descripción del item"
                  value={item.label}
                  onChange={(e) => updateItem(i, "label", e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.price || ""}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                  className="w-28 px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
                />
                <button
                  onClick={() => removeItem(i)}
                  className="text-[#8f8477] hover:text-[#e63946] px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="font-mono text-[11px] text-[#e8794a] mb-3">
            + Agregar item
          </button>

          <input
            placeholder="Financiamiento mensual estimado (opcional)"
            value={monthlyEstimate}
            onChange={(e) => setMonthlyEstimate(e.target.value)}
            className="w-full mb-2 px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
          <textarea
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-[#2b241d] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2] min-h-[60px]"
          />

          <button
            onClick={generateAndSave}
            disabled={saving}
            className="w-full px-4 py-2.5 bg-[#b8562f] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Generando..." : "Generar PDF y guardar →"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-[#8f8477]">Cargando...</p>
      ) : quotes.length === 0 ? (
        <p className="text-xs text-[#8f8477]">Sin cotizaciones generadas todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between px-3 py-2 bg-[#211c17] rounded text-sm"
            >
              <div>
                <p className="text-[#f2ece2]">
                  #{q.quote_number}
                  {q.trailer_model ? ` — ${q.trailer_model}` : ""}
                </p>
                <p className="font-mono text-[10px] text-[#8f8477]">
                  {new Date(q.created_at).toLocaleDateString()} · $
                  {q.total.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => redownload(q)}
                className="font-mono text-[10px] text-[#e8794a] whitespace-nowrap"
              >
                Descargar de nuevo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// PAGOS
// ============================================
function PaymentSection({ deal }: { deal: Deal }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => {
    load();
  }, [deal.id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("deal_id", deal.id)
      .order("paid_at", { ascending: false });
    setPayments((data as Payment[]) || []);
    setLoading(false);
  }

  async function addPayment() {
    const amount = parseFloat(newAmount);
    if (!amount) return;
    await supabase.from("payments").insert({ deal_id: deal.id, amount });
    setNewAmount("");
    load();
  }

  async function deletePayment(id: string) {
    await supabase.from("payments").delete().eq("id", id);
    load();
  }

  const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = (deal.total_amount || 0) - amountPaid;

  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-3">
        Pagos
      </p>

      <div className="flex items-center justify-between mb-4 p-4 bg-[#211c17] rounded">
        <div>
          <p className="font-mono text-[10px] uppercase text-[#8f8477]">Pagado</p>
          <p className="font-semibold text-[#f2ece2]">${amountPaid.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase text-[#8f8477]">Falta</p>
          <p
            className={`font-semibold ${
              remaining <= 0 ? "text-[#4caf7d]" : "text-[#e8794a]"
            }`}
          >
            ${Math.max(remaining, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Monto del abono"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
        />
        <button
          onClick={addPayment}
          className="px-4 py-2 bg-[#b8562f] text-white rounded text-sm font-semibold"
        >
          Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#8f8477]">Cargando...</p>
      ) : payments.length === 0 ? (
        <p className="text-xs text-[#8f8477]">Sin abonos registrados.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-3 py-2 bg-[#211c17] rounded text-sm"
            >
              <span className="text-[#f2ece2]">${p.amount.toLocaleString()}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#8f8477]">
                  {new Date(p.paid_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deletePayment(p.id)}
                  className="text-[#8f8477] hover:text-[#e63946] text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}