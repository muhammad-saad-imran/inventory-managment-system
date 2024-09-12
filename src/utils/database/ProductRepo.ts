import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, Product } from "@/utils/database/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class ProductRepo extends GenericRepo<Product> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.PRODUCTS);
  }

  async getWithName(name: string, include?: string): Promise<Product[]> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select(include)
      .ilike("name", `%${name}%`);

    if (entity) {
      return entity as unknown as Product[];
    } else {
      throw error;
    }
  }
}
