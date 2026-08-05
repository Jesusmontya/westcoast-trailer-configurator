import { supabase } from "./supabase";

type SubmitContactInput = {
  name: string;
  phone: string;
  email?: string | null;
  interest?: string | null;
};

/**
 * Guarda a alguien que llenó un formulario en el sitio como cliente nuevo.
 */
export async function submitLead(input: SubmitContactInput) {
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

  return { leadId: data.id as string };
}