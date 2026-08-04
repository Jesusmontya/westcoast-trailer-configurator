"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Client = {
  id: string;
  lead_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  quote_status: "pendiente" | "enviada" | "aceptada";
  payment_type: "contado" | "financiamiento" | "enganche_saldo" | null;
  production_status: "cotizacion" | "pagado_enganche" | "en_produccion" | "listo" | "entregado";
  total_amount: number | null;
  notes: string | null;
  created_at: string;
  quote_sent_at: string | null;
};

type Payment = {
  id: string;
  client_id: string;
  amount: number;
  paid_at: string;
  notes: string | null;
};

const QUOTE_STATUS_LABELS: Record<Client["quote_status"], string> = {
  pendiente: "Pendiente",
  enviada: "Enviada",
  aceptada: "Aceptada",
};

const PRODUCTION_STATUS_LABELS: Record<Client["production_status"], string> = {
  cotizacion: "Cotización",
  pagado_enganche: "Enganche pagado",
  en_produccion: "En producción",
  listo: "Listo",
  entregado: "Entregado",
};

function isQuoteStale(client: Client) {
  if (client.quote_status !== "enviada" || !client.quote_sent_at) return false;
  const daysSince = (Date.now() - new Date(client.quote_sent_at).getTime()) / 864e5;
  return daysSince > 5;
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  contado: "Contado",
  financiamiento: "Financiamiento",
  enganche_saldo: "Enganche + saldo",
};

function NewClientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name || !phone) return;
    setSaving(true);
    await supabase.from("clients").insert({
      name,
      phone,
      email: email || null,
      quote_status: "pendiente",
    });
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

