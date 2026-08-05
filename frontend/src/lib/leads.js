import { supabase } from "./supabase";

/**
 * Guarda a alguien que llenó un formulario en la galería como cliente nuevo.
 * No pide la fila de vuelta (evita necesitar permiso de lectura pública).
 * input: { name, phone, email?, interest? }
 */
export async function submitLead(input) {
  const { error } = await supabase.from("clients").insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    interest: input.interest || null,
    heard_from: "sitio_web",
  });

  if (error) throw error;
}