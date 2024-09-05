import { DB_TABLES } from "@/utils/database/types";
import { SupabaseClient } from "@supabase/supabase-js";

export abstract class GenericRepo<T> {
  supabase: SupabaseClient;
  tableName: DB_TABLES;

  constructor(_client: SupabaseClient, _tableName: DB_TABLES) {
    this.supabase = _client;
    this.tableName = _tableName;
  }

  async getAll(include?: string): Promise<T[]> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select(include);

    if (entity) {
      return entity as T[];
    } else {
      throw error;
    }
  }

  async get(id: string, include?: string): Promise<T> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .select(include)
      .eq("id", id)
      // .limit(1)
      .single();

    if (entity) {
      return entity as T;
    } else {
      throw error;
    }
  }

  async create(insertValue: T, include?: string): Promise<T> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .insert(insertValue)
      .select(include)
      // .limit(1)
      .single();

    if (entity) {
      return entity as T;
    } else {
      throw error;
    }
  }

  async update(id: string, updateValue: T, include?: string): Promise<T> {
    const { data: entity, error } = await this.supabase
      .from(this.tableName)
      .update(updateValue)
      .eq("id", id)
      .select(include)
      // .limit(1)
      .single();

    if (entity) {
      return entity as T;
    } else {
      throw error;
    }
  }

  async delete(id: string, include?: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}
