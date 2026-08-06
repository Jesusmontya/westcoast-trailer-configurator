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

  async function handleSave() {
    if (!name || !phone) return;
    setSaving(true);
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

  async function deleteForever(id: string) {
    if (!confirm("Esto borra al cliente para siempre, incluyendo su historial y cotizaciones. ¿Seguro?")) {
      return;
    }
    await supabase.from("clients").delete().eq("id", id);
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
      if (sourceFilter === "sitio_web") return c.heard_from === "sitio_web";
      return c.heard_from !== "sitio_web";
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
            className="font-mono text-[11px] text-[var(--a-text-muted)] hover:text-[var(--a-text)] underline"
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
                  <button
                    onClick={() => deleteForever(client.id)}
                    className="font-mono text-[11px] text-[var(--a-danger)]"
                  >
                    Borrar para siempre
                  </button>
                </div>
              </div>
            ) : (
              <Link
                key={client.id}
                href={`/panel-act-9k2m/clients/${client.id}`}
                className="admin-card p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--a-text)]">{client.name}</p>
                  <p className="font-mono text-sm text-[var(--a-text-muted)]">{client.phone}</p>
                  {(client.interest || client.heard_from === "sitio_web") && (
                    <div className="flex items-center gap-2 mt-1.5">
                      {client.interest && (
                        <span className="admin-badge">{client.interest}</span>
                      )}
                      {client.heard_from === "sitio_web" && (
                        <span className="font-mono text-[10px] text-[var(--a-accent)] uppercase">
                          Desde el sitio
                        </span>
                      )}
                    </div>
                  )}
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