import { createClient } from "@supabase/supabase-js";

/**
 * Cliente sem sessão para conteúdo público e cacheável.
 * Não lê cookies, portanto pode ser usado dentro de funções com "use cache".
 */
export function criarSupabasePublico() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
