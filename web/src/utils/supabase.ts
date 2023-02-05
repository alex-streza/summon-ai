import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = (page ? from + size : size) - 1;

  return { from, to };
};

export const getSupabaseClient = (supabaseAccessToken?: string) =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    supabaseAccessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${supabaseAccessToken}`,
            },
          },
        }
      : {}
  );

export const getServiceSupabaseClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );
