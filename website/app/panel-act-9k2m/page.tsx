"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import {
  Deal,
  STAGE_LABELS,
  STAGE_ORDER,
  SOURCE_LABELS,
  isStale,
} from "../../lib/deals";

function NewDealModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name || !phone) return;
    setSaving(true);
    await supabase.from("deals").insert({
      name,
      phone,
      email: email || null,
      source: "contact_form",
      stage: "nuevo",
      language: "es",
    });
    setSaving(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
      <div className="stacked-card p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-semibold text-[#f2ece2] mb-4">
          Nuevo deal
        </h3>
        <div className="flex flex-col gap-3 mb-5">
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
          <input
            placeholder="Email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {saving ? "..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PanelDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showLost, setShowLost] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    setLoading(true);
    const { data } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
    setDeals((data as Deal[]) || []);
    setLoading(false);
  }

  const filtered = deals.filter((d) => {
    if (!showLost && d.stage === "perdido") return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.phone.includes(q);
  });

  const columns = showLost ? [...STAGE_ORDER, "perdido" as const] : STAGE_ORDER;

  const urgentCount = deals.filter(isStale).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs text-[#8f8477]">
          {deals.length} en total · {urgentCount} urgentes
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLost((v) => !v)}
            className="font-mono text-[11px] text-[#8f8477] hover:text-[#f2ece2]"
          >
            {showLost ? "Ocultar perdidos" : "Mostrar perdidos"}
          </button>
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 bg-[#b8562f] text-white rounded text-xs font-mono font-semibold"
          >
            + Nuevo
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full mb-6 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
      />

      {loading ? (
        <p className="text-[#8f8477] font-mono text-sm">Cargando...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((stage) => {
            const stageDeals = filtered.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477]">
                    {STAGE_LABELS[stage]}
                  </p>
                  <span className="font-mono text-[10px] text-[#8f8477]">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {stageDeals.length === 0 ? (
                    <p className="text-xs text-[#665f56] px-1">Vacío</p>
                  ) : (
                    stageDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/panel-act-9k2m/deals/${deal.id}`}
                        className={`stacked-card p-4 block ${
                          isStale(deal) ? "border-l-4 border-l-[#e63946]" : ""
                        }`}
                      >
                        <p className="font-semibold text-[#f2ece2] text-sm mb-1">
                          {deal.name}
                        </p>
                        <p className="font-mono text-xs text-[#c9c2b6] mb-1">
                          {deal.phone}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="tag-pill">
                            {SOURCE_LABELS[deal.source] || deal.source}
                          </span>
                          {deal.total_amount ? (
                            <span className="font-mono text-[10px] text-[#8f8477]">
                              ${deal.total_amount.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                        {isStale(deal) && (
                          <p className="font-mono text-[10px] text-[#e63946] mt-2">
                            ⚠ Sin avance
                          </p>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNew && (
        <NewDealModal onClose={() => setShowNew(false)} onCreated={loadDeals} />
      )}
    </div>
  );
}