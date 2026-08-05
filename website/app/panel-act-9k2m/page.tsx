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
      <div className="stacked-card p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-semibold text-[var(--text)] mb-4">
          Nuevo cliente
        </h3>
        <div className="flex flex-col gap-3 mb-5">
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
          />
          <input
            placeholder="Email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
          />
          <input
            placeholder="¿Qué le interesa? (ej. trailer de tacos)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
          />
          <select
            value={heardFrom}
            onChange={(e) => setHeardFrom(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
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
            className="w-full px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
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
            className="flex-1 px-4 py-2.5 rounded text-sm font-mono text-[var(--text-muted)] border border-[var(--line)]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name || !phone}
            className="flex-1 px-4 py-2.5 bg-[var(--accent-2)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "..." : "Guardar"}
          </button>
        </div>
      </div>
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

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients((data as Client[]) || []);
    setLoading(false);
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
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-[var(--text-muted)]">{clients.length} clientes</p>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-[var(--accent-2)] text-white rounded text-xs font-mono font-semibold"
        >
          + Nuevo cliente
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full mb-3 px-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded text-sm text-[var(--text)]"
      />

      <div className="flex gap-2 mb-6">
        {(["all", "today", "week"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setDateFilter(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              dateFilter === opt
                ? "bg-[var(--accent-2)] text-white"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--line)]"
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
                ? "bg-[var(--text)] text-[var(--surface)]"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--line)]"
            }`}
          >
            {opt === "all" ? "Todas las fuentes" : opt === "sitio_web" ? "Desde el sitio" : "Dados de alta a mano"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--text-muted)] font-mono text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[var(--text-muted)] font-mono text-sm">
          {search ? "Sin resultados." : "Todavía no hay clientes. Agrega el primero."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((client) => (
            <Link
              key={client.id}
              href={`/panel-act-9k2m/clients/${client.id}`}
              className="stacked-card p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-[var(--text)]">{client.name}</p>
                <p className="font-mono text-sm text-[var(--text-muted)]">{client.phone}</p>
                {(client.interest || client.heard_from === "sitio_web") && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {client.interest && (
                      <span className="tag-pill">{client.interest}</span>
                    )}
                    {client.heard_from === "sitio_web" && (
                      <span className="font-mono text-[10px] text-[var(--accent)] uppercase">
                        Desde el sitio
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {new Date(client.created_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}

      {showNew && <NewClientModal onClose={() => setShowNew(false)} onCreated={load} />}
    </div>
  );
}