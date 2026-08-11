"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function SettingsPage() {
  const [taxRate, setTaxRate] = useState("");
  const [doorWall, setDoorWall] = useState("trasera");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("business_settings").select("*").eq("id", 1).single();
    setTaxRate(data ? String(data.tax_rate) : "0");
    setDoorWall(data?.default_door_wall || "trasera");
    setLoading(false);
  }

  async function save() {
    await supabase
      .from("business_settings")
      .update({
        tax_rate: parseFloat(taxRate) || 0,
        default_door_wall: doorWall,
      })
      .eq("id", 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <Link
        href="/panel-act-9k2m"
        className="inline-block mb-4 font-mono text-xs text-[var(--a-text-muted)] hover:text-[var(--a-text)]"
      >
        ← Volver a clientes
      </Link>

      <h1 className="text-2xl font-semibold text-[var(--a-text)] mb-6">Ajustes</h1>
      <p className="text-sm text-[var(--a-text-muted)] mb-6">
        Configuración general — se aplica sola en cada cotización nueva, sin
        tener que repetirla cada vez.
      </p>

      <div className="admin-card p-6 max-w-md flex flex-col gap-5">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-2">
            Tax (%)
          </label>
          <input
            type="number"
            step="0.001"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-2">
            Puerta por default
          </label>
          <select
            value={doorWall}
            onChange={(e) => setDoorWall(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          >
            <option value="trasera">Pared trasera</option>
            <option value="frontal">Pared frontal (junto a la lengüeta)</option>
            <option value="izquierda">Pared izquierda</option>
            <option value="derecha">Pared derecha</option>
          </select>
          <p className="text-xs text-[var(--a-text-muted)] mt-1">
            Se puede cambiar en cada cotización si ese trailer va distinto.
          </p>
        </div>

        <button onClick={save} className="admin-btn-primary">
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
      </div>
    </div>
  );
}