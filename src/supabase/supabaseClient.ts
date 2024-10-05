import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants";

export const supabase = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!
);
