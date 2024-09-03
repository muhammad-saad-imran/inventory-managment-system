"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { DB_TABLES, Product } from "@/utils/supabase/types";

const supabase = createSupabaseClient();

export const createProduct = async (product: Product) => {
  const { error } = await supabase.from(DB_TABLES.PRODUCTS).insert(product);

  if (error) {
    return { error: "Error ocurred while creating product" };
  }

  redirect("/dashboard/products");
};

export const updateProduct = async ({ id, ...product }: Product) => {
  const { error } = await supabase
    .from(DB_TABLES.PRODUCTS)
    .update(product)
    .eq("id", id);

  if (error) {
    return { error: "Error ocurred while updating product" };
  }

  redirect("/dashboard/products");
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from(DB_TABLES.PRODUCTS)
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Error ocurred while deleting product" };
  }

  redirect("/dashboard/products");
};
