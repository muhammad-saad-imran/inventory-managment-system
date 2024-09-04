"use server";

import { redirect } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/server";
import { DB_TABLES, Order, OrderItem } from "@/utils/supabase/types";

const supabase = createSupabaseClient();

export const createOrder = async (order: Order) => {
  const { data, error } = await supabase
    .from(DB_TABLES.ORDERS)
    .insert(order)
    .select()
    .limit(1)
    .single();

  if (error) {
    return { error: "Error ocurred while creating order" };
  }

  redirect(`/dashboard/orders/${data?.id}`);
};

export const updateOrder = async ({ id, ...order }: Order) => {
  const { error } = await supabase
    .from(DB_TABLES.ORDERS)
    .update(order)
    .eq("id", id);

  if (error) {
    return { success: false, error: "Error ocurred while creating order" };
  }

  return { success: true };
};

export const addProduct = async (orderItem: OrderItem) => {
  const { data: product, error: productError } = await supabase
    .from(DB_TABLES.PRODUCTS)
    .select()
    .eq("id", orderItem.product_id)
    .limit(1)
    .single();

  if (productError) {
    return { success: false, error: "Error ocurred while adding product" };
  }

  const { error: updateError } = await supabase
    .from(DB_TABLES.PRODUCTS)
    .update({ stock_quantity: product.stock_quantity - orderItem.quantity })
    .eq("id", orderItem.product_id);

  if (updateError) {
    return { success: false, error: "Error ocurred while adding product" };
  }

  const { error } = await supabase
    .from(DB_TABLES.ORDER_ITEMS)
    .insert(orderItem);

  if (error) {
    return { success: false, error: "Error ocurred while adding product" };
  }

  return { success: true };
};

export const deleteOrderItem = async (
  id: string,
  product_id: string,
  quantity: number
) => {
  try {
    const { data: product, error: productError } = await supabase
      .from(DB_TABLES.PRODUCTS)
      .select()
      .eq("id", product_id)
      .limit(1)
      .single();

    if (productError) throw productError;

    const { error } = await supabase
      .from(DB_TABLES.ORDER_ITEMS)
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Error occured while deleting product from order",
    };
  }
};

export const addOrderItemQuantity = async (id: string) => {};

export const subtractOrderItemQuantity = async (id: string) => {};
