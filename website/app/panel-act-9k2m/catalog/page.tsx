"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { uploadCatalogImage } from "../../../lib/imageUpload";

type TrailerSize = {
  id: string;
  label: string;
  sort_order: number;
  image_url: string | null;
  cost: number | null;
  price: number;
};
type Category = { id: string; name: string; sort_order: number };
type CatalogItem = {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  cost: number | null;
  price: number;
};

// ============================================
// TAMAÑOS
// ============================================
function SizesTab() {
  const [sizes, setSizes] = useState<TrailerSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("trailer_sizes").select("*").order("sort_order");
    setSizes((data as TrailerSize[]) || []);
    setLoading(false);
  }

  async function addSize() {
    if (!label || !price) return;
    setUploading(true);
    let image_url: string | null = null;
    if (pendingFile) {
      image_url = await uploadCatalogImage(pendingFile);
    }
    await supabase.from("trailer_sizes").insert({
      label,
      image_url,
      cost: cost ? parseFloat(cost) : null,
      price: parseFloat(price),
      sort_order: sizes.length,
    });
    setLabel("");
    setCost("");
    setPrice("");
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
    load();
  }

  async function deleteSize(id: string) {
    await supabase.from("trailer_sizes").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="admin-card p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-3">
          Nuevo tamaño
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            placeholder="Ej. 16 ft"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="flex-1 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <input
            type="number"
            placeholder="Costo (privado)"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-36 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <input
            type="number"
            placeholder="Precio al cliente"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-36 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
            className="text-xs font-mono text-[var(--a-text-muted)]"
          />
          <button
            onClick={addSize}
            disabled={!label || !price || uploading}
            className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {uploading ? "Subiendo..." : "Agregar"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sizes.map((s) => (
            <div key={s.id} className="admin-card overflow-hidden">
              {s.image_url ? (
                <img src={s.image_url} alt={s.label} className="w-full h-28 object-cover" />
              ) : (
                <div className="w-full h-28 bg-[var(--a-surface-2)] flex items-center justify-center text-xs font-mono text-[var(--a-text-muted)]">
                  Sin foto
                </div>
              )}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[var(--a-text)]">{s.label}</p>
                  <button
                    onClick={() => deleteSize(s.id)}
                    className="text-[var(--a-text-muted)] hover:text-[var(--a-accent)] text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="font-mono text-sm text-[var(--a-accent)] font-semibold mt-1">
                  ${s.price.toLocaleString()}
                </p>
                {s.cost != null && (
                  <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-0.5">
                    Costo ${s.cost.toLocaleString()} · Margen $
                    {(s.price - s.cost).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// CATEGORÍAS Y SUBCATEGORÍAS
// ============================================
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("catalog_categories").select("*").order("sort_order");
    setCategories((data as Category[]) || []);
    setLoading(false);
  }

  async function addCategory() {
    if (!newCategory) return;
    await supabase
      .from("catalog_categories")
      .insert({ name: newCategory, sort_order: categories.length });
    setNewCategory("");
    load();
  }

  async function deleteCategory(id: string) {
    await supabase.from("catalog_categories").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <div className="admin-card p-5 mb-6 flex gap-2">
        <input
          placeholder="Nueva categoría (ej. Cocina)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          className="flex-1 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-sm font-semibold"
        >
          Agregar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card p-4 flex items-center justify-between">
            <p className="font-semibold text-[var(--a-text)]">{cat.name}</p>
            <button onClick={() => deleteCategory(cat.id)} className="admin-btn-ghost danger">
              Borrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PIEZAS
// ============================================
function ItemsTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [cats, its] = await Promise.all([
      supabase.from("catalog_categories").select("*").order("sort_order"),
      supabase.from("catalog_items").select("*").order("created_at", { ascending: false }),
    ]);
    setCategories((cats.data as Category[]) || []);
    setItems((its.data as CatalogItem[]) || []);
    setLoading(false);
  }

  async function saveItem() {
    if (!categoryId || !name || !price) return;
    setSaving(true);
    let image_url: string | null = null;
    if (pendingFile) {
      image_url = await uploadCatalogImage(pendingFile);
    }
    await supabase.from("catalog_items").insert({
      category_id: categoryId,
      name,
      image_url,
      cost: cost ? parseFloat(cost) : null,
      price: parseFloat(price),
    });
    setName("");
    setCost("");
    setPrice("");
    setCategoryId("");
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function deleteItem(id: string) {
    await supabase.from("catalog_items").delete().eq("id", id);
    load();
  }

  function categoryLabel(catId: string) {
    return categories.find((c) => c.id === catId)?.name || "—";
  }

  const filtered = (
    filterCat === "all" ? items : items.filter((i) => i.category_id === filterCat)
  ).filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar pieza por nombre..."
        className="admin-input w-full mb-4"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
              filterCat === "all"
                ? "bg-[var(--a-accent)] text-white"
                : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
                filterCat === c.id
                  ? "bg-[var(--a-accent)] text-white"
                  : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-xs font-mono font-semibold whitespace-nowrap"
        >
          {showForm ? "Cancelar" : "+ Nueva pieza"}
        </button>
      </div>

      {showForm && (
        <div className="admin-card p-5 mb-6">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mb-2 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          >
            <option value="">Elige categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Nombre de la pieza"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block font-mono text-[10px] text-[var(--a-text-muted)] mb-1">
                Costo (privado)
              </label>
              <input
                type="number"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-[var(--a-text-muted)] mb-1">
                Precio al cliente
              </label>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
              />
            </div>
          </div>
          {cost && price && (
            <p className="font-mono text-[11px] text-[var(--a-accent)] mb-2">
              Margen: ${(parseFloat(price) - parseFloat(cost)).toLocaleString()}
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
            className="w-full mb-3 text-xs font-mono text-[var(--a-text-muted)]"
          />
          <button
            onClick={saveItem}
            disabled={saving || !categoryId || !name || !price}
            className="w-full px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar pieza"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="admin-card overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 bg-[var(--a-surface-2)] flex items-center justify-center text-xs font-mono text-[var(--a-text-muted)]">
                Sin foto
              </div>
            )}
            <div className="p-3">
              <p className="font-semibold text-sm text-[var(--a-text)]">{item.name}</p>
              <p className="font-mono text-xs text-[var(--a-text-muted)] mt-1">
                {categoryLabel(item.category_id)}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-mono text-sm text-[var(--a-accent)] font-semibold">
                  ${item.price.toLocaleString()}
                </p>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-[var(--a-text-muted)] hover:text-[var(--a-accent)] text-xs"
                >
                  ✕
                </button>
              </div>
              {item.cost != null && (
                <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-1">
                  Costo ${item.cost.toLocaleString()} · Margen $
                  {(item.price - item.cost).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CONFIGURACIÓN (tax)
// ============================================
function SettingsTab() {
  const [taxRate, setTaxRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("business_settings").select("*").eq("id", 1).single();
    setTaxRate(data ? String(data.tax_rate) : "0");
    setLoading(false);
  }

  async function save() {
    await supabase
      .from("business_settings")
      .update({ tax_rate: parseFloat(taxRate) || 0 })
      .eq("id", 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div className="admin-card p-6 max-w-sm">
      <label className="block font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-2">
        Tax (%)
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.001"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          className="flex-1 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
        />
        <button
          onClick={save}
          className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-sm font-semibold"
        >
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
      </div>
      <p className="text-xs text-[var(--a-text-muted)] mt-2">
        Se aplica automático a cada cotización nueva.
      </p>
    </div>
  );
}

// ============================================
export default function CatalogPage() {
  const [tab, setTab] = useState<"sizes" | "categories" | "items" | "settings">("sizes");

  return (
    <div>
      <Link
        href="/panel-act-9k2m"
        className="inline-block mb-4 font-mono text-xs text-[var(--a-text-muted)] hover:text-[var(--a-text)]"
      >
        ← Volver a clientes
      </Link>

      <h1 className="text-2xl font-semibold text-[var(--a-text)] mb-6">Catálogo</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(["sizes", "categories", "items", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-xs font-mono font-semibold ${
              tab === t
                ? "bg-[var(--a-accent)] text-white"
                : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {t === "sizes"
              ? "Tamaños"
              : t === "categories"
              ? "Categorías"
              : t === "items"
              ? "Piezas"
              : "Configuración"}
          </button>
        ))}
      </div>

      {tab === "sizes" && <SizesTab />}
      {tab === "categories" && <CategoriesTab />}
      {tab === "items" && <ItemsTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}