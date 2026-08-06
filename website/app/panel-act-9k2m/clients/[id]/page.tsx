"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { generateQuotePdf, QuoteLineItem } from "../../../../lib/generateQuotePdf";

const HEARD_FROM_LABELS: Record<string, string> = {
  redes_sociales: "Redes sociales",
  recomendacion: "Recomendación",
  vio_trailer: "Vio un trailer en la calle",
  sitio_web: "Formulario del sitio web",
  otro: "Otro",
};

const TIMELINE_LABELS: Record<string, string> = {
  lo_antes_posible: "Lo antes posible",
  este_mes: "Este mes",
  este_trimestre: "Este trimestre",
  solo_viendo: "Solo viendo opciones",
};

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interest: string | null;
  heard_from: string | null;
  timeline: string | null;
  status: "activo" | "perdido";
  created_at: string;
};
type Activity = { id: string; client_id: string; note: string; created_at: string };
type Quote = {
  id: string;
  client_id: string;
  quote_number: string;
  trailer_model: string | null;
  trailer_size: string | null;
  cover_image_url: string | null;
  items: QuoteLineItem[];
  total: number;
  tax_rate: number | null;
  margin: number | null;
  status: "enviada" | "aceptada" | "rechazada";
  monthly_estimate: number | null;
  notes: string | null;
  created_at: string;
};
type TrailerSize = {
  id: string;
  label: string;
  image_url: string | null;
  price: number;
  cost: number | null;
};
type Category = { id: string; name: string };
type Subcategory = { id: string; category_id: string; name: string };
type CatalogItem = {
  id: string;
  subcategory_id: string;
  name: string;
  image_url: string | null;
  price: number;
  cost: number | null;
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

  async function toggleStatus() {
    if (!client) return;
    const newStatus = client.status === "activo" ? "perdido" : "activo";
    await supabase.from("clients").update({ status: newStatus }).eq("id", client.id);
    setClient({ ...client, status: newStatus });
  }

  if (loading) return <p className="text-[var(--a-text-muted)] font-mono text-sm">Cargando...</p>;
  if (!client) return <p className="text-[var(--a-text-muted)] font-mono text-sm">No encontrado.</p>;

  return (
    <div className="max-w-3xl">
      <Link
        href="/panel-act-9k2m"
        className="inline-block mb-4 font-mono text-xs text-[var(--a-text-muted)] hover:text-[var(--a-text)]"
      >
        ← Volver a clientes
      </Link>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--a-text)]">{client.name}</h1>
            <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.phone}</p>
            {client.email && (
              <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.email}</p>
            )}
            <p className="font-mono text-[11px] text-[var(--a-text-muted)] mt-1">
              Cliente desde {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={toggleStatus}
            className={`admin-badge ${client.status === "activo" ? "success" : "danger"}`}
          >
            {client.status === "activo" ? "Activo" : "Perdido"} · cambiar
          </button>
        </div>

        {(client.interest || client.heard_from || client.timeline) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {client.interest && <span className="admin-badge">{client.interest}</span>}
            {client.heard_from && (
              <span className="admin-badge">{HEARD_FROM_LABELS[client.heard_from] || client.heard_from}</span>
            )}
            {client.timeline && (
              <span className="admin-badge">{TIMELINE_LABELS[client.timeline] || client.timeline}</span>
            )}
          </div>
        )}
      </div>

      <ActivitySection client={client} />
      <QuoteSection client={client} />
    </div>
  );
}

