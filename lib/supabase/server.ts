import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function criarSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesParaSalvar) {
          try {
            cookiesParaSalvar.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components não podem alterar cookies.
            // A renovação será feita pelo proxy.
          }
        },
      },
    }
  );
}