"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Client } from "@/utils/supabase/types";

export const postClient = async (client: Client) => {
  const supabase = createClient();
  const { error } = await supabase.from("clients").insert(client);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard/clients");
};
