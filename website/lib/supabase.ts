import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);