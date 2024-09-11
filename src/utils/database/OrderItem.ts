import { SupabaseClient } from "@supabase/supabase-js";
import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, OrderItem } from "@/utils/database/types";

export class OrderItemRepo extends GenericRepo<OrderItem> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.ORDER_ITEMS);
  }

  override async getAll(
    order_id?: string,
    include?: string
  ): Promise<OrderItem[]> {
    let query = this.supabase.from(this.tableName).select(include);

    if (order_id) {
      query.eq("order_id", order_id);
    }

    const { data, error } = await query;

    if (data) {
      return data as unknown as OrderItem[];
    } else {
      throw error;
    }
  }
}
