import { supabase } from "./supabase";

/**
 * Lee utm_source y utm_campaign de la URL actual, por si llegaron
 * reenviados desde la landing (ej. alguien que entró por un anuncio
 * y luego pasó a la galería 3D).
 */
function getUtmParams() {
  if (typeof window === "undefined") return { utm_source: null, utm_campaign: null };
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_campaign: params.get("utm_campaign"),
  };
}

/**
 * Guarda a alguien que llenó el formulario en la galería 3D.
 * input: { name, phone, email?, interest? }
 */
export async function submitLead(input) {
  const { utm_source, utm_campaign } = getUtmParams();

  const { error } = await supabase.rpc("submit_client_lead", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || null,
    p_interest: input.interest || null,
    p_heard_from: "sitio_web_galeria",
    p_utm_source: utm_source,
    p_utm_campaign: utm_campaign,
  });

  if (error) throw error;
}