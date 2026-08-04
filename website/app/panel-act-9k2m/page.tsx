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
  attended: boolean;
  notes: string | null;
  created_at: string;
};

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Invalid email or password.");
      return;
    }

    onLogin();
  }

  return (
    <div className="min-h-screen flex items-center justify-center blueprint-bg px-6">
      <form onSubmit={handleSubmit} className="stacked-card p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-[#f2ece2] mb-1">
          Admin panel
        </h1>
        <p className="font-mono text-xs text-[#8f8477] mb-6">All Custom Trailers</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f]"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f]"
          />

          {error && <p className="text-sm text-[#e63946]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 bg-[#b8562f] text-white font-semibold rounded hover:bg-[#e8794a] transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
}

const SOURCE_LABELS: Record<string, string> = {
  gallery: "Gallery",
  contact_form: "Contact form",
  custom_request: "Custom build",
  configurator: "Configurator",
};

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [attendedFilter, setAttendedFilter] = useState<string>("all");

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

  async function toggleAttended(lead: Lead) {
    const newValue = !lead.attended;

    // actualiza en pantalla de inmediato, sin esperar a la respuesta del servidor
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, attended: newValue } : l))
    );

    await supabase
      .from("leads")
      .update({
        attended: newValue,
        contacted_at: newValue ? new Date().toISOString() : null,
      })
      .eq("id", lead.id);
  }

  const filtered = leads.filter((lead) => {
    const matchesSource = filter === "all" || lead.source === filter;
    const matchesAttended =
      attendedFilter === "all" ||
      (attendedFilter === "attended" && lead.attended) ||
      (attendedFilter === "pending" && !lead.attended);
    return matchesSource && matchesAttended;
  });

  const sources = ["all", ...Array.from(new Set(leads.map((l) => l.source)))];

  return (
    <div className="min-h-screen blueprint-bg px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#f2ece2]">
              Leads
            </h1>
            <p className="font-mono text-xs text-[#8f8477] mt-1">
              {leads.length} total · {leads.filter((l) => !l.attended).length} pending
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-mono border border-[#f2ece2]/15 rounded text-[#8f8477] hover:text-[#f2ece2] hover:border-[#f2ece2]/30 transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setFilter(src)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                filter === src
                  ? "bg-[#b8562f] text-white"
                  : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
              }`}
            >
              {src === "all" ? "All sources" : SOURCE_LABELS[src] || src}
            </button>
          ))}

          <span className="w-px bg-[#f2ece2]/10 mx-1" />

          {["all", "pending", "attended"].map((opt) => (
            <button
              key={opt}
              onClick={() => setAttendedFilter(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                attendedFilter === opt
                  ? "bg-[#f2ece2] text-[#16130f]"
                  : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
              }`}
            >
              {opt === "all" ? "All status" : opt === "pending" ? "Pending" : "Attended"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#8f8477] font-mono text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-[#8f8477] font-mono text-sm">No leads match this filter.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((lead) => (
              <div key={lead.id} className="stacked-card p-5 flex items-start gap-4">
                <button
                  onClick={() => toggleAttended(lead)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                    lead.attended
                      ? "bg-[#b8562f] border-[#b8562f]"
                      : "border-[#f2ece2]/25"
                  }`}
                  title={lead.attended ? "Mark as pending" : "Mark as attended"}
                >
                  {lead.attended && <span className="text-white text-xs">✓</span>}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-[#f2ece2]">{lead.name}</p>
                    <span className="tag-pill">
                      {SOURCE_LABELS[lead.source] || lead.source}
                    </span>
                    <span className="font-mono text-[10px] text-[#8f8477] uppercase">
                      {lead.language}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-[#c9c2b6]">{lead.phone}</p>
                  {lead.trailer_type && (
                    <p className="text-xs text-[#8f8477] mt-1">
                      Interested in: {lead.trailer_type}
                    </p>
                  )}
                  {lead.notes && (
                    <p className="text-xs text-[#8f8477] mt-1 italic">"{lead.notes}"</p>
                  )}
                </div>

                <span className="font-mono text-[11px] text-[#8f8477] flex-shrink-0">
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!checked) return null;

  if (!session) {
    return <LoginForm onLogin={() => {}} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}