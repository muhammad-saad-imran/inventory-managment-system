"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Supplier } from "@/utils/supabase/types";

export const createSupplier = async (supplier: Supplier) => {
  const supabase = createClient();
  const { error } = await supabase.from("suppliers").insert(supplier);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard/suppliers");
};
