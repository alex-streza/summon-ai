import { createClient } from "@supabase/supabase-js";

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = (page ? from + size : size) - 1;

  return { from, to };
};

export const supabase = createClient(
  process.env.SUPABASE_API_URL ?? "",
  process.env.SUPABASE_API_KEY ?? ""
);
