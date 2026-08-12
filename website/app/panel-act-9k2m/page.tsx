"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

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
  temperature: "rojo" | "amarillo" | "verde" | null;
  created_at: string;
};

function NewClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [timeline, setTimeline] = useState("");
  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  async function handleSave() {
    if (!name || !phone) return;
    setSaving(true);
    setDuplicateWarning(false);

    // revisa si ya existe alguien con este teléfono en los últimos 30 días
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("phone", phone)
      .gte("created_at", cutoff.toISOString())
      .is("deleted_at", null)
      .limit(1);

    if (existing && existing.length > 0) {
      // ya existe — en vez de duplicar, se agrega como nota a su ficha
      await supabase.from("client_activity").insert({
        client_id: existing[0].id,
        note: `Se intentó dar de alta de nuevo a mano${interest ? ` — interés: ${interest}` : ""}`,
      });
      setSaving(false);
      setDuplicateWarning(true);
      onCreated();
      return;
    }

    await supabase.from("clients").insert({
      name,
      phone,
      email: email || null,
      interest: interest || null,
      heard_from: heardFrom || null,
      timeline: timeline || null,
    });
    setSaving(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="admin-card p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-[var(--a-text)] mb-4">
          Nuevo cliente
        </h3>
        {duplicateWarning && (
          <div className="mb-3 px-3 py-2 bg-[var(--a-warning-bg)] rounded text-sm text-[var(--a-warning)]">
            Ya existe un cliente con ese teléfono (de los últimos 30 días) — no se duplicó,
            se agregó una nota a su ficha en vez de crear uno nuevo.
          </div>
        )}
        <div className="flex flex-col gap-3 mb-5">
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <input
            placeholder="Email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <input
            placeholder="¿Qué le interesa? (ej. trailer de tacos)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <select
            value={heardFrom}
            onChange={(e) => setHeardFrom(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          >
            <option value="">¿Cómo te conoció? (opcional)</option>
            <option value="redes_sociales">Redes sociales</option>
            <option value="recomendacion">Recomendación</option>
            <option value="vio_trailer">Vio un trailer en la calle</option>
            <option value="otro">Otro</option>
          </select>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          >
            <option value="">¿Para cuándo lo necesita? (opcional)</option>
            <option value="lo_antes_posible">Lo antes posible</option>
            <option value="este_mes">Este mes</option>
            <option value="este_trimestre">Este trimestre</option>
            <option value="solo_viendo">Solo viendo opciones</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded text-sm font-mono text-[var(--a-text-muted)] border border-[var(--a-border)]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name || !phone}
            className="flex-1 px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardStats({ clients }: { clients: Client[] }) {
  const [stats, setStats] = useState({
    cotizadoMes: 0,
    aceptadoMes: 0,
    margenMes: 0,
    clientesNuevosMes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: quotesData } = await supabase
      .from("quotes")
      .select("total, margin, status, created_at")
      .gte("created_at", startOfMonth);

    const { count: clientsCount } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    const quotes = quotesData || [];
    const cotizadoMes = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
    const aceptadas = quotes.filter((q) => q.status === "aceptada");
    const aceptadoMes = aceptadas.reduce((sum, q) => sum + (q.total || 0), 0);
    const margenMes = aceptadas.reduce((sum, q) => sum + (q.margin || 0), 0);

    setStats({
      cotizadoMes,
      aceptadoMes,
      margenMes,
      clientesNuevosMes: clientsCount || 0,
    });
    setLoading(false);
  }

  const items = [
    { label: "Cotizado este mes", value: stats.cotizadoMes },
    { label: "Aceptado este mes", value: stats.aceptadoMes },
    { label: "Margen (aceptado)", value: stats.margenMes },
    { label: "Clientes nuevos", value: stats.clientesNuevosMes, isCount: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {items.map((item) => (
        <div key={item.label} className="admin-card p-4">
          <p className="admin-label mb-1">{item.label}</p>
          <p className="text-xl font-semibold text-[var(--a-text)]">
            {loading
              ? "..."
              : item.isCount
              ? item.value
              : `$${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "sitio_web" | "manual">("all");
  const [statusFilter, setStatusFilter] = useState<"activo" | "perdido" | "all">("activo");
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    load();
  }, [showTrash]);

  async function load() {
    setLoading(true);
    const query = supabase.from("clients").select("*").order("created_at", { ascending: false });
    const { data } = showTrash
      ? await query.not("deleted_at", "is", null)
      : await query.is("deleted_at", null);
    setClients((data as Client[]) || []);
    setLoading(false);
  }

  async function restoreClient(id: string) {
    await supabase.from("clients").update({ deleted_at: null }).eq("id", id);
    load();
  }

  async function cycleTemperature(client: Client) {
    const order: (Client["temperature"])[] = [null, "rojo", "amarillo", "verde"];
    const currentIndex = order.indexOf(client.temperature);
    const next = order[(currentIndex + 1) % order.length];
    setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, temperature: next } : c)));
    await supabase.from("clients").update({ temperature: next }).eq("id", client.id);
  }

  function temperatureColor(t: Client["temperature"]) {
    if (t === "rojo") return "#c0392b";
    if (t === "amarillo") return "#e0a52c";
    if (t === "verde") return "#1e8e5a";
    return "var(--a-border)";
  }

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function deleteForever(id: string) {
    setDeleteError(null);
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      setDeleteError(id);
      return;
    }
    setConfirmDeleteId(null);
    load();
  }

  const filtered = clients
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q);
    })
    .filter((c) => {
      if (dateFilter === "all") return true;
      const created = new Date(c.created_at);
      const now = new Date();
      if (dateFilter === "today") {
        return created.toDateString() === now.toDateString();
      }
      // esta semana: últimos 7 días
      const weekAgo = new Date(now.getTime() - 7 * 864e5);
      return created >= weekAgo;
    })
    .filter((c) => {
      if (sourceFilter === "all") return true;
      if (sourceFilter === "sitio_web") return c.heard_from?.startsWith("sitio_web") ?? false;
      return !c.heard_from?.startsWith("sitio_web");
    })
    .filter((c) => {
      if (statusFilter === "all") return true;
      return c.status === statusFilter;
    });

  return (
    <div>
      {!showTrash && <DashboardStats clients={clients} />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-[var(--a-text-muted)]">
            {clients.length} {showTrash ? "en la papelera" : "clientes"}
          </p>
          <button
            onClick={() => setShowTrash((v) => !v)}
            className="admin-btn-ghost"
          >
            {showTrash ? "← Volver a clientes" : "🗑 Papelera"}
          </button>
        </div>
        {!showTrash && (
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-xs font-mono font-semibold"
          >
            + Nuevo cliente
          </button>
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full mb-3 px-4 py-2.5 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
      />

      <div className="flex gap-2 mb-3">
        {(["activo", "perdido", "all"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setStatusFilter(opt)}
            className={`admin-pill ${statusFilter === opt ? "active" : ""}`}
          >
            {opt === "activo" ? "Activos" : opt === "perdido" ? "Perdidos" : "Todos"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "today", "week"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setDateFilter(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              dateFilter === opt
                ? "bg-[var(--a-accent)] text-white"
                : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {opt === "all" ? "Todos" : opt === "today" ? "Hoy" : "Esta semana"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "sitio_web", "manual"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setSourceFilter(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              sourceFilter === opt
                ? "bg-[var(--a-text)] text-[var(--a-surface)]"
                : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {opt === "all" ? "Todas las fuentes" : opt === "sitio_web" ? "Desde el sitio" : "Dados de alta a mano"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--a-text-muted)] font-mono text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[var(--a-text-muted)] font-mono text-sm">
          {search ? "Sin resultados." : "Todavía no hay clientes. Agrega el primero."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((client) =>
            showTrash ? (
              <div
                key={client.id}
                className="admin-card p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--a-text)]">{client.name}</p>
                  <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreClient(client.id)}
                    className="admin-btn-secondary text-xs"
                  >
                    Restaurar
                  </button>
                  {confirmDeleteId === client.id ? (
                    <>
                      {deleteError === client.id && (
                        <span className="font-mono text-[10px] text-[var(--a-danger)]">
                          No se pudo borrar
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-[var(--a-text)]">¿Seguro?</span>
                      <button
                        onClick={() => deleteForever(client.id)}
                        className="admin-btn-ghost danger"
                      >
                        Sí, para siempre
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="admin-btn-ghost"
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(client.id)}
                      className="admin-btn-ghost danger"
                    >
                      Borrar para siempre
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <Link
                key={client.id}
                href={`/panel-act-9k2m/clients/${client.id}`}
                className="admin-card p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cycleTemperature(client);
                    }}
                    title="Qué tan probable es que compre — clic para cambiar"
                    className="flex-shrink-0 rounded-full"
                    style={{
                      width: 14,
                      height: 14,
                      background: temperatureColor(client.temperature),
                      border: client.temperature ? "none" : "2px solid var(--a-border)",
                    }}
                  />
                  <div>
                    <p className="font-semibold text-[var(--a-text)]">{client.name}</p>
                    <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.phone}</p>
                    {(client.interest ||
                      client.heard_from?.startsWith("sitio_web") ||
                      client.utm_source) && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {client.interest && (
                          <span className="admin-badge">{client.interest}</span>
                        )}
                      {client.heard_from === "sitio_web_contacto" && (
                        <span className="font-mono text-[10px] text-[var(--a-accent)] uppercase">
                          Formulario de contacto
                        </span>
                      )}
                      {client.heard_from === "sitio_web_galeria" && (
                        <span className="font-mono text-[10px] text-[var(--a-accent)] uppercase">
                          Galería 3D
                        </span>
                      )}
                      {client.utm_source && (
                        <span className="admin-badge accent">📣 {client.utm_source}</span>
                      )}
                    </div>
                  )}
                </div>
                </div>
                <span className="font-mono text-[11px] text-[var(--a-text-muted)]">
                  {new Date(client.created_at).toLocaleDateString()}
                </span>
              </Link>
            )
          )}
        </div>
      )}

      {showNew && <NewClientModal onClose={() => setShowNew(false)} onCreated={load} />}
    </div>
  );
}