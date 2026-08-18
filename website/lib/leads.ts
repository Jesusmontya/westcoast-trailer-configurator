import { supabase } from "./supabase";

type SubmitContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
};

/**
 * Lee utm_source y utm_campaign de la URL actual (ej. viniendo de un
 * anuncio de Facebook: allcustomtrailers.com?utm_source=facebook&utm_campaign=verano)
 */
function getUtmParams() {
  if (typeof window === "undefined") return { utm_source: null, utm_campaign: null };
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_campaign: params.get("utm_campaign"),
  };
}

function getCustomTrailerIdea() {
  if (typeof window === "undefined") return "";
  return (window as typeof window & { __allCustomTrailerIdea?: string }).__allCustomTrailerIdea?.trim() || "";
}

/**
 * Guarda a alguien que llenó el formulario de contacto de la landing.
 */
export async function submitLead(input: SubmitContactInput) {
  const { utm_source, utm_campaign } = getUtmParams();
  const customIdea = input.interest === "Custom / Other" ? getCustomTrailerIdea() : "";
  const interest = customIdea ? `${input.interest} — ${customIdea}` : input.interest || null;

  const { error } = await supabase.rpc("submit_client_lead", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || null,
    p_interest: interest,
    p_heard_from: "sitio_web_contacto",
    p_utm_source: utm_source,
    p_utm_campaign: utm_campaign,
  });

  if (error) throw error;
}