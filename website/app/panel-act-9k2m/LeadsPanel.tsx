"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  trailer_type: string | null;
  language: string;
  status: "nuevo" | "contactado" | "cotizado" | "convertido" | "perdido";
  notes: string | null;
  created_at: string;
  converted_at: string | null;
};

type Activity = {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
};

const SOURCE_LABELS: Record<string, string> = {
  gallery: "Gallery",
  contact_form: "Contact form",
  custom_request: "Custom build",
  configurator: "Configurator",
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  cotizado: "Cotizado",
  convertido: "Convertido",
  perdido: "Perdido",
};

const STATUS_COLORS: Record<Lead["status"], string> = {
  nuevo: "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10",
  contactado: "bg-[#2b241d] text-[#e8794a] border border-[#e8794a]/30",
  cotizado: "bg-[#2b241d] text-[#c9a227] border border-[#c9a227]/30",
  convertido: "bg-[#1d3b2c] text-[#4caf7d] border border-[#4caf7d]/30",
  perdido: "bg-[#211c17] text-[#665f56] border border-[#f2ece2]/5",
};

function isUrgent(lead: Lead) {
  if (lead.status !== "nuevo") return false;
  const hoursSince = (Date.now() - new Date(lead.created_at).getTime()) / 36e5;
  return hoursSince > 48;
}

function LeadCard({
  lead,
  onStatusChange,
  onConvert,
}: {
  lead: Lead;
  onStatusChange: (lead: Lead, status: Lead["status"]) => void;
  onConvert: (lead: Lead) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [newNote, setNewNote] = useState("");
  const urgent = isUrgent(lead);

  async function loadActivity() {
    setLoadingActivity(true);
    const { data } = await supabase
      .from("lead_activity")
      .select("*")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false });
    setActivity((data as Activity[]) || []);
    setLoadingActivity(false);
  }

  function toggleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && activity.length === 0) loadActivity();
  }

  async function addNote() {
    if (!newNote.trim()) return;
    await supabase.from("lead_activity").insert({ lead_id: lead.id, note: newNote });
    setNewNote("");
    loadActivity();
  }

  return (
    <div
      className={`stacked-card p-5 ${
        urgent ? "border-l-4 border-l-[#e63946]" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-[#f2ece2]">{lead.name}</p>
            <span className="tag-pill">{SOURCE_LABELS[lead.source] || lead.source}</span>
            <span className="font-mono text-[10px] text-[#8f8477] uppercase">
              {lead.language}
            </span>
            {urgent && (
              <span className="font-mono text-[10px] text-[#e63946] uppercase">
                ⚠ +48h sin contactar
              </span>
            )}
          </div>
          <p className="font-mono text-sm text-[#c9c2b6]">{lead.phone}</p>
          {lead.trailer_type && (
            <p className="text-xs text-[#8f8477] mt-1">Interested in: {lead.trailer_type}</p>
          )}
          {lead.notes && (
            <p className="text-xs text-[#8f8477] mt-1 italic">"{lead.notes}"</p>
          )}

          <button
            onClick={toggleExpand}
            className="mt-2 font-mono text-[10px] text-[#e8794a]"
          >
            {expanded ? "Ocultar historial" : "Ver historial de contacto"}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-[#f2ece2]/8">
              <div className="flex gap-2 mb-3">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ej. Llamé, dijo que lo pensaba, volver a marcar el viernes"
                  className="flex-1 px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-xs text-[#f2ece2]"
                />
                <button
                  onClick={addNote}
                  className="px-3 py-2 bg-[#b8562f] text-white rounded text-xs font-mono"
                >
                  Agregar
                </button>
              </div>
              {loadingActivity ? (
                <p className="text-xs text-[#8f8477]">Cargando...</p>
              ) : activity.length === 0 ? (
                <p className="text-xs text-[#8f8477]">Sin actividad registrada.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {activity.map((a) => (
                    <div key={a.id} className="text-xs bg-[#211c17] rounded px-3 py-2">
                      <p className="text-[#f2ece2]">{a.note}</p>
                      <p className="font-mono text-[10px] text-[#8f8477] mt-1">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="font-mono text-[11px] text-[#8f8477]">
            {new Date(lead.created_at).toLocaleDateString()}
          </span>

          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead, e.target.value as Lead["status"])}
            className={`px-2 py-1 rounded text-[10px] font-mono font-semibold ${STATUS_COLORS[lead.status]}`}
          >
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="cotizado">Cotizado</option>
            <option value="convertido">Convertido</option>
            <option value="perdido">Perdido</option>
          </select>

          {lead.status !== "convertido" && (
            <button
              onClick={() => onConvert(lead)}
              className="px-3 py-1.5 bg-[#2b241d] border border-[#f2ece2]/15 rounded text-[10px] font-mono text-[#f2ece2] hover:border-[#b8562f] whitespace-nowrap"
            >
              Convertir en cliente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  }

  async function handleStatusChange(lead: Lead, status: Lead["status"]) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", lead.id);
  }

  async function handleConvert(lead: Lead) {
    await supabase.from("clients").insert({
      lead_id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      quote_status: "pendiente",
    });

    const convertedAt = new Date().toISOString();
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id ? { ...l, status: "convertido", converted_at: convertedAt } : l
      )
    );
    await supabase
      .from("leads")
      .update({ status: "convertido", converted_at: convertedAt })
      .eq("id", lead.id);
  }

  const sources = ["all", ...Array.from(new Set(leads.map((l) => l.source)))];

  const filtered = leads
    .filter((lead) => sourceFilter === "all" || lead.source === sourceFilter)
    .filter((lead) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return lead.status !== "perdido";
      return lead.status === statusFilter;
    })
    .filter((lead) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return lead.name.toLowerCase().includes(q) || lead.phone.includes(q);
    })
    .sort((a, b) => {
      const aUrgent = isUrgent(a);
      const bUrgent = isUrgent(b);
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs text-[#8f8477]">
          {leads.length} total · {leads.filter(isUrgent).length} urgentes
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o teléfono..."
        className="w-full mb-4 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => setSourceFilter(src)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              sourceFilter === src
                ? "bg-[#b8562f] text-white"
                : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
            }`}
          >
            {src === "all" ? "All sources" : SOURCE_LABELS[src] || src}
          </button>
        ))}

        <span className="w-px bg-[#f2ece2]/10 mx-1" />

        {["active", "nuevo", "contactado", "cotizado", "convertido", "perdido", "all"].map(
          (opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                statusFilter === opt
                  ? "bg-[#f2ece2] text-[#16130f]"
                  : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
              }`}
            >
              {opt === "active"
                ? "Activos"
                : opt === "all"
                ? "Todos"
                : STATUS_LABELS[opt as Lead["status"]]}
            </button>
          )
        )}
      </div>

      {loading ? (
        <p className="text-[#8f8477] font-mono text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#8f8477] font-mono text-sm">No leads match this filter.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
              onConvert={handleConvert}
            />
          ))}
        </div>
      )}
    </div>
  );
}