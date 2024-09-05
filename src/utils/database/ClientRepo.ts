import { GenericRepo } from "@/utils/database/GenericRepo";
import { Client, DB_TABLES } from "@/utils/database/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class ClientRepo extends GenericRepo<Client> {
  constructor(_client: SupabaseClient) {
    super(_client, DB_TABLES.CLIENTS);
  }

  async getWithName(name: string): Promise<Client[]> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select()
      .ilike("name", `%${name}%`);

    if (entity) {
      return entity;
    } else {
      throw error;
    }
  }
}
