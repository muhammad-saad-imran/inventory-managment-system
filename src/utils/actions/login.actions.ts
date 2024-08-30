"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = Object.entries(formData.entries()) as any;

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log({ error });
    redirect(`/?error=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