// ============================================
// SEGUIMIENTO
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
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-3">
        Seguimiento
      </p>
      <div className="flex gap-2 mb-4">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Ej. Le hablé, dijo que lo iba a pensar"
          className="flex-1 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm font-mono text-[var(--a-text)] hover:border-[var(--a-accent)]"
        >
          Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>
      ) : activity.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)]">Sin seguimiento registrado todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {activity.map((a) => (
            <div key={a.id} className="text-sm bg-[var(--a-surface-2)] rounded px-3 py-2.5">
              <p className="text-[var(--a-text)]">{a.note}</p>
              <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-1">
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
// COTIZACIONES — con catálogo visual (estilo AutoZone)
// ============================================
function QuoteSection({ client }: { client: Client }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);

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

  async function redownload(q: Quote) {
    await generateQuotePdf({
      quoteNumber: q.quote_number,
      clientName: client.name,
      clientPhone: client.phone,
      trailerModel: q.trailer_model || "",
      trailerSize: q.trailer_size || "",
      coverImageUrl: q.cover_image_url,
      items: q.items,
      taxRate: q.tax_rate || 0,
      monthlyEstimate: q.monthly_estimate,
      notes: q.notes,
    });
  }

  async function updateQuoteStatus(q: Quote, status: Quote["status"]) {
    setQuotes((prev) => prev.map((x) => (x.id === q.id ? { ...x, status } : x)));
    await supabase.from("quotes").update({ status }).eq("id", q.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)]">
          Cotizaciones
        </p>
        <button
          onClick={() => setShowBuilder((v) => !v)}
          className="font-mono text-[11px] text-[var(--a-accent)]"
        >
          {showBuilder ? "Cerrar" : "+ Nueva cotización"}
        </button>
      </div>

      {showBuilder && (
        <QuoteBuilder
          client={client}
          onDone={() => {
            setShowBuilder(false);
            load();
          }}
        />
      )}

      {loading ? (
        <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>
      ) : quotes.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)]">Sin cotizaciones generadas todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="flex items-center gap-3 px-3 py-2 bg-[var(--a-surface-2)] rounded text-sm"
            >
              {q.cover_image_url && (
                <img
                  src={q.cover_image_url}
                  alt=""
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="text-[var(--a-text)]">
                  #{q.quote_number}
                  {q.trailer_size ? ` — ${q.trailer_size}` : ""}
                </p>
                <p className="font-mono text-[10px] text-[var(--a-text-muted)]">
                  {new Date(q.created_at).toLocaleDateString()} · $
                  {q.total.toLocaleString()}
                </p>
              </div>
              <select
                value={q.status}
                onChange={(e) => updateQuoteStatus(q, e.target.value as Quote["status"])}
                className={`admin-badge ${
                  q.status === "aceptada" ? "success" : q.status === "rechazada" ? "danger" : "accent"
                }`}
              >
                <option value="enviada">Enviada</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
              </select>
              <button
                onClick={() => redownload(q)}
                className="font-mono text-[10px] text-[var(--a-accent)] whitespace-nowrap"
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

function QuoteBuilder({ client, onDone }: { client: Client; onDone: () => void }) {
  const [sizes, setSizes] = useState<TrailerSize[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  const [sizeId, setSizeId] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [items, setItems] = useState<QuoteLineItem[]>([]);
  const [monthlyEstimate, setMonthlyEstimate] = useState("");
  const [notes, setNotes] = useState("");
  const [manualLabel, setManualLabel] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    const [s, c, sc, ci, settings] = await Promise.all([
      supabase.from("trailer_sizes").select("*").order("sort_order"),
      supabase.from("catalog_categories").select("*").order("sort_order"),
      supabase.from("catalog_subcategories").select("*").order("sort_order"),
      supabase.from("catalog_items").select("id,subcategory_id,name,image_url,price,cost"),
      supabase.from("business_settings").select("*").eq("id", 1).single(),
    ]);
    setSizes((s.data as TrailerSize[]) || []);
    setCategories((c.data as Category[]) || []);
    setSubcategories((sc.data as Subcategory[]) || []);
    setCatalogItems((ci.data as CatalogItem[]) || []);
    setTaxRate(settings.data?.tax_rate || 0);
  }

  function addCatalogItem(item: CatalogItem) {
    setItems((prev) => [
      ...prev,
      { label: item.name, price: item.price, image_url: item.image_url, cost: item.cost || 0 },
    ]);
  }

  function addManualItem() {
    if (!manualLabel || !manualPrice) return;
    setItems((prev) => [...prev, { label: manualLabel, price: parseFloat(manualPrice) || 0, cost: 0 }]);
    setManualLabel("");
    setManualPrice("");
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const selectedSize = sizes.find((s) => s.id === sizeId);
  const baseItem: QuoteLineItem | null = selectedSize
    ? {
        label: `Trailer base — ${selectedSize.label}`,
        price: selectedSize.price,
        cost: selectedSize.cost || 0,
      }
    : null;
  const combinedItems = baseItem ? [baseItem, ...items] : items;
  const subtotal = combinedItems.reduce((sum, i) => sum + (i.price || 0), 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const margin = combinedItems.reduce((sum, i) => sum + ((i.price || 0) - (i.cost || 0)), 0);

  const visibleSubcategories = subcategories.filter((s) => s.category_id === activeCategory);
  const visibleItems = catalogItems.filter((i) => i.subcategory_id === activeSubcategory);

  async function generateAndSave() {
    if (combinedItems.length === 0) return;
    setSaving(true);

    // número de cotización: cuenta cuántas ya tiene este cliente
    const { count } = await supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("client_id", client.id);
    const quoteNumber = String((count || 0) + 1).padStart(4, "0");

    const totals = await generateQuotePdf({
      quoteNumber,
      clientName: client.name,
      clientPhone: client.phone,
      trailerSize: selectedSize?.label || "",
      coverImageUrl: selectedSize?.image_url || null,
      items: combinedItems,
      taxRate,
      monthlyEstimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes,
    });

    await supabase.from("quotes").insert({
      client_id: client.id,
      quote_number: quoteNumber,
      trailer_size: selectedSize?.label || null,
      cover_image_url: selectedSize?.image_url || null,
      items: combinedItems,
      subtotal: totals.subtotal,
      tax_rate: taxRate,
      tax_amount: totals.taxAmount,
      total: totals.total,
      margin,
      monthly_estimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes: notes || null,
    });

    setSaving(false);
    onDone();
  }

  return (
    <div className="mb-6 p-4 bg-[var(--a-surface-2)] rounded-lg">
      {/* Tamaño */}
      <label className="block font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-1.5">
        Tamaño del trailer
      </label>
      <div className="flex flex-wrap gap-2 mb-5">
        {sizes.map((s) => (
          <button
            key={s.id}
            onClick={() => setSizeId(s.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
              sizeId === s.id
                ? "bg-[var(--a-accent)] text-white"
                : "bg-[var(--a-surface)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {s.image_url && (
              <img src={s.image_url} alt="" className="w-5 h-5 rounded-full object-cover" />
            )}
            {s.label}
          </button>
        ))}
      </div>

      {/* Navegación del catálogo */}
      <label className="block font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-1.5">
        Catálogo
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setActiveSubcategory(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
              activeCategory === c.id
                ? "bg-[var(--a-text)] text-[var(--a-surface)]"
                : "bg-[var(--a-surface)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleSubcategories.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveSubcategory(sc.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono ${
                activeSubcategory === sc.id
                  ? "bg-[var(--a-accent)] text-white"
                  : "bg-[var(--a-surface)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {activeSubcategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addCatalogItem(item)}
              className="admin-card overflow-hidden text-left"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-20 object-cover" />
              ) : (
                <div className="w-full h-20 bg-[var(--a-bg)] flex items-center justify-center text-[10px] font-mono text-[var(--a-text-muted)]">
                  Sin foto
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-semibold text-[var(--a-text)] leading-tight">{item.name}</p>
                <p className="font-mono text-xs text-[var(--a-accent)] mt-1">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Agregar algo suelto, fuera de catálogo */}
      <div className="flex gap-2 mb-5">
        <input
          placeholder="Item suelto (no está en catálogo)"
          value={manualLabel}
          onChange={(e) => setManualLabel(e.target.value)}
          className="flex-1 px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
        <input
          type="number"
          placeholder="Precio"
          value={manualPrice}
          onChange={(e) => setManualPrice(e.target.value)}
          className="w-24 px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
        <button
          onClick={addManualItem}
          className="px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-xs font-mono text-[var(--a-text)]"
        >
          Agregar
        </button>
      </div>

      {/* Lista de items agregados — esto es lo que ve el cliente en vivo */}
      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-2">
        En la cotización ({combinedItems.length})
      </p>
      {combinedItems.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)] mb-5">
          Elige un tamaño o agrega algo del catálogo.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-5">
          {baseItem && (
            <div className="flex items-center gap-3 bg-[var(--a-surface)] rounded px-3 py-2 border border-[var(--a-accent)]/30">
              {selectedSize?.image_url ? (
                <img src={selectedSize.image_url} alt="" className="w-9 h-9 rounded object-cover" />
              ) : (
                <div className="w-9 h-9 rounded bg-[var(--a-surface-2)]" />
              )}
              <p className="flex-1 text-sm text-[var(--a-text)]">{baseItem.label}</p>
              <p className="font-mono text-sm text-[var(--a-accent)]">
                ${baseItem.price.toLocaleString()}
              </p>
            </div>
          )}
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-[var(--a-surface)] rounded px-3 py-2"
            >
              {item.image_url ? (
                <img src={item.image_url} alt="" className="w-9 h-9 rounded object-cover" />
              ) : (
                <div className="w-9 h-9 rounded bg-[var(--a-surface-2)]" />
              )}
              <p className="flex-1 text-sm text-[var(--a-text)]">{item.label}</p>
              <p className="font-mono text-sm text-[var(--a-accent)]">
                ${item.price.toLocaleString()}
              </p>
              <button
                onClick={() => removeItem(i)}
                className="text-[var(--a-text-muted)] hover:text-[var(--a-accent)] text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-end gap-1 mb-5 font-mono text-sm">
        <p className="text-[var(--a-text-muted)]">Subtotal: ${subtotal.toLocaleString()}</p>
        {taxRate > 0 && (
          <p className="text-[var(--a-text-muted)]">
            Tax ({taxRate}%): ${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        )}
        <p className="text-[var(--a-text)] font-semibold text-base">
          Total: ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      <input
        placeholder="Financiamiento mensual estimado (opcional)"
        value={monthlyEstimate}
        onChange={(e) => setMonthlyEstimate(e.target.value)}
        className="w-full mb-2 px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
      />
      <textarea
        placeholder="Notas (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full mb-4 px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)] min-h-[60px]"
      />

      <button
        onClick={generateAndSave}
        disabled={saving || combinedItems.length === 0}
        className="w-full px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Generando..." : "Generar PDF y guardar →"}
      </button>
    </div>
  );
}