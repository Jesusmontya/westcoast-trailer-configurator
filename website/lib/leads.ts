import { supabase } from "./supabase";

type SubmitContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
};

/**
 * Guarda a alguien que llenó un formulario en el sitio como cliente.
 * Usa una función de base de datos (no un insert directo) para poder
 * revisar duplicados sin darle permiso de lectura al público.
 */
export async function submitLead(input: SubmitContactInput) {
  const { error } = await supabase.rpc("submit_client_lead", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || null,
    p_interest: input.interest || null,
  });

  if (error) throw error;
}