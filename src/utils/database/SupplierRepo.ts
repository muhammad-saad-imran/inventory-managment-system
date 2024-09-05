import { GenericRepo } from "@/utils/database/GenericRepo";
import { DB_TABLES, Supplier } from "@/utils/database/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupplierRepo extends GenericRepo<Supplier> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.SUPPLIERS);
  }

  async getWithName(name: string, include?: string): Promise<Supplier[]> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select(include)
      .ilike("name", `%${name}%`);

    if (entity) {
      return entity as unknown as Supplier[];
    } else {
      throw error;
    }
  }
}
