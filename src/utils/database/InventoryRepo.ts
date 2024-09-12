import { SupabaseClient } from "@supabase/supabase-js";
import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, Inventory } from "@/utils/database/types";

export class InventoryRepo extends GenericRepo<Inventory> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.INVENTORY);
  }

  async getWithProductAndSupplier(
    product_id: string,
    supplier_id: string
  ): Promise<Inventory> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select("*, suppliers!inner (*), products!inner (*)")
      .eq("products.id", product_id)
      .eq("suppliers.id", supplier_id)
      .limit(1)
      .single();

    if (entity) {
      return entity;
    } else {
      throw error;
    }
  }

  async getWithProductName(
    name: string,
    supplier_id?: string
  ): Promise<Inventory[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*, suppliers!inner (*), products!inner (*)")
      .ilike("products.name", `%${name}%`)
      

    if (supplier_id) {
      query = query.eq("supplier_id", supplier_id);
    }

    const { data: entity, error } = await query;

    if (entity) {
      return entity;
    } else {
      throw error;
    }
  }

  async getSupplierWithName(
    name: string,
    product_id?: string
  ): Promise<Inventory[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*, suppliers!inner (*), products!inner (*)")
      .ilike("suppliers.name", `%${name}%`);

    if (product_id) {
      query = query.eq("product_id", product_id);
    }

    const { data: entity, error } = await query;

    if (entity) {
      return entity;
    } else {
      throw error;
    }
  }
}
