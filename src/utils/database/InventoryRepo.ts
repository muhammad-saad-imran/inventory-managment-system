import { SupabaseClient } from "@supabase/supabase-js";
import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, Inventory } from "@/utils/database/types";

export class InventoryRepo extends GenericRepo<Inventory> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.INVENTORY);
  }

  async getWithProductName(name: string): Promise<Inventory[]> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select("*, suppliers!inner (*), products!inner (*)")
      .ilike("products.name", `%${name}%`);

    if (entity) {
      return entity;
    } else {
      throw error;
    }
  }
}
