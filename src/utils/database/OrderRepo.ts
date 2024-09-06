import { SupabaseClient } from "@supabase/supabase-js";
import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, Order } from "@/utils/database/types";

export class OrderRepo extends GenericRepo<Order> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.ORDERS);
  }

  async getWithClientName(clientName: string) {
    const { data: allOrders, error } = await this.supabase
      .from(this.tableName)
      .select("*, clients!inner (*), order_items (*)")
      .ilike("clients.name", `%${clientName}%`)
      .order("order_date", { ascending: false });

    if (error) throw error;

    return allOrders;
  }
}
