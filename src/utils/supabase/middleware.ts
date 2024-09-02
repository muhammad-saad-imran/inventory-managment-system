import { NextResponse, type NextRequest } from "next/server";
import { CookieMethodsServer } from "@supabase/ssr";
import { createClient } from "@/utils/supabase/server";

export async function validateSession(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  let supabaseResponse = NextResponse.next({
    request,
  });

  const cookies: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) =>
        request.cookies.set(name, value)
      );
      supabaseResponse = NextResponse.next({
        request,
      });
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options)
      );
    },
  };

  const supabase = createClient({ cookies });

  // updates the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // redirect to login if user is not signed in
  if (user) {
    return supabaseResponse;
  } else {
    return NextResponse.redirect(new URL("/", baseUrl));
  }
}
