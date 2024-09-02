"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

const INVALID_CREDENTIALS = "Invalid login credentials";

export async function login(data: SignInWithPasswordCredentials) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error?.message === INVALID_CREDENTIALS) {
    return { error: "Wrong credentials used" };
  } else if (error) {
    return { error: "Something went wrong" };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/products");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
