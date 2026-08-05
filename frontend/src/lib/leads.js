import { supabase } from "./supabase";

/**
 * Guarda a alguien que llenó un formulario en la galería como cliente nuevo.
 * input: { name, phone, email?, interest? }
 */
export async function submitLead(input) {
  const { data, error } = await supabase
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

  return { leadId: data.id };
}