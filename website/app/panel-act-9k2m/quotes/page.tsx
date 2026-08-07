"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type AcceptedQuote = {
  id: string;
  quote_number: string;
  trailer_size: string | null;
  total: number;
  margin: number | null;
  created_at: string;
  client_id: string;
  clients: { name: string; phone: string } | null;
};

export default function AcceptedQuotesPage() {
  const [quotes, setQuotes] = useState<AcceptedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeFilter, setRangeFilter] = useState<"month" | "all">("month");

  useEffect(() => {
    load();
  }, [rangeFilter]);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("quotes")
      .select("id, quote_number, trailer_size, total, margin, created_at, client_id, clients(name, phone)")
      .eq("status", "aceptada")
      .order("created_at", { ascending: false });

    if (rangeFilter === "month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      query = query.gte("created_at", startOfMonth);
    }

    const { data } = await query;
    setQuotes((data as unknown as AcceptedQuote[]) || []);
    setLoading(false);
  }

  const totalVentas = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
  const totalMargen = quotes.reduce((sum, q) => sum + (q.margin || 0), 0);
  const margenPromedio = quotes.length > 0 ? (totalMargen / totalVentas) * 100 : 0;

  return (
    <div>
      <Link
        href="/panel-act-9k2m"
        className="inline-block mb-4 font-mono text-xs text-[var(--a-text-muted)] hover:text-[var(--a-text)]"
      >
        ← Volver a clientes
      </Link>

      <h1 className="text-2xl font-semibold text-[var(--a-text)] mb-2">Cotizaciones aceptadas</h1>
      <p className="text-sm text-[var(--a-text-muted)] mb-6">
        El margen de cotizaciones de antes de agosto 2026 es aproximado — se calculó
        después con los precios guardados, no en el momento real de la venta.
      </p>

      <div className="flex gap-2 mb-6">
        {(["month", "all"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setRangeFilter(opt)}
            className={`admin-pill ${rangeFilter === opt ? "active" : ""}`}
          >
            {opt === "month" ? "Este mes" : "Todo el tiempo"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="admin-card p-4">
          <p className="admin-label mb-1">Cotizaciones</p>
          <p className="text-xl font-semibold text-[var(--a-text)]">{quotes.length}</p>
        </div>
        <div className="admin-card p-4">
          <p className="admin-label mb-1">Total vendido</p>
          <p className="text-xl font-semibold text-[var(--a-text)]">
            ${totalVentas.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="admin-label mb-1">Margen total</p>
          <p className="text-xl font-semibold text-[var(--a-accent)]">
            ${totalMargen.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="admin-card p-4">
          <p className="admin-label mb-1">Margen promedio</p>
          <p className="text-xl font-semibold text-[var(--a-text)]">
            {quotes.length > 0 ? `${margenPromedio.toFixed(1)}%` : "—"}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>
      ) : quotes.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)]">
          Sin cotizaciones aceptadas en este periodo.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {quotes.map((q) => (
            <Link
              key={q.id}
              href={`/panel-act-9k2m/clients/${q.client_id}`}
              className="admin-card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-[var(--a-text)]">
                  {q.clients?.name || "Cliente"}{" "}
                  <span className="font-mono text-xs text-[var(--a-text-muted)]">
                    #{q.quote_number}
                  </span>
                </p>
                <p className="font-mono text-xs text-[var(--a-text-muted)]">
                  {q.trailer_size || "—"} · {new Date(q.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-[var(--a-text)]">
                  ${q.total.toLocaleString()}
                </p>
                <p className="font-mono text-xs text-[var(--a-accent)]">
                  margen ${(q.margin || 0).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}