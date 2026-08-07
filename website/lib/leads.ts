import { supabase } from "./supabase";

type SubmitContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
};

/**
 * Guarda a alguien que llenó el formulario de contacto de la landing.
 */
export async function submitLead(input: SubmitContactInput) {
  const { error } = await supabase.rpc("submit_client_lead", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || null,
    p_interest: input.interest || null,
    p_heard_from: "sitio_web_contacto",
  });

  if (error) throw error;
}