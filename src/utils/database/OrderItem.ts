import { SupabaseClient } from "@supabase/supabase-js";
import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, OrderItem } from "@/utils/database/types";

export class OrderItemRepo extends GenericRepo<OrderItem> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.ORDER_ITEMS);
  }
}
