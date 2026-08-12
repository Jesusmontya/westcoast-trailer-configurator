"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { generateQuotePdf, QuoteLineItem } from "../../../../lib/generateQuotePdf";

const HEARD_FROM_LABELS: Record<string, string> = {
  redes_sociales: "Redes sociales",
  recomendacion: "Recomendación",
  vio_trailer: "Vio un trailer en la calle",
  sitio_web: "Formulario del sitio web",
  sitio_web_contacto: "Formulario de contacto",
  sitio_web_galeria: "Galería 3D",
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
  deleted_at: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  temperature: "rojo" | "amarillo" | "verde" | null;
  created_at: string;
};
type Activity = { id: string; client_id: string; note: string; created_at: string };
type Quote = {
  id: string;
  client_id: string;
  quote_number: string;
  trailer_model: string | null;
  trailer_size: string | null;
  trailer_size_id: string | null;
  cover_image_url: string | null;
  items: QuoteLineItem[];
  total: number;
  tax_rate: number | null;
  margin: number | null;
  pdf_url: string | null;
  emailed_at: string | null;
  door_wall: string | null;
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
  length_ft: number | null;
};
type Category = { id: string; name: string };
type CatalogItem = {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  price: number;
  cost: number | null;
  width_in: number | null;
};
type Preset = { id: string; name: string };
type PresetItem = { id: string; preset_id: string; catalog_item_id: string };

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editInterest, setEditInterest] = useState("");
  const [editHeardFrom, setEditHeardFrom] = useState("");
  const [editTimeline, setEditTimeline] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState(false);

  useEffect(() => {
    load();
  }, [clientId]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").eq("id", clientId).single();
    setClient(data as Client);
    setLoading(false);
  }

  function startEditClient() {
    if (!client) return;
    setEditName(client.name);
    setEditPhone(client.phone);
    setEditEmail(client.email || "");
    setEditInterest(client.interest || "");
    setEditHeardFrom(client.heard_from || "");
    setEditTimeline(client.timeline || "");
    setIsEditing(true);
  }

  async function saveClientEdit() {
    if (!client || !editName || !editPhone) return;
    setSavingEdit(true);
    const updates = {
      name: editName,
      phone: editPhone,
      email: editEmail || null,
      interest: editInterest || null,
      heard_from: editHeardFrom || null,
      timeline: editTimeline || null,
    };
    await supabase.from("clients").update(updates).eq("id", client.id);
    setClient({ ...client, ...updates });
    setSavingEdit(false);
    setIsEditing(false);
  }

  async function toggleStatus() {
    if (!client) return;
    const newStatus = client.status === "activo" ? "perdido" : "activo";
    await supabase.from("clients").update({ status: newStatus }).eq("id", client.id);
    setClient({ ...client, status: newStatus });
  }

  async function cycleTemperature() {
    if (!client) return;
    const order: (Client["temperature"])[] = [null, "rojo", "amarillo", "verde"];
    const currentIndex = order.indexOf(client.temperature);
    const next = order[(currentIndex + 1) % order.length];
    await supabase.from("clients").update({ temperature: next }).eq("id", client.id);
    setClient({ ...client, temperature: next });
  }

  function temperatureColor(t: Client["temperature"] | undefined) {
    if (t === "rojo") return "#c0392b";
    if (t === "amarillo") return "#e0a52c";
    if (t === "verde") return "#1e8e5a";
    return "var(--a-border)";
  }

  function temperatureLabel(t: Client["temperature"] | undefined) {
    if (t === "rojo") return "Veremos";
    if (t === "amarillo") return "En proceso";
    if (t === "verde") return "Aprobado";
    return "Sin definir";
  }

  async function moveToTrash() {
    if (!client) return;
    await supabase.from("clients").update({ deleted_at: new Date().toISOString() }).eq("id", client.id);
    router.push("/panel-act-9k2m");
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
        {isEditing ? (
          <div className="admin-card p-5">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="admin-label block mb-1">Nombre</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="admin-label block mb-1">Teléfono</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="admin-input w-full"
                />
              </div>
            </div>
            <label className="admin-label block mb-1">Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="admin-input w-full mb-2"
            />
            <label className="admin-label block mb-1">¿Qué le interesa?</label>
            <input
              value={editInterest}
              onChange={(e) => setEditInterest(e.target.value)}
              className="admin-input w-full mb-2"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="admin-label block mb-1">Cómo te conoció</label>
                <select
                  value={editHeardFrom}
                  onChange={(e) => setEditHeardFrom(e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="">—</option>
                  <option value="redes_sociales">Redes sociales</option>
                  <option value="recomendacion">Recomendación</option>
                  <option value="vio_trailer">Vio un trailer en la calle</option>
                  <option value="sitio_web">Formulario del sitio web</option>
                  <option value="sitio_web_contacto">Formulario de contacto</option>
                  <option value="sitio_web_galeria">Galería 3D</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="admin-label block mb-1">Para cuándo</label>
                <select
                  value={editTimeline}
                  onChange={(e) => setEditTimeline(e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="">—</option>
                  <option value="lo_antes_posible">Lo antes posible</option>
                  <option value="este_mes">Este mes</option>
                  <option value="este_trimestre">Este trimestre</option>
                  <option value="solo_viendo">Solo viendo opciones</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 admin-btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={saveClientEdit}
                disabled={savingEdit || !editName || !editPhone}
                className="flex-1 admin-btn-primary"
              >
                {savingEdit ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-[var(--a-text)]">{client.name}</h1>
                <button onClick={startEditClient} className="admin-btn-ghost">
                  Editar
                </button>
              </div>
              <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.phone}</p>
              {client.email && (
                <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.email}</p>
              )}
              <p className="font-mono text-[11px] text-[var(--a-text-muted)] mt-1">
                Cliente desde {new Date(client.created_at).toLocaleDateString()}
              </p>
              <button
                onClick={cycleTemperature}
                className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[var(--a-text-muted)]"
              >
                <span
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: 12,
                    height: 12,
                    background: temperatureColor(client.temperature),
                    border: client.temperature ? "none" : "2px solid var(--a-border)",
                  }}
                />
                {temperatureLabel(client.temperature)} · cambiar
              </button>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={toggleStatus}
                className={`admin-badge ${client.status === "activo" ? "success" : "danger"}`}
              >
                {client.status === "activo" ? "Activo" : "Perdido"} · cambiar
              </button>
              {confirmTrash ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-[var(--a-text)]">¿Seguro?</span>
                  <button onClick={moveToTrash} className="admin-btn-ghost danger">
                    Sí
                  </button>
                  <button onClick={() => setConfirmTrash(false)} className="admin-btn-ghost">
                    No
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmTrash(true)} className="admin-btn-ghost danger">
                  🗑 Mover a la papelera
                </button>
              )}
            </div>
          </div>
        )}

        {!isEditing &&
          (client.interest || client.heard_from || client.timeline || client.utm_source) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {client.interest && <span className="admin-badge">{client.interest}</span>}
              {client.heard_from && (
                <span className="admin-badge">{HEARD_FROM_LABELS[client.heard_from] || client.heard_from}</span>
              )}
              {client.timeline && (
                <span className="admin-badge">{TIMELINE_LABELS[client.timeline] || client.timeline}</span>
              )}
              {client.utm_source && (
                <span className="admin-badge accent">
                  📣 {client.utm_source}
                  {client.utm_campaign ? ` — ${client.utm_campaign}` : ""}
                </span>
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState<string | null>(null);

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

  function startEdit(a: Activity) {
    setEditingId(a.id);
    setEditText(a.note);
  }

  async function saveEdit(id: string) {
    if (!editText.trim()) return;
    await supabase.from("client_activity").update({ note: editText }).eq("id", id);
    setEditingId(null);
    load();
  }

  async function deleteNote(id: string) {
    await supabase.from("client_activity").delete().eq("id", id);
    setConfirmDeleteNoteId(null);
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
          {activity.map((a) =>
            editingId === a.id ? (
              <div key={a.id} className="flex gap-2 bg-[var(--a-surface-2)] rounded px-3 py-2.5">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(a.id)}
                  autoFocus
                  className="flex-1 px-2 py-1 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
                />
                <button onClick={() => saveEdit(a.id)} className="admin-btn-ghost">
                  Guardar
                </button>
                <button onClick={() => setEditingId(null)} className="admin-btn-ghost">
                  Cancelar
                </button>
              </div>
            ) : (
              <div
                key={a.id}
                className="text-sm bg-[var(--a-surface-2)] rounded px-3 py-2.5 flex items-start justify-between gap-2"
              >
                <div>
                  <p className="text-[var(--a-text)]">{a.note}</p>
                  <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-1">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(a)} className="admin-btn-ghost">
                    Editar
                  </button>
                  {confirmDeleteNoteId === a.id ? (
                    <>
                      <span className="font-mono text-[11px] text-[var(--a-text)]">¿Seguro?</span>
                      <button onClick={() => deleteNote(a.id)} className="admin-btn-ghost danger">
                        Sí
                      </button>
                      <button
                        onClick={() => setConfirmDeleteNoteId(null)}
                        className="admin-btn-ghost"
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteNoteId(a.id)}
                      className="admin-btn-ghost danger"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            )
          )}
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
  const [duplicateFrom, setDuplicateFrom] = useState<Quote | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<{ id: string; ok: boolean } | null>(null);

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
    if (q.pdf_url) {
      const { data, error } = await supabase.storage
        .from("quote-pdfs")
        .createSignedUrl(q.pdf_url, 60);
      if (!error && data) {
        window.open(data.signedUrl, "_blank");
        return;
      }
    }

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

  async function sendByEmail(q: Quote) {
    if (!client.email) return;
    setSendingId(q.id);
    setSendResult(null);

    try {
      const totals = await generateQuotePdf({
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
        download: false,
      });

      const pdfBase64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(totals.blob);
      });

      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: client.email,
          clientName: client.name,
          quoteNumber: q.quote_number,
          pdfBase64,
        }),
      });

      setSendResult({ id: q.id, ok: res.ok });

      if (res.ok) {
        const now = new Date().toISOString();
        await supabase.from("quotes").update({ emailed_at: now }).eq("id", q.id);
        setQuotes((prev) =>
          prev.map((x) => (x.id === q.id ? { ...x, emailed_at: now } : x))
        );
      }
    } catch {
      setSendResult({ id: q.id, ok: false });
    } finally {
      setSendingId(null);
    }
  }

  async function updateQuoteStatus(q: Quote, status: Quote["status"]) {
    setQuotes((prev) => prev.map((x) => (x.id === q.id ? { ...x, status } : x)));
    await supabase.from("quotes").update({ status }).eq("id", q.id);
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);

  async function deleteQuote(id: string) {
    setDeleteErrorId(null);
    const quote = quotes.find((q) => q.id === id);

    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) {
      setDeleteErrorId(id);
      return;
    }

    if (quote?.pdf_url) {
      await supabase.storage.from("quote-pdfs").remove([quote.pdf_url]);
    }

    setConfirmDeleteId(null);
    load();
  }

  function startDuplicate(q: Quote) {
    setDuplicateFrom(q);
    setShowBuilder(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)]">
          Cotizaciones
        </p>
        <button
          onClick={() => {
            if (showBuilder) {
              setDuplicateFrom(null);
              setEditingQuote(null);
            }
            setShowBuilder((v) => !v);
          }}
          className="admin-btn-secondary"
        >
          {showBuilder ? "Cerrar" : "+ Nueva cotización"}
        </button>
      </div>

      {showBuilder && (
        <QuoteBuilder
          client={client}
          duplicateFrom={duplicateFrom}
          editingQuote={editingQuote}
          onDone={() => {
            setShowBuilder(false);
            setDuplicateFrom(null);
            setEditingQuote(null);
            setViewingQuote(null);
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
                {q.emailed_at && (
                  <p className="font-mono text-[10px] text-[var(--a-accent)] mt-0.5">
                    📧 Enviado {new Date(q.emailed_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <select
                value={q.status}
                onChange={(e) => updateQuoteStatus(q, e.target.value as Quote["status"])}
                className={`admin-badge ${
                  q.status === "aceptada" ? "success" : q.status === "rechazada" ? "danger" : "accent"
                }`}
                style={{ fontSize: "0.75rem", padding: "6px 10px" }}
              >
                <option value="enviada">Enviada</option>
                <option value="aceptada">Aceptada</option>
                <option value="rechazada">Rechazada</option>
              </select>
              <button onClick={() => setViewingQuote(q)} className="admin-btn-ghost">
                Ver
              </button>
              <button onClick={() => startDuplicate(q)} className="admin-btn-ghost">
                Duplicar y editar
              </button>
              <button onClick={() => redownload(q)} className="admin-btn-ghost">
                Descargar
              </button>
              {client.email ? (
                <button
                  onClick={() => sendByEmail(q)}
                  disabled={sendingId === q.id}
                  className="admin-btn-ghost"
                >
                  {sendingId === q.id
                    ? "Enviando..."
                    : sendResult?.id === q.id
                    ? sendResult.ok
                      ? "✓ Enviado"
                      : "Error, reintentar"
                    : "Enviar por correo"}
                </button>
              ) : (
                <span className="font-mono text-[10px] text-[var(--a-text-muted)]">
                  Agrega email para enviar
                </span>
              )}
              {confirmDeleteId === q.id ? (
                <div className="flex items-center gap-1.5">
                  {deleteErrorId === q.id && (
                    <span className="font-mono text-[10px] text-[var(--a-danger)]">
                      No se pudo (¿eres admin?)
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-[var(--a-text)]">¿Seguro?</span>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    className="admin-btn-ghost danger"
                  >
                    Sí, borrar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="admin-btn-ghost"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(q.id)}
                  className="admin-btn-ghost danger"
                >
                  Borrar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {viewingQuote && (
        <ViewQuoteModal
          quote={viewingQuote}
          onClose={() => setViewingQuote(null)}
          onEdit={() => {
            setEditingQuote(viewingQuote);
            setViewingQuote(null);
            setShowBuilder(true);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// PLANO 2D REAL — piezas puestas alrededor del rectángulo, a escala
// ============================================
// ============================================
// EDITOR DEL PLANO — arrastrar y soltar cada pieza a su pared
// ============================================
const WALL_ZONES: { key: string; label: string }[] = [
  { key: "trasera", label: "Pared trasera" },
  { key: "izquierda", label: "Pared izquierda" },
  { key: "isla", label: "Isla / centro" },
  { key: "frontal", label: "Pared frontal" },
  { key: "derecha", label: "Pared derecha" },
];

function FloorPlanEditorModal({
  items,
  onUpdateWall,
  onClose,
}: {
  items: QuoteLineItem[];
  onUpdateWall: (index: number, wall: string) => void;
  onClose: () => void;
}) {
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverZone, setHoverZone] = useState<string | null>(null);

  function findZoneAt(x: number, y: number): string | null {
    for (const key of Object.keys(zoneRefs.current)) {
      const el = zoneRefs.current[key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return key;
    }
    return null;
  }

  function handlePointerDown(e: React.PointerEvent, index: number) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIndex(index);
    setGhostPos({ x: e.clientX, y: e.clientY });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (draggingIndex === null) return;
    setGhostPos({ x: e.clientX, y: e.clientY });
    setHoverZone(findZoneAt(e.clientX, e.clientY));
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (draggingIndex === null) return;
    const zone = findZoneAt(e.clientX, e.clientY);
    if (zone) onUpdateWall(draggingIndex, zone);
    setDraggingIndex(null);
    setGhostPos(null);
    setHoverZone(null);
  }

  const draggingItem = draggingIndex !== null ? items[draggingIndex] : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-8">
      <div className="admin-card bg-[var(--a-surface)] w-full max-w-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-[var(--a-text)]">Editar plano</h3>
          <button onClick={onClose} className="admin-btn-secondary">
            Listo
          </button>
        </div>
        <p className="text-xs text-[var(--a-text-muted)] mb-4">
          Arrastra cada pieza a la pared donde va. Suéltala encima del recuadro.
        </p>

        <div
          className="grid grid-cols-3 gap-2 select-none"
          style={{ touchAction: "none" }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div />
          <div
            ref={(el) => { zoneRefs.current.trasera = el; }}
            className="rounded-lg border-2 border-dashed p-2 min-h-[90px]"
            style={{
              borderColor: hoverZone === "trasera" ? "#1f3a5c" : "#c9cfd4",
              background: hoverZone === "trasera" ? "rgba(31,58,92,0.08)" : "transparent",
            }}
          >
            <p className="font-mono text-[9px] uppercase text-[var(--a-text-muted)] mb-1 text-center">
              Trasera
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((it, i) =>
                (it.wall || "trasera") === "trasera" ? (
                  <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    className="px-2 py-1 rounded bg-[var(--a-surface-2)] border border-[var(--a-border)] text-[9px] text-[var(--a-text)] cursor-grab active:cursor-grabbing"
                    style={{ opacity: draggingIndex === i ? 0.3 : 1 }}
                  >
                    {it.label}
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div />

          <div
            ref={(el) => { zoneRefs.current.izquierda = el; }}
            className="rounded-lg border-2 border-dashed p-2 min-h-[90px]"
            style={{
              borderColor: hoverZone === "izquierda" ? "#1f3a5c" : "#c9cfd4",
              background: hoverZone === "izquierda" ? "rgba(31,58,92,0.08)" : "transparent",
            }}
          >
            <p className="font-mono text-[9px] uppercase text-[var(--a-text-muted)] mb-1 text-center">
              Izquierda
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((it, i) =>
                it.wall === "izquierda" ? (
                  <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    className="px-2 py-1 rounded bg-[var(--a-surface-2)] border border-[var(--a-border)] text-[9px] text-[var(--a-text)] cursor-grab active:cursor-grabbing"
                    style={{ opacity: draggingIndex === i ? 0.3 : 1 }}
                  >
                    {it.label}
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div
            ref={(el) => { zoneRefs.current.isla = el; }}
            className="rounded-lg border-2 border-dashed p-2 min-h-[90px] flex flex-col items-center justify-center"
            style={{
              borderColor: hoverZone === "isla" ? "#1f3a5c" : "#c9cfd4",
              background: hoverZone === "isla" ? "rgba(31,58,92,0.08)" : "transparent",
            }}
          >
            <p className="font-mono text-[9px] uppercase text-[var(--a-text-muted)] mb-1 text-center">
              Isla
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((it, i) =>
                it.wall === "isla" ? (
                  <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    className="px-2 py-1 rounded bg-[var(--a-surface-2)] border border-[var(--a-border)] text-[9px] text-[var(--a-text)] cursor-grab active:cursor-grabbing"
                    style={{ opacity: draggingIndex === i ? 0.3 : 1 }}
                  >
                    {it.label}
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div
            ref={(el) => { zoneRefs.current.frontal = el; }}
            className="rounded-lg border-2 border-dashed p-2 min-h-[90px]"
            style={{
              borderColor: hoverZone === "frontal" ? "#1f3a5c" : "#c9cfd4",
              background: hoverZone === "frontal" ? "rgba(31,58,92,0.08)" : "transparent",
            }}
          >
            <p className="font-mono text-[9px] uppercase text-[var(--a-text-muted)] mb-1 text-center">
              Frontal
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((it, i) =>
                it.wall === "frontal" ? (
                  <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    className="px-2 py-1 rounded bg-[var(--a-surface-2)] border border-[var(--a-border)] text-[9px] text-[var(--a-text)] cursor-grab active:cursor-grabbing"
                    style={{ opacity: draggingIndex === i ? 0.3 : 1 }}
                  >
                    {it.label}
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div />
          <div
            ref={(el) => { zoneRefs.current.derecha = el; }}
            className="rounded-lg border-2 border-dashed p-2 min-h-[90px]"
            style={{
              borderColor: hoverZone === "derecha" ? "#1f3a5c" : "#c9cfd4",
              background: hoverZone === "derecha" ? "rgba(31,58,92,0.08)" : "transparent",
            }}
          >
            <p className="font-mono text-[9px] uppercase text-[var(--a-text-muted)] mb-1 text-center">
              Derecha
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((it, i) =>
                it.wall === "derecha" ? (
                  <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    className="px-2 py-1 rounded bg-[var(--a-surface-2)] border border-[var(--a-border)] text-[9px] text-[var(--a-text)] cursor-grab active:cursor-grabbing"
                    style={{ opacity: draggingIndex === i ? 0.3 : 1 }}
                  >
                    {it.label}
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div />
        </div>

        {draggingItem && ghostPos && (
          <div
            className="fixed pointer-events-none px-3 py-1.5 rounded bg-[var(--a-accent)] text-white text-xs font-semibold shadow-lg z-50"
            style={{ left: ghostPos.x - 40, top: ghostPos.y - 16 }}
          >
            {draggingItem.label}
          </div>
        )}
      </div>
    </div>
  );
}

function TrailerFloorPlanSVG({
  items,
  lengthFt,
  doorWall,
}: {
  items: QuoteLineItem[];
  lengthFt: number | null | undefined;
  doorWall: string;
}) {
  const knownWalls = new Set(["trasera", "frontal", "izquierda", "derecha"]);

  const byWall: Record<string, QuoteLineItem[]> = {
    trasera: [],
    frontal: [],
    izquierda: [],
    derecha: [],
    isla: [],
  };
  items.forEach((it) => {
    const w = it.wall === "isla" ? "isla" : knownWalls.has(it.wall || "") ? (it.wall as string) : "trasera";
    byWall[w].push(it);
  });

  const totalIn = (lengthFt || 20) * 12;
  const bodyX = 110;
  const bodyY = 50;
  const bodyW = 520;
  const bodyH = 200;
  const scaleLong = bodyW / totalIn;

  function longRow(wallItems: QuoteLineItem[], y: number, dimAbove: boolean) {
    let cursor = bodyX + 12;
    const boxes: React.ReactNode[] = [];
    wallItems.forEach((it, idx) => {
      const widthIn = it.width_in || 24;
      const w = Math.max(34, widthIn * scaleLong);
      const dimY = dimAbove ? y - 8 : y + 44;
      const labelY = dimAbove ? y - 12 : y + 56;
      boxes.push(
        <g key={idx}>
          <line
            x1={cursor}
            y1={dimY}
            x2={cursor + w}
            y2={dimY}
            stroke="#5b6570"
            strokeWidth={0.5}
            markerStart="url(#fp-arrow)"
            markerEnd="url(#fp-arrow)"
          />
          <text x={cursor + w / 2} y={labelY} textAnchor="middle" fontSize={8} fill="#5b6570">
            {Math.round(widthIn)}"
          </text>
          <rect
            x={cursor}
            y={y}
            width={w}
            height={36}
            rx={4}
            fill="rgba(31,58,92,0.08)"
            stroke="#1f3a5c"
            strokeWidth={0.75}
          />
          <text x={cursor + w / 2} y={y + 22} textAnchor="middle" fontSize={8} fill="#1b1f23">
            {it.label.length > 12 ? it.label.slice(0, 11) + "…" : it.label}
          </text>
        </g>
      );
      cursor += w + 6;
    });
    return boxes;
  }

  function shortColumn(wallItems: QuoteLineItem[], x: number, alignLabelRight: boolean) {
    let cursor = bodyY + 12;
    const boxes: React.ReactNode[] = [];
    wallItems.forEach((it, idx) => {
      const h = 32;
      boxes.push(
        <g key={idx}>
          <rect
            x={x}
            y={cursor}
            width={70}
            height={h}
            rx={4}
            fill="rgba(31,58,92,0.08)"
            stroke="#1f3a5c"
            strokeWidth={0.75}
          />
          <text x={x + 35} y={cursor + h / 2 + 3} textAnchor="middle" fontSize={7.5} fill="#1b1f23">
            {it.label.length > 10 ? it.label.slice(0, 9) + "…" : it.label}
          </text>
        </g>
      );
      cursor += h + 6;
    });
    return boxes;
  }

  const doorPositions: Record<string, { x: number; y: number; label: { x: number; y: number } }> = {
    trasera: { x: bodyX + bodyW / 2, y: bodyY, label: { x: bodyX + bodyW / 2, y: bodyY - 30 } },
    derecha: { x: bodyX + bodyW / 2, y: bodyY + bodyH, label: { x: bodyX + bodyW / 2, y: bodyY + bodyH + 42 } },
    izquierda: { x: bodyX, y: bodyY + bodyH / 2, label: { x: bodyX - 30, y: bodyY + bodyH / 2 } },
    frontal: { x: bodyX + bodyW, y: bodyY + bodyH / 2, label: { x: bodyX + bodyW + 30, y: bodyY + bodyH / 2 } },
  };
  const doorPos = doorPositions[doorWall] || doorPositions.trasera;

  return (
    <svg viewBox="0 0 760 340" width="100%" style={{ maxHeight: 340 }}>
      <defs>
        <marker
          id="fp-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M2 1L8 5L2 9" fill="none" stroke="#5b6570" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* cuerpo del trailer */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={8} fill="none" stroke="#1b1f23" strokeWidth={1} />

      {/* lengüeta, siempre del lado frontal */}
      <path
        d={`M${bodyX + bodyW} ${bodyY} L${bodyX + bodyW + 55} ${bodyY + bodyH / 2} L${bodyX + bodyW} ${bodyY + bodyH}`}
        fill="none"
        stroke="#1b1f23"
        strokeWidth={1}
      />
      <text x={bodyX + bodyW + 20} y={bodyY + bodyH / 2 + 4} fontSize={8} fill="#5b6570" textAnchor="middle">
        Lengüeta
      </text>

      {/* puerta */}
      <circle cx={doorPos.x} cy={doorPos.y} r={4} fill="#c0392b" />
      <text x={doorPos.label.x} y={doorPos.label.y} fontSize={8} fill="#c0392b" textAnchor="middle">
        🚪 Puerta
      </text>

      {/* piezas por pared */}
      {longRow(byWall.trasera, bodyY + 6, true)}
      {longRow(byWall.derecha, bodyY + bodyH - 42, false)}
      {shortColumn(byWall.izquierda, bodyX + 6, false)}
      {shortColumn(byWall.frontal, bodyX + bodyW - 76, true)}

      {/* isla, flotando al centro */}
      {byWall.isla.length > 0 && (
        <g>
          {byWall.isla.map((it, idx) => (
            <g key={idx} transform={`translate(${bodyX + bodyW / 2 - 40 + idx * 85}, ${bodyY + bodyH / 2 - 18})`}>
              <rect width={75} height={36} rx={4} fill="rgba(31,58,92,0.12)" stroke="#1f3a5c" strokeWidth={0.75} />
              <text x={37} y={22} textAnchor="middle" fontSize={7.5} fill="#1b1f23">
                {it.label.length > 11 ? it.label.slice(0, 10) + "…" : it.label}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* medida total */}
      <line
        x1={bodyX}
        y1={bodyY + bodyH + 20}
        x2={bodyX + bodyW}
        y2={bodyY + bodyH + 20}
        stroke="#5b6570"
        strokeWidth={0.5}
        markerStart="url(#fp-arrow)"
        markerEnd="url(#fp-arrow)"
      />
      <text x={bodyX + bodyW / 2} y={bodyY + bodyH + 34} textAnchor="middle" fontSize={9} fill="#1b1f23">
        {lengthFt || 20} ft
      </text>
    </svg>
  );
}

function ViewQuoteModal({
  quote,
  onClose,
  onEdit,
}: {
  quote: Quote;
  onClose: () => void;
  onEdit: () => void;
}) {
  const subtotal = quote.items.reduce((sum, i) => sum + (i.price || 0), 0);
  const taxAmount = subtotal * ((quote.tax_rate || 0) / 100);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto">
      <div className="admin-card bg-[var(--a-surface)] w-full max-w-lg overflow-hidden">
        {quote.cover_image_url && (
          <img src={quote.cover_image_url} alt="" className="w-full h-40 object-cover" />
        )}
        <div className="p-6">
          <p className="admin-label mb-1">Cotización #{quote.quote_number}</p>
          <h3 className="text-lg font-semibold text-[var(--a-text)] mb-4">
            {quote.trailer_size || "Sin tamaño"}
          </h3>

          <div className="flex flex-col gap-1.5 mb-4">
            {quote.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <p className="text-[var(--a-text)]">{item.label}</p>
                <p className="font-mono text-[var(--a-text-muted)]">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-1 mb-5 font-mono text-sm border-t border-[var(--a-border)] pt-3">
            <p className="text-[var(--a-text-muted)]">Subtotal: ${subtotal.toLocaleString()}</p>
            {(quote.tax_rate || 0) > 0 && (
              <p className="text-[var(--a-text-muted)]">
                Tax ({quote.tax_rate}%): $
                {taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            )}
            <p className="text-[var(--a-text)] font-semibold text-base">
              Total: ${quote.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>

          {quote.notes && (
            <p className="text-sm text-[var(--a-text-muted)] mb-4">{quote.notes}</p>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 admin-btn-secondary">
              Cerrar
            </button>
            <button onClick={onEdit} className="flex-1 admin-btn-primary">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuoteBuilder({
  client,
  duplicateFrom,
  editingQuote,
  onDone,
}: {
  client: Client;
  duplicateFrom: Quote | null;
  editingQuote: Quote | null;
  onDone: () => void;
}) {
  const source = editingQuote || duplicateFrom;

  const [sizes, setSizes] = useState<TrailerSize[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetItems, setPresetItems] = useState<PresetItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  const [sizeId, setSizeId] = useState(source?.trailer_size_id || "");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [items, setItems] = useState<QuoteLineItem[]>(
    source
      ? source.items.filter((i) => !i.label.startsWith("Trailer base — "))
      : []
  );
  const [monthlyEstimate, setMonthlyEstimate] = useState(
    source?.monthly_estimate ? String(source.monthly_estimate) : ""
  );
  const [notes, setNotes] = useState(source?.notes || "");
  const [manualLabel, setManualLabel] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPlanEditor, setShowPlanEditor] = useState(false);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());
  const itemsListRef = useRef<HTMLDivElement>(null);
  const [doorWall, setDoorWall] = useState<string>(source?.door_wall || "trasera");

  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    const [s, c, ci, settings, p, pi] = await Promise.all([
      supabase.from("trailer_sizes").select("*").order("sort_order"),
      supabase.from("catalog_categories").select("*").order("sort_order"),
      supabase
        .from("catalog_items")
        .select("id,category_id,name,image_url,price,cost,width_in")
        .eq("active", true),
      supabase.from("business_settings").select("*").eq("id", 1).single(),
      supabase.from("catalog_presets").select("*").order("created_at", { ascending: false }),
      supabase.from("catalog_preset_items").select("*"),
    ]);
    setSizes((s.data as TrailerSize[]) || []);
    setCategories((c.data as Category[]) || []);
    setCatalogItems((ci.data as CatalogItem[]) || []);
    setPresets((p.data as Preset[]) || []);
    setPresetItems((pi.data as PresetItem[]) || []);
    setTaxRate(source?.tax_rate ?? settings.data?.tax_rate ?? 0);
    if (!source?.door_wall && settings.data?.default_door_wall) {
      setDoorWall(settings.data.default_door_wall);
    }
  }

  function addCatalogItem(item: CatalogItem) {
    setItems((prev) => [
      ...prev,
      {
        label: item.name,
        price: item.price,
        image_url: item.image_url,
        cost: item.cost || 0,
        wall: "trasera",
        width_in: item.width_in,
      },
    ]);
    setRecentlyAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setRecentlyAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1200);
  }

  function addPreset(preset: Preset) {
    const presetLinks = presetItems.filter((pi) => pi.preset_id === preset.id);
    const itemsToAdd = presetLinks
      .map((link): QuoteLineItem | null => {
        const item = catalogItems.find((ci) => ci.id === link.catalog_item_id);
        if (!item) return null;
        return {
          label: item.name,
          price: item.price,
          image_url: item.image_url,
          cost: item.cost || 0,
          wall: (link as PresetItem & { wall?: string }).wall || "trasera",
          width_in: item.width_in,
        };
      })
      .filter((x): x is QuoteLineItem => x !== null);
    setItems((prev) => [...prev, ...itemsToAdd]);
  }

  function addManualItem() {
    if (!manualLabel || !manualPrice) return;
    setItems((prev) => [
      ...prev,
      { label: manualLabel, price: parseFloat(manualPrice) || 0, cost: 0, wall: "trasera" },
    ]);
    setManualLabel("");
    setManualPrice("");
  }

  function updateItemWall(index: number, wall: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, wall } : item)));
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

  const visibleItems = catalogItems.filter((i) => i.category_id === activeCategory);

  async function generateAndSave() {
    if (combinedItems.length === 0) return;
    setSaving(true);

    const quoteNumber = editingQuote
      ? editingQuote.quote_number
      : String(
          ((
            await supabase
              .from("quotes")
              .select("id", { count: "exact", head: true })
              .eq("client_id", client.id)
          ).count || 0) + 1
        ).padStart(4, "0");

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
      download: false,
    });

    const pdfPath = `${client.id}/${quoteNumber}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("quote-pdfs")
      .upload(pdfPath, totals.blob, { contentType: "application/pdf" });

    const payload = {
      trailer_size: selectedSize?.label || null,
      trailer_size_id: selectedSize?.id || null,
      cover_image_url: selectedSize?.image_url || null,
      items: combinedItems,
      subtotal: totals.subtotal,
      tax_rate: taxRate,
      tax_amount: totals.taxAmount,
      total: totals.total,
      margin,
      pdf_url: uploadError ? null : pdfPath,
      door_wall: doorWall,
      monthly_estimate: monthlyEstimate ? parseFloat(monthlyEstimate) : null,
      notes: notes || null,
    };

    if (editingQuote) {
      if (editingQuote.pdf_url) {
        await supabase.storage.from("quote-pdfs").remove([editingQuote.pdf_url]);
      }
      await supabase.from("quotes").update(payload).eq("id", editingQuote.id);
    } else {
      await supabase.from("quotes").insert({
        client_id: client.id,
        quote_number: quoteNumber,
        ...payload,
      });
    }

    setSaving(false);
    onDone();
  }

  return (
    <div className="mb-6 p-4 bg-[var(--a-surface-2)] rounded-lg">
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

      <div className="mb-5">
        <label className="block font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-1.5">
          Puerta en
        </label>
        <select
          value={doorWall}
          onChange={(e) => setDoorWall(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        >
          <option value="trasera">Pared trasera</option>
          <option value="frontal">Pared frontal (lengüeta)</option>
          <option value="izquierda">Pared izquierda</option>
          <option value="derecha">Pared derecha</option>
        </select>
      </div>

      {presets.length > 0 && (
        <>
          <label className="block font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-1.5">
            Presets — agregar varias piezas de un clic
          </label>
          <div className="flex flex-wrap gap-2 mb-5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => addPreset(preset)}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[var(--a-accent)]/10 text-[var(--a-accent)] border border-[var(--a-accent)]/30"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </>
      )}

      {items.length > 0 && (
        <div
          className="sticky top-2 z-20 mb-4 flex items-center justify-between px-4 py-2.5 rounded-lg"
          style={{ background: "rgba(31,58,92,0.08)", border: "0.5px solid var(--a-accent)" }}
        >
          <p className="text-sm font-semibold text-[var(--a-accent)]">
            {items.length} pieza{items.length !== 1 ? "s" : ""} · $
            {items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}
          </p>
          <button
            onClick={() => itemsListRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="text-xs font-mono text-[var(--a-accent)]"
          >
            Ver lista ↓
          </button>
        </div>
      )}

      <label className="block font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)] mb-1.5">
        Catálogo
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {visibleItems.map((item) => {
            const justAdded = recentlyAddedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => addCatalogItem(item)}
                className={`admin-card overflow-hidden text-left relative transition-colors ${
                  justAdded ? "border-[var(--a-success)]" : ""
                }`}
                style={justAdded ? { background: "rgba(30,142,90,0.08)" } : undefined}
              >
                {justAdded && (
                  <span
                    className="absolute top-1.5 right-1.5 z-10 rounded-full flex items-center justify-center"
                    style={{
                      width: 20,
                      height: 20,
                      background: "var(--a-success)",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    ✓
                  </span>
                )}
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-20 object-cover" />
                ) : (
                  <div className="w-full h-20 bg-[var(--a-bg)] flex items-center justify-center text-[10px] font-mono text-[var(--a-text-muted)]">
                    Sin foto
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold text-[var(--a-text)] leading-tight">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-[var(--a-accent)] mt-1">
                    {justAdded ? "Agregada" : `$${item.price.toLocaleString()}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

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
          className="admin-btn-ghost"
        >
          Agregar
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p ref={itemsListRef} className="font-mono text-[10px] uppercase tracking-wide text-[var(--a-text-muted)]">
          En la cotización ({combinedItems.length})
        </p>
        {items.length > 0 && (
          <button
            onClick={() => setShowPlanEditor(true)}
            className="text-xs font-mono text-[var(--a-accent)] font-semibold"
          >
            ✏️ Editar plano
          </button>
        )}
      </div>
      {combinedItems.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)] mb-5">
          Elige un tamaño o agrega algo del catálogo.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-5">
          {baseItem && (
            <div className="flex items-center gap-2 sm:gap-3 bg-[var(--a-surface)] rounded px-2 sm:px-3 py-2 border border-[var(--a-accent)]/30">
              {(() => {
                const sizeImg = selectedSize?.image_url;
                return sizeImg ? (
                  <img
                    src={sizeImg}
                    alt=""
                    className="w-9 h-9 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded bg-[var(--a-surface-2)] flex-shrink-0" />
                );
              })()}
              <p className="flex-1 min-w-0 text-sm text-[var(--a-text)] truncate">
                {baseItem.label}
              </p>
              <p className="font-mono text-sm text-[var(--a-accent)] flex-shrink-0">
                ${baseItem.price.toLocaleString()}
              </p>
            </div>
          )}
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 bg-[var(--a-surface)] rounded px-2 sm:px-3 py-2"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="w-9 h-9 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded bg-[var(--a-surface-2)] flex-shrink-0" />
              )}
              <p className="flex-1 min-w-0 text-sm text-[var(--a-text)] truncate">{item.label}</p>
              <span className="text-[9px] font-mono uppercase text-[var(--a-text-muted)] bg-[var(--a-surface-2)] rounded px-1.5 py-1 flex-shrink-0">
                {item.wall === "frontal"
                  ? "Frontal"
                  : item.wall === "izquierda"
                  ? "Izquierda"
                  : item.wall === "derecha"
                  ? "Derecha"
                  : item.wall === "isla"
                  ? "Isla"
                  : "Trasera"}
              </span>
              <p className="font-mono text-sm text-[var(--a-accent)] flex-shrink-0">
                ${item.price.toLocaleString()}
              </p>
              <button
                onClick={() => removeItem(i)}
                className="text-[var(--a-text-muted)] hover:text-[var(--a-accent)] text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mb-3">
        <label className="admin-label">Tax para esta cotización (%)</label>
        <input
          type="number"
          step="0.001"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          className="w-24 px-2 py-1 bg-[var(--a-surface)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
      </div>

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
        onClick={() => setShowPreview(true)}
        disabled={combinedItems.length === 0}
        className="w-full px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
      >
        Vista previa →
      </button>

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto">
          <div className="admin-card bg-[var(--a-surface)] w-full max-w-lg overflow-hidden">
            {selectedSize?.image_url && (
              <img src={selectedSize.image_url as string} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
              <p className="admin-label mb-1">Vista previa — no se ha guardado todavía</p>
              <h3 className="text-lg font-semibold text-[var(--a-text)] mb-4">
                Cotización para {client.name}
              </h3>

              <div className="flex flex-col gap-1.5 mb-4">
                {combinedItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <p className="text-[var(--a-text)]">{item.label}</p>
                    <p className="font-mono text-[var(--a-text-muted)]">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="mb-4 pt-3 border-t border-[var(--a-border)]">
                  <p className="admin-label mb-2">Plano del trailer</p>
                  <TrailerFloorPlanSVG
                    items={items}
                    lengthFt={selectedSize?.length_ft}
                    doorWall={doorWall}
                  />
                </div>
              )}

              <div className="flex flex-col items-end gap-1 mb-5 font-mono text-sm border-t border-[var(--a-border)] pt-3">
                <p className="text-[var(--a-text-muted)]">Subtotal: ${subtotal.toLocaleString()}</p>
                {taxRate > 0 && (
                  <p className="text-[var(--a-text-muted)]">
                    Tax ({taxRate}%): $
                    {taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-[var(--a-text)] font-semibold text-base">
                  Total: ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 admin-btn-secondary"
                >
                  Editar
                </button>
                <button
                  onClick={async () => {
                    await generateAndSave();
                    setShowPreview(false);
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar cotización"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlanEditor && (
        <FloorPlanEditorModal
          items={items}
          onUpdateWall={updateItemWall}
          onClose={() => setShowPlanEditor(false)}
        />
      )}
    </div>
  );
}