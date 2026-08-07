import { supabase } from "./supabase";

/**
 * Guarda a alguien que llenó el formulario en la galería 3D.
 * input: { name, phone, email?, interest? }
 */
export async function submitLead(input) {
  const { error } = await supabase.rpc("submit_client_lead", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || null,
    p_interest: input.interest || null,
    p_heard_from: "sitio_web_galeria",
  });

  if (error) throw error;
}