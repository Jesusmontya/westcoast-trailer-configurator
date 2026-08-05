"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Client = { id: string; name: string; phone: string; created_at: string };

function NewClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name || !phone) return;
    setSaving(true);
    await supabase.from("clients").insert({ name, phone });
    setSaving(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="stacked-card p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-semibold text-[#f2ece2] mb-4">
          Nuevo cliente
        </h3>
        <div className="flex flex-col gap-3 mb-5">
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded text-sm font-mono text-[#8f8477] border border-[#f2ece2]/10"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name || !phone}
            className="flex-1 px-4 py-2.5 bg-[#b8562f] text-white rounded text-sm font-semibold disabled:opacity-60"
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
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-[#8f8477]">{clients.length} clientes</p>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-[#b8562f] text-white rounded text-xs font-mono font-semibold"
        >
          + Nuevo cliente
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full mb-3 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
      />

      <div className="flex gap-2 mb-6">
        {(["all", "today", "week"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setDateFilter(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              dateFilter === opt
                ? "bg-[#b8562f] text-white"
                : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
            }`}
          >
            {opt === "all" ? "Todos" : opt === "today" ? "Hoy" : "Esta semana"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#8f8477] font-mono text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#8f8477] font-mono text-sm">
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
                <p className="font-semibold text-[#f2ece2]">{client.name}</p>
                <p className="font-mono text-sm text-[#c9c2b6]">{client.phone}</p>
              </div>
              <span className="font-mono text-[11px] text-[#8f8477]">
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