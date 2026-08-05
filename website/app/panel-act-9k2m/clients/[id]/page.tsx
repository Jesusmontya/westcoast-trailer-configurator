"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { generateQuotePdf, QuoteLineItem } from "../../../../lib/generateQuotePdf";

type Client = { id: string; name: string; phone: string; created_at: string };
type Activity = { id: string; client_id: string; note: string; created_at: string };
type Quote = {
  id: string;
  client_id: string;
  quote_number: string;
  trailer_model: string | null;
  trailer_size: string | null;
  items: QuoteLineItem[];
  total: number;
  monthly_estimate: number | null;
  notes: string | null;
  created_at: string;
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [clientId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").eq("id", clientId).single();
    setClient(data as Client);
    setLoading(false);
  }

  if (loading) return <p className="text-[#8f8477] font-mono text-sm">Cargando...</p>;
  if (!client) return <p className="text-[#8f8477] font-mono text-sm">No encontrado.</p>;

  return (
    <div className="max-w-2xl">
      <Link
        href="/panel-act-9k2m"
        className="inline-block mb-4 font-mono text-xs text-[#8f8477] hover:text-[#f2ece2]"
      >
        ← Volver a clientes
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[#f2ece2]">{client.name}</h1>
        <p className="font-mono text-sm text-[#c9c2b6]">{client.phone}</p>
        <p className="font-mono text-[11px] text-[#8f8477] mt-1">
          Cliente desde {new Date(client.created_at).toLocaleDateString()}
        </p>
      </div>

      <ActivitySection client={client} />
      <QuoteSection client={client} />
    </div>
  );
}

// ============================================
// SEGUIMIENTO — solo notas con fecha
// ============================================
function ActivitySection({ client }: { client: Client }) {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  useEffect(() => {
    load();
  }, [client.id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("client_activity")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });
    setActivity((data as Activity[]) || []);
    setLoading(false);
  }

  async function addNote() {
    if (!note.trim()) return;
    await supabase.from("client_activity").insert({ client_id: client.id, note });
    setNote("");
    load();
  }

  return (
    <div className="mb-8">
      <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-3">
        Seguimiento
      </p>
      <div className="flex gap-2 mb-4">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Ej. Le hablé, dijo que lo iba a pensar"
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
        <p className="text-xs text-[#8f8477]">Sin seguimiento registrado todavía.</p>
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
function QuoteSection({ client }: { client: Client }) {
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
  }, [client.id]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("client_id", client.id)
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
      clientName: client.name,
      clientPhone: client.phone,
      trailerModel,
      trailerSize,
      items,
      monthlyEstimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes,
    });

    await supabase.from("quotes").insert({
      client_id: client.id,
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
      clientName: client.name,
      clientPhone: client.phone,
      trailerModel: q.trailer_model || "",
      trailerSize: q.trailer_size || "",
      items: q.items,
      monthlyEstimate: q.monthly_estimate,
      notes: q.notes,
    });
  }

  return (
    <div>
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