import { CookieMethodsServer, createServerClient } from "@supabase/ssr";
import { SupabaseClientOptions } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type ServerClientOptions = SupabaseClientOptions<"public"> & {
  cookieOptions?: any;
  cookies: CookieMethodsServer;
  cookieEncoding?: "raw" | "base64url";
};

export function createClient(clientOptions?: ServerClientOptions) {
  const cookieStore = cookies();

  // Use default options if, no options passed 
  const options = clientOptions ?? {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  };

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );
}
