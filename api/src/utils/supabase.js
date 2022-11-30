import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_PUBLIC_API_KEY, process.env.SUPABASE_PUBLIC_API_KEY);