function ClientDetail({
  client,
  onClose,
  onUpdated,
}: {
  client: Client;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [newAmount, setNewAmount] = useState("");
  const [quoteStatus, setQuoteStatus] = useState(client.quote_status);
  const [productionStatus, setProductionStatus] = useState(client.production_status);
  const [paymentType, setPaymentType] = useState(client.payment_type || "");
  const [totalAmount, setTotalAmount] = useState(
    client.total_amount ? String(client.total_amount) : ""
  );

  useEffect(() => {
    loadPayments();
  }, [client.id]);

  async function loadPayments() {
    setLoadingPayments(true);
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("client_id", client.id)
      .order("paid_at", { ascending: false });
    setPayments((data as Payment[]) || []);
    setLoadingPayments(false);
  }

  async function addPayment() {
    const amount = parseFloat(newAmount);
    if (!amount) return;
    await supabase.from("payments").insert({ client_id: client.id, amount });
    setNewAmount("");
    loadPayments();
  }

  async function deletePayment(paymentId: string) {
    await supabase.from("payments").delete().eq("id", paymentId);
    loadPayments();
  }

  async function saveDetails() {
    const wasSentBefore = client.quote_status === "enviada";
    const isSendingNow = quoteStatus === "enviada";

    await supabase
      .from("clients")
      .update({
        quote_status: quoteStatus,
        production_status: productionStatus,
        payment_type: paymentType || null,
        total_amount: totalAmount ? parseFloat(totalAmount) : null,
        // Si se acaba de marcar como "enviada" y no lo estaba antes, guardamos la fecha
        // para poder avisar si pasan varios días sin respuesta.
        ...(isSendingNow && !wasSentBefore
          ? { quote_sent_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", client.id);
    onUpdated();
  }

  const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = (client.total_amount || 0) - amountPaid;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto">
      <div className="stacked-card p-6 w-full max-w-lg">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#f2ece2]">
              {client.name}
            </h3>
            <p className="font-mono text-xs text-[#8f8477]">{client.phone}</p>
          </div>
          <button onClick={onClose} className="text-[#8f8477] hover:text-[#f2ece2]">
            ✕
          </button>
        </div>

        {isQuoteStale(client) && (
          <div className="mb-4 px-3 py-2 bg-[#2b241d] border border-[#e63946]/30 rounded">
            <p className="font-mono text-[11px] text-[#e63946]">
              ⚠ Cotización enviada hace más de 5 días sin respuesta
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
              Estado de cotización
            </label>
            <select
              value={quoteStatus}
              onChange={(e) => setQuoteStatus(e.target.value as Client["quote_status"])}
              className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            >
              <option value="pendiente">Pendiente</option>
              <option value="enviada">Enviada</option>
              <option value="aceptada">Aceptada</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
              Tipo de pago
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
            >
              <option value="">—</option>
              <option value="contado">Contado</option>
              <option value="financiamiento">Financiamiento</option>
              <option value="enganche_saldo">Enganche + saldo</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
            Estado de producción
          </label>
          <select
            value={productionStatus}
            onChange={(e) =>
              setProductionStatus(e.target.value as Client["production_status"])
            }
            className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          >
            <option value="cotizacion">Cotización</option>
            <option value="pagado_enganche">Enganche pagado</option>
            <option value="en_produccion">En producción</option>
            <option value="listo">Listo</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block font-mono text-[10px] uppercase tracking-wide text-[#8f8477] mb-1.5">
            Monto total
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
        </div>

        <button
          onClick={saveDetails}
          className="w-full mb-6 px-4 py-2.5 bg-[#2b241d] border border-[#f2ece2]/15 rounded text-sm font-mono text-[#f2ece2] hover:border-[#b8562f]"
        >
          Guardar cambios
        </button>

        {client.total_amount ? (
          <div className="flex items-center justify-between mb-4 p-4 bg-[#211c17] rounded">
            <div>
              <p className="font-mono text-[10px] uppercase text-[#8f8477]">Pagado</p>
              <p className="font-semibold text-[#f2ece2]">${amountPaid.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase text-[#8f8477]">Falta</p>
              <p
                className={`font-semibold ${
                  remaining <= 0 ? "text-[#4caf7d]" : "text-[#e8794a]"
                }`}
              >
                ${Math.max(remaining, 0).toLocaleString()}
              </p>
            </div>
          </div>
        ) : null}

        <p className="font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-2">
          Historial de abonos
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Monto del abono"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
          />
          <button
            onClick={addPayment}
            className="px-4 py-2 bg-[#b8562f] text-white rounded text-sm font-semibold"
          >
            Agregar
          </button>
        </div>

        {loadingPayments ? (
          <p className="text-xs text-[#8f8477]">Cargando...</p>
        ) : payments.length === 0 ? (
          <p className="text-xs text-[#8f8477]">Sin abonos registrados.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 bg-[#211c17] rounded text-sm"
              >
                <span className="text-[#f2ece2]">${p.amount.toLocaleString()}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#8f8477]">
                    {new Date(p.paid_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deletePayment(p.id)}
                    className="text-[#8f8477] hover:text-[#e63946] text-xs"
                    title="Borrar abono"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientsPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients((data as Client[]) || []);
    setLoading(false);
  }

  const filtered = clients
    .filter((c) => statusFilter === "all" || c.quote_status === statusFilter)
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q);
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
        className="w-full mb-4 px-4 py-2.5 bg-[#211c17] border border-[#f2ece2]/10 rounded text-sm text-[#f2ece2]"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pendiente", "enviada", "aceptada"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              statusFilter === s
                ? "bg-[#b8562f] text-white"
                : "bg-[#211c17] text-[#8f8477] border border-[#f2ece2]/10"
            }`}
          >
            {s === "all" ? "Todos" : QUOTE_STATUS_LABELS[s as Client["quote_status"]]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#8f8477] font-mono text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#8f8477] font-mono text-sm">No hay clientes en este filtro.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelected(client)}
              className={`stacked-card p-5 flex items-center justify-between text-left w-full ${
                isQuoteStale(client) ? "border-l-4 border-l-[#e63946]" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-[#f2ece2]">{client.name}</p>
                  <span className="tag-pill">
                    {QUOTE_STATUS_LABELS[client.quote_status]}
                  </span>
                  <span className="font-mono text-[10px] text-[#8f8477] uppercase">
                    {PRODUCTION_STATUS_LABELS[client.production_status]}
                  </span>
                  {client.payment_type && (
                    <span className="font-mono text-[10px] text-[#8f8477] uppercase">
                      {PAYMENT_TYPE_LABELS[client.payment_type]}
                    </span>
                  )}
                  {isQuoteStale(client) && (
                    <span className="font-mono text-[10px] text-[#e63946] uppercase">
                      ⚠ Sin respuesta
                    </span>
                  )}
                </div>
                <p className="font-mono text-sm text-[#c9c2b6]">{client.phone}</p>
              </div>
              {client.total_amount ? (
                <span className="font-mono text-sm text-[#f2ece2]">
                  ${client.total_amount.toLocaleString()}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {showNew && (
        <NewClientModal onClose={() => setShowNew(false)} onCreated={loadClients} />
      )}

      {selected && (
        <ClientDetail
          client={selected}
          onClose={() => setSelected(null)}
          onUpdated={loadClients}
        />
      )}
    </div>
  );
}