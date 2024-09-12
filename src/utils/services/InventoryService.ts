import { SupabaseClient } from "@supabase/supabase-js";
import { GenericService } from "@/utils/services/GenericService";
import { Inventory } from "@/utils/database/types";
import { InventoryRepo } from "@/utils/database/InventoryRepo";

export class InventoryService extends GenericService<Inventory> {
  inventory: InventoryRepo;

  constructor(_client: SupabaseClient) {
    const _inventory = new InventoryRepo(_client);
    super(_inventory);
    this.inventory = _inventory;
  }

  async getWithProductAndSupplier(
    product_id: string,
    supplier_id: string
  ): Promise<Inventory> {
    return this.inventory.getWithProductAndSupplier(product_id, supplier_id);
  }

  async getWithProductName(
    name: string,
    supplier_id?: string
  ): Promise<Inventory[]> {
    return this.inventory.getWithProductName(name, supplier_id);
  }

  async getSupplierWithName(
    name: string,
    product_id?: string
  ): Promise<Inventory[]> {
    return this.inventory.getSupplierWithName(name, product_id);
  }
}
