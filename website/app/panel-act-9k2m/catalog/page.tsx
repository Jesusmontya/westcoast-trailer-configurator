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
  active: boolean;
};

// ============================================
// TAMAÑOS
// ============================================
function SizesTab() {
  const [sizes, setSizes] = useState<TrailerSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("trailer_sizes").select("*").order("sort_order");
    setSizes((data as TrailerSize[]) || []);
    setLoading(false);
  }

  function resetForm() {
    setLabel("");
    setCost("");
    setPrice("");
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setEditingId(null);
  }

  function startEdit(s: TrailerSize) {
    setEditingId(s.id);
    setLabel(s.label);
    setCost(s.cost != null ? String(s.cost) : "");
    setPrice(String(s.price));
  }

  async function saveSize() {
    if (!label || !price) return;
    setUploading(true);
    let image_url: string | undefined;
    if (pendingFile) {
      image_url = await uploadCatalogImage(pendingFile);
    }

    if (editingId) {
      const updates: Record<string, unknown> = {
        label,
        cost: cost ? parseFloat(cost) : null,
        price: parseFloat(price),
      };
      if (image_url) updates.image_url = image_url;
      await supabase.from("trailer_sizes").update(updates).eq("id", editingId);
    } else {
      await supabase.from("trailer_sizes").insert({
        label,
        image_url: image_url || null,
        cost: cost ? parseFloat(cost) : null,
        price: parseFloat(price),
        sort_order: sizes.length,
      });
    }

    resetForm();
    setUploading(false);
    load();
  }

  async function deleteSize(id: string) {
    setDeleteError(null);
    const { error } = await supabase.from("trailer_sizes").delete().eq("id", id);
    if (error) {
      setDeleteError(
        error.code === "23503"
          ? "No se puede borrar: ya se usó en alguna cotización."
          : "No se pudo borrar."
      );
      return;
    }
    load();
  }

  return (
    <div>
      <p className="text-sm text-[var(--a-text-muted)] mb-4">
        Cada tamaño aparece como opción al armar una cotización — su foto es la
        que sale como portada del PDF.
      </p>

      <div className="admin-card p-5 mb-6">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--a-text-muted)] mb-3">
          {editingId ? "Editando tamaño" : "Nuevo tamaño"}
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
            onClick={saveSize}
            disabled={!label || !price || uploading}
            className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {uploading ? "Subiendo..." : editingId ? "Guardar cambios" : "Agregar"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="admin-btn-secondary">
              Cancelar
            </button>
          )}
        </div>
        {editingId && (
          <p className="text-xs text-[var(--a-text-muted)] mt-2">
            Deja el archivo vacío para conservar la foto actual.
          </p>
        )}
      </div>

      {deleteError && (
        <p className="text-sm text-[var(--a-danger)] mb-4">{deleteError}</p>
      )}

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
                <p className="font-semibold text-sm text-[var(--a-text)]">{s.label}</p>
                <p className="font-mono text-sm text-[var(--a-accent)] font-semibold mt-1">
                  ${s.price.toLocaleString()}
                </p>
                {s.cost != null && (
                  <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-0.5">
                    Costo ${s.cost.toLocaleString()} · Margen $
                    {(s.price - s.cost).toLocaleString()}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => startEdit(s)} className="admin-btn-ghost flex-1">
                    Editar
                  </button>
                  <button onClick={() => deleteSize(s.id)} className="admin-btn-ghost danger">
                    ✕
                  </button>
                </div>
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
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

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

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    await supabase.from("catalog_categories").update({ name: editName }).eq("id", id);
    setEditingId(null);
    load();
  }

  async function deleteCategory(id: string) {
    setDeleteError(null);
    const { error } = await supabase.from("catalog_categories").delete().eq("id", id);
    if (error) {
      setDeleteError(
        error.code === "23503"
          ? "No se puede borrar: todavía tiene piezas asignadas. Muévelas o bórralas primero."
          : "No se pudo borrar."
      );
      return;
    }
    load();
  }

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <p className="text-sm text-[var(--a-text-muted)] mb-4">
        Agrupan tus piezas para navegarlas más rápido al armar una cotización.
      </p>
      {deleteError && <p className="text-sm text-[var(--a-danger)] mb-4">{deleteError}</p>}
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
        {categories.map((cat) =>
          editingId === cat.id ? (
            <div key={cat.id} className="admin-card p-4 flex items-center gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)}
                autoFocus
                className="flex-1 px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)]"
              />
              <button onClick={() => saveEdit(cat.id)} className="admin-btn-ghost">
                Guardar
              </button>
              <button onClick={() => setEditingId(null)} className="admin-btn-ghost">
                Cancelar
              </button>
            </div>
          ) : (
            <div key={cat.id} className="admin-card p-4 flex items-center justify-between">
              <p className="font-semibold text-[var(--a-text)]">{cat.name}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(cat)} className="admin-btn-ghost">
                  Editar
                </button>
                <button onClick={() => deleteCategory(cat.id)} className="admin-btn-ghost danger">
                  Borrar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ============================================
// PIEZAS
// ============================================
// ============================================
// IMPORTAR PIEZAS EN LOTE (CSV pegado)
// ============================================
function BulkImportModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [csvText, setCsvText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    added: number;
    newCategories: number;
    errors: string[];
  } | null>(null);

  function downloadTemplate() {
    const template =
      "categoria,nombre,costo,precio\nCocina,Freidora doble industrial,450,850\nCocina,Plancha grande,300,600\nVentanas,Ventana de servicio,200,450\n";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-catalogo.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function processImport() {
    setProcessing(true);
    const errors: string[] = [];
    let added = 0;
    let newCategories = 0;

    const { data: existingCats } = await supabase.from("catalog_categories").select("*");
    const categoryMap = new Map<string, string>(
      (existingCats || []).map((c: Category) => [c.name.trim().toLowerCase(), c.id])
    );

    const lines = csvText
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    // si la primera línea parece encabezado (dice "categoria" o "nombre"), la saltamos
    const startIndex =
      lines[0]?.toLowerCase().includes("categoria") || lines[0]?.toLowerCase().includes("nombre")
        ? 1
        : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      const [categoryName, itemName, costStr, priceStr] = parts;

      if (!categoryName || !itemName || !priceStr) {
        errors.push(`Línea ${i + 1}: faltan datos, se saltó.`);
        continue;
      }

      const catKey = categoryName.toLowerCase();
      let categoryId = categoryMap.get(catKey);

      if (!categoryId) {
        const { data: newCat, error: catError } = await supabase
          .from("catalog_categories")
          .insert({ name: categoryName })
          .select("id")
          .single();
        if (catError || !newCat) {
          errors.push(`Línea ${i + 1}: no se pudo crear la categoría "${categoryName}".`);
          continue;
        }
        categoryId = newCat.id as string;
        categoryMap.set(catKey, newCat.id as string);
        newCategories++;
      }

      const price = parseFloat(priceStr);
      const cost = costStr ? parseFloat(costStr) : null;

      if (isNaN(price)) {
        errors.push(`Línea ${i + 1}: precio inválido, se saltó.`);
        continue;
      }

      const { error: itemError } = await supabase.from("catalog_items").insert({
        category_id: categoryId,
        name: itemName,
        cost,
        price,
        active: true,
      });

      if (itemError) {
        errors.push(`Línea ${i + 1}: no se pudo guardar "${itemName}".`);
        continue;
      }

      added++;
    }

    setResult({ added, newCategories, errors });
    setProcessing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto">
      <div className="admin-card bg-[var(--a-surface)] w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--a-text)] mb-2">
          Importar piezas en lote
        </h3>

        {!result ? (
          <>
            <p className="text-sm text-[var(--a-text-muted)] mb-4">
              Pega una lista con formato: <strong>categoría, nombre, costo, precio</strong> — una
              pieza por línea. El costo puede quedar vacío. Las categorías que no existan se
              crean solas.
            </p>

            <button
              onClick={downloadTemplate}
              className="admin-btn-ghost mb-3"
              type="button"
            >
              Descargar plantilla de ejemplo (.csv)
            </button>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={
                "Cocina,Freidora doble industrial,450,850\nCocina,Plancha grande,300,600\nVentanas,Ventana de servicio,200,450"
              }
              className="w-full min-h-[220px] px-3 py-2 bg-[var(--a-surface-2)] border border-[var(--a-border)] rounded text-sm text-[var(--a-text)] font-mono mb-4"
            />

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 admin-btn-secondary">
                Cancelar
              </button>
              <button
                onClick={processImport}
                disabled={!csvText.trim() || processing}
                className="flex-1 admin-btn-primary"
              >
                {processing ? "Importando..." : "Importar"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-[var(--a-text)] mb-1">
                ✓ {result.added} piezas agregadas
              </p>
              {result.newCategories > 0 && (
                <p className="text-sm text-[var(--a-text)] mb-1">
                  ✓ {result.newCategories} categorías nuevas creadas
                </p>
              )}
              {result.errors.length > 0 && (
                <div className="mt-3 p-3 bg-[var(--a-danger-bg)] rounded">
                  <p className="text-sm text-[var(--a-danger)] font-semibold mb-1">
                    {result.errors.length} línea(s) con problemas:
                  </p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-[var(--a-danger)]">
                      {e}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                onDone();
                onClose();
              }}
              className="w-full admin-btn-primary"
            >
              Listo
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ItemsTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

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

  function resetForm() {
    setName("");
    setCost("");
    setPrice("");
    setCategoryId("");
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(item: CatalogItem) {
    setEditingId(item.id);
    setCategoryId(item.category_id);
    setName(item.name);
    setCost(item.cost != null ? String(item.cost) : "");
    setPrice(String(item.price));
    setShowForm(true);
  }

  async function saveItem() {
    if (!categoryId || !name || !price) return;
    setSaving(true);
    let image_url: string | undefined;
    if (pendingFile) {
      image_url = await uploadCatalogImage(pendingFile);
    }

    if (editingId) {
      const updates: Record<string, unknown> = {
        category_id: categoryId,
        name,
        cost: cost ? parseFloat(cost) : null,
        price: parseFloat(price),
      };
      if (image_url) updates.image_url = image_url;
      await supabase.from("catalog_items").update(updates).eq("id", editingId);
    } else {
      await supabase.from("catalog_items").insert({
        category_id: categoryId,
        name,
        image_url: image_url || null,
        cost: cost ? parseFloat(cost) : null,
        price: parseFloat(price),
      });
    }

    resetForm();
    setSaving(false);
    load();
  }

  async function toggleActive(item: CatalogItem) {
    await supabase.from("catalog_items").update({ active: !item.active }).eq("id", item.id);
    load();
  }

  async function deleteItem(id: string) {
    setDeleteError(null);

    // revisa si esta pieza está usada en algún preset antes de borrar
    const { data: refs } = await supabase
      .from("catalog_preset_items")
      .select("catalog_presets(name)")
      .eq("catalog_item_id", id);

    if (refs && refs.length > 0) {
      const names = refs
        .map((r: any) => r.catalog_presets?.name)
        .filter(Boolean)
        .join(", ");
      setDeleteError(
        `Esta pieza está usada en el preset: ${names}. Bórrala del preset primero, o mejor usa "Archivar" para quitarla del catálogo sin romper el preset.`
      );
      return;
    }

    const { error } = await supabase.from("catalog_items").delete().eq("id", id);
    if (error) {
      setDeleteError(
        "No se pudo borrar. Si ya no la quieres ofrecer, prueba \"Archivar\" en vez de borrar — desaparece del catálogo sin perder el registro."
      );
      return;
    }
    load();
  }

  function categoryLabel(catId: string) {
    return categories.find((c) => c.id === catId)?.name || "—";
  }

  const filtered = (
    filterCat === "all" ? items : items.filter((i) => i.category_id === filterCat)
  )
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => (showArchived ? true : i.active));

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <p className="text-sm text-[var(--a-text-muted)] mb-4">
        Cada pieza que agregues aparece disponible al armar una cotización, con foto y precio.
      </p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar pieza por nombre..."
        className="admin-input w-full mb-4"
      />

      {deleteError && (
        <p className="text-sm text-[var(--a-danger)] mb-4">{deleteError}</p>
      )}

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
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
              showArchived
                ? "bg-[var(--a-text)] text-[var(--a-surface)]"
                : "bg-[var(--a-surface-2)] text-[var(--a-text-muted)] border border-[var(--a-border)]"
            }`}
          >
            {showArchived ? "Viendo archivadas" : "Ver archivadas"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="admin-btn-secondary whitespace-nowrap"
          >
            Importar CSV
          </button>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-xs font-mono font-semibold whitespace-nowrap"
          >
            {showForm ? "Cancelar" : "+ Nueva pieza"}
          </button>
        </div>
      </div>

      {showImport && (
        <BulkImportModal onClose={() => setShowImport(false)} onDone={load} />
      )}

      {showForm && (
        <div className="admin-card p-5 mb-6">
          {editingId && (
            <p className="admin-label mb-2">Editando pieza existente</p>
          )}
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
          {editingId && (
            <p className="text-xs text-[var(--a-text-muted)] mb-3">
              Deja el archivo vacío para conservar la foto actual.
            </p>
          )}
          <button
            onClick={saveItem}
            disabled={saving || !categoryId || !name || !price}
            className="w-full px-4 py-2.5 bg-[var(--a-accent)] text-white rounded text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar pieza"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`admin-card overflow-hidden ${!item.active ? "opacity-50" : ""}`}
          >
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 bg-[var(--a-surface-2)] flex items-center justify-center text-xs font-mono text-[var(--a-text-muted)]">
                Sin foto
              </div>
            )}
            <div className="p-3">
              <p className="font-semibold text-sm text-[var(--a-text)]">
                {item.name}
                {!item.active && (
                  <span className="admin-badge ml-2" style={{ fontSize: "9px" }}>
                    Archivada
                  </span>
                )}
              </p>
              <p className="font-mono text-xs text-[var(--a-text-muted)] mt-1">
                {categoryLabel(item.category_id)}
              </p>
              <p className="font-mono text-sm text-[var(--a-accent)] font-semibold mt-2">
                ${item.price.toLocaleString()}
              </p>
              {item.cost != null && (
                <p className="font-mono text-[10px] text-[var(--a-text-muted)] mt-1">
                  Costo ${item.cost.toLocaleString()} · Margen $
                  {(item.price - item.cost).toLocaleString()}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => startEdit(item)} className="admin-btn-ghost flex-1">
                  Editar
                </button>
                <button onClick={() => toggleActive(item)} className="admin-btn-ghost flex-1">
                  {item.active ? "Archivar" : "Reactivar"}
                </button>
                <button onClick={() => deleteItem(item.id)} className="admin-btn-ghost danger">
                  ✕
                </button>
              </div>
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
// PRESETS (paquetes de piezas)
// ============================================
type Preset = { id: string; name: string; created_at: string };
type PresetItem = { id: string; preset_id: string; catalog_item_id: string };

function PresetsTab() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetItems, setPresetItems] = useState<PresetItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [p, pi, ci, c] = await Promise.all([
      supabase.from("catalog_presets").select("*").order("created_at", { ascending: false }),
      supabase.from("catalog_preset_items").select("*"),
      supabase.from("catalog_items").select("*"),
      supabase.from("catalog_categories").select("*").order("sort_order"),
    ]);
    setPresets((p.data as Preset[]) || []);
    setPresetItems((pi.data as PresetItem[]) || []);
    setCatalogItems((ci.data as CatalogItem[]) || []);
    setCategories((c.data as Category[]) || []);
    setLoading(false);
  }

  function toggleItem(id: string) {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function resetForm() {
    setPresetName("");
    setSelectedItemIds([]);
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(preset: Preset) {
    setEditingId(preset.id);
    setPresetName(preset.name);
    setSelectedItemIds(
      presetItems.filter((pi) => pi.preset_id === preset.id).map((pi) => pi.catalog_item_id)
    );
    setShowForm(true);
  }

  async function savePreset() {
    if (!presetName || selectedItemIds.length === 0) return;
    setSaving(true);

    if (editingId) {
      await supabase.from("catalog_presets").update({ name: presetName }).eq("id", editingId);
      // más simple y seguro: borra las relaciones viejas y mete las nuevas
      await supabase.from("catalog_preset_items").delete().eq("preset_id", editingId);
      await supabase.from("catalog_preset_items").insert(
        selectedItemIds.map((catalog_item_id) => ({ preset_id: editingId, catalog_item_id }))
      );
    } else {
      const { data: preset } = await supabase
        .from("catalog_presets")
        .insert({ name: presetName })
        .select("id")
        .single();

      if (preset) {
        await supabase.from("catalog_preset_items").insert(
          selectedItemIds.map((catalog_item_id) => ({ preset_id: preset.id, catalog_item_id }))
        );
      }
    }

    resetForm();
    setSaving(false);
    load();
  }

  async function deletePreset(id: string) {
    await supabase.from("catalog_presets").delete().eq("id", id);
    load();
  }

  function itemsForPreset(presetId: string) {
    const ids = presetItems.filter((pi) => pi.preset_id === presetId).map((pi) => pi.catalog_item_id);
    return catalogItems.filter((ci) => ids.includes(ci.id));
  }

  if (loading) return <p className="text-xs text-[var(--a-text-muted)]">Cargando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="admin-label">
          Agrupa piezas que sueles cotizar juntas, para agregarlas de un clic
        </p>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="px-4 py-2 bg-[var(--a-accent)] text-white rounded text-xs font-mono font-semibold whitespace-nowrap"
        >
          {showForm ? "Cancelar" : "+ Nuevo preset"}
        </button>
      </div>

      {showForm && (
        <div className="admin-card p-5 mb-6">
          {editingId && <p className="admin-label mb-2">Editando preset existente</p>}
          <label className="admin-label block mb-1">Nombre del preset</label>
          <input
            placeholder="Ej. Taco Trailer Básico"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="admin-input w-full mb-4"
          />

          <label className="admin-label block mb-2">Elige las piezas que incluye</label>
          <div className="flex flex-col gap-4 mb-4 max-h-80 overflow-y-auto">
            {categories.map((cat) => {
              const itemsInCat = catalogItems.filter((ci) => ci.category_id === cat.id);
              if (itemsInCat.length === 0) return null;
              return (
                <div key={cat.id}>
                  <p className="font-mono text-[10px] uppercase text-[var(--a-text-muted)] mb-1.5">
                    {cat.name}
                  </p>
                  <div className="flex flex-col gap-1">
                    {itemsInCat.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 text-sm text-[var(--a-text)] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                        />
                        {item.name}
                        <span className="font-mono text-xs text-[var(--a-text-muted)]">
                          ${item.price.toLocaleString()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={savePreset}
            disabled={saving || !presetName || selectedItemIds.length === 0}
            className="w-full admin-btn-primary"
          >
            {saving
              ? "Guardando..."
              : editingId
              ? `Guardar cambios (${selectedItemIds.length} piezas)`
              : `Guardar preset (${selectedItemIds.length} piezas)`}
          </button>
        </div>
      )}

      {presets.length === 0 ? (
        <p className="text-xs text-[var(--a-text-muted)]">Sin presets todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {presets.map((preset) => {
            const items = itemsForPreset(preset.id);
            const total = items.reduce((sum, i) => sum + i.price, 0);
            return (
              <div key={preset.id} className="admin-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[var(--a-text)]">{preset.name}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(preset)} className="admin-btn-ghost">
                      Editar
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="admin-btn-ghost danger"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {items.map((i) => (
                    <span key={i.id} className="admin-badge">
                      {i.name}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-xs text-[var(--a-text-muted)]">
                  Total: ${total.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
export default function CatalogPage() {
  const [tab, setTab] = useState<"sizes" | "categories" | "items" | "presets" | "settings">(
    "sizes"
  );

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
        {(["sizes", "categories", "items", "presets", "settings"] as const).map((t) => (
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
              : t === "presets"
              ? "Presets"
              : "Configuración"}
          </button>
        ))}
      </div>

      {tab === "sizes" && <SizesTab />}
      {tab === "categories" && <CategoriesTab />}
      {tab === "items" && <ItemsTab />}
      {tab === "presets" && <PresetsTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}