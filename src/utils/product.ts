import { SupabaseClient } from "@supabase/supabase-js";
import { DB_TABLES } from "@/utils/supabase/types";

export const getProduct = async (id: string, supabase: SupabaseClient) => {
  try {
    const { data: product, error } = await supabase
      .from(DB_TABLES.PRODUCTS)
      .select()
      .eq("id", id)
      .limit(1)
      .single();

    if (error) throw error;

    return product;
  } catch (error) {
    throw error;
  }
};

export const updateProductStock = async (
  id: string,
  stock_quantity: number,
  supabase: SupabaseClient
) => {
  try {
    const { error } = await supabase
      .from(DB_TABLES.PRODUCTS)
      .update({ stock_quantity })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
