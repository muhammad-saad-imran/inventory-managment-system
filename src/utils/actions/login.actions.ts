"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";

export async function login(data: SignInWithPasswordCredentials) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return error;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
