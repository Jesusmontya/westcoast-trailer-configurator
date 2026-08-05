import { supabase } from "./supabase";

type SubmitContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
  notes?: string | null;
};

const DEDUPE_WINDOW_DAYS = 30;

/**
 * Guarda a alguien que llenó un formulario en el sitio como cliente.
 * Si ya existe uno con el mismo teléfono en los últimos 30 días, no lo
 * duplica — agrega el nuevo interés a su historial de seguimiento.
 */
export async function submitLead(input: SubmitContactInput) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DEDUPE_WINDOW_DAYS);

  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("phone", input.phone)
    .gte("created_at", cutoff.toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    const clientId = existing[0].id;

    const parts = ["Nuevo interés vía el sitio web"];
    if (input.interest) parts.push(`— ${input.interest}`);
    if (input.notes) parts.push(`: "${input.notes}"`);

    await supabase.from("client_activity").insert({
      client_id: clientId,
      note: parts.join(" "),
    });

    return { leadId: clientId, isNew: false as const };
  }

  const { data: created, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      interest: input.interest || null,
      heard_from: "sitio_web",
    })
    .select("id")
    .single();

  if (error) throw error;

  return { leadId: created.id as string, isNew: true as const };
}