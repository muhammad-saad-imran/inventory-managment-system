"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Product } from "@/utils/supabase/types";

export const createProduct = async (product: Product) => {
  const supabase = createClient();
  const { error } = await supabase.from("products").insert(product);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard/products");
};
