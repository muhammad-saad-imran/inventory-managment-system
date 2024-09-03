"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { Client, DB_TABLES } from "@/utils/supabase/types";

const supabase = createSupabaseClient();

export const createClient = async (client: Client) => {
  const { error } = await supabase.from(DB_TABLES.CLIENTS).insert(client);
  
  if (error) {
    return { error: "Error ocurred while creating client" };
  }

  redirect("/dashboard/clients");
};

export const updateClient = async ({ id, ...client }: Client) => {
  const { error } = await supabase
    .from(DB_TABLES.CLIENTS)
    .update(client)
    .eq("id", id);

  if (error) {
    return { error: "Error ocurred while updating client" };
  }
  return {};
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from(DB_TABLES.CLIENTS)
    .delete()
    .eq("id", id);
  console.log({ error, yes: "yes" });
  if (error) {
    return { error: "Error ocurred while deleting client" };
  }

  redirect("/dashboard/clients");
};
