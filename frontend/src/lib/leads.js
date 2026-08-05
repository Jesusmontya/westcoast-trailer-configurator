import { supabase } from "./supabase";

const DEDUPE_WINDOW_DAYS = 30;

const SOURCE_LABELS = {
  configurator: "configurador",
  contact_form: "formulario de contacto",
  gallery: "galería",
  custom_request: "solicitud personalizada",
};

/**
 * Crea un deal nuevo (stage: "nuevo"), o si ya existe uno con el mismo
 * teléfono en los últimos 30 días, agrega el nuevo interés como actividad
 * en vez de duplicarlo.
 *
 * input: { name, phone, email?, source, trailer_type?, language, notes? }
 */
export async function submitLead(input) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DEDUPE_WINDOW_DAYS);

  const { data: existing } = await supabase
    .from("deals")
    .select("id")
    .eq("phone", input.phone)
    .gte("created_at", cutoff.toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    const dealId = existing[0].id;

    const parts = [`Nuevo interés vía ${SOURCE_LABELS[input.source] || input.source}`];
    if (input.trailer_type) parts.push(`— ${input.trailer_type}`);
    if (input.notes) parts.push(`: "${input.notes}"`);

    await supabase.from("deal_activity").insert({
      deal_id: dealId,
      note: parts.join(" "),
    });

    return { leadId: dealId, isNew: false };
  }

  const { data: created, error } = await supabase
    .from("deals")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      source: input.source,
      trailer_type: input.trailer_type || null,
      language: input.language || "en",
      notes: input.notes || null,
      stage: "nuevo",
    })
    .select("id")
    .single();

  if (error) throw error;

  return { leadId: created.id, isNew: true };
}