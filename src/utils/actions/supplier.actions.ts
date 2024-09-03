"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { DB_TABLES, Supplier } from "@/utils/supabase/types";

const supabase = createSupabaseClient();

export const createSupplier = async (supplier: Supplier) => {
  const { error } = await supabase.from(DB_TABLES.SUPPLIERS).insert(supplier);

  if (error) {
    return { error: "Error ocurred while creating supplier" };
  }

  redirect("/dashboard/suppliers");
};

export const updateSupplier = async ({ id, ...supplier }: Supplier) => {
  const { error } = await supabase
    .from(DB_TABLES.SUPPLIERS)
    .update(supplier)
    .eq("id", id);

  if (error) {
    return { error: "Error ocurred while updating supplier" };
  }
  return {};
};

export const deleteSupplier = async (id: string) => {
  const { error } = await supabase
    .from(DB_TABLES.SUPPLIERS)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Error ocurred while deleting supplier" };
  }

  redirect("/dashboard/suppliers");
};
