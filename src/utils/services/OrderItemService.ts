import { SupabaseClient } from "@supabase/supabase-js";
import { GenericService } from "@/utils/services/GenericService";
import { OrderItem } from "@/utils/database/types";
import { OrderItemRepo } from "@/utils/database/OrderItemRepo";
import { InventoryRepo } from "@/utils/database/InventoryRepo";

export class OrderItemService extends GenericService<OrderItem> {
  orderItem: OrderItemRepo;
  inventory: InventoryRepo;

  constructor(_client: SupabaseClient) {
    super(new OrderItemRepo(_client));
    this.orderItem = new OrderItemRepo(_client);
    this.inventory = new InventoryRepo(_client);
  }

  override async getAll(
    orderId?: string,
    include?: string
  ): Promise<OrderItem[]> {
    try {
      const orderItems = await this.orderItem.getAll(orderId, include);
      return orderItems;
    } catch (error) {
      throw error;
    }
  }

  override async create(
    newItem: OrderItem,
    include?: string
  ): Promise<OrderItem> {
    try {
      const inventoryItem = await this.inventory.get(newItem.inventory_id);

      if (inventoryItem.stock_quantity >= newItem.quantity) {
        await this.inventory.update(newItem.inventory_id, {
          stock_quantity: inventoryItem.stock_quantity - newItem.quantity,
        });
        return super.create(newItem, include);
      } else {
        throw new Error("Item quantity can't be more than the stock");
      }
    } catch (error) {
      throw error;
    }
  }

  async updateQuantity(
    id: string,
    newQuantity: number,
    include?: string
  ): Promise<OrderItem> {
    try {
      if (newQuantity <= 0) new Error("Quantity should be more than 0");

      const { inventory: inventoryData, ...orderItemData } = await this.get(
        id,
        "*, inventory (*)"
      );

      const { id: inventory_id, stock_quantity } = inventoryData!;
      const { quantity } = orderItemData;

      if (stock_quantity && stock_quantity + quantity >= newQuantity) {
        await this.inventory.update(inventory_id, {
          stock_quantity: stock_quantity + quantity - newQuantity,
        });

        return this.update(id, { quantity: newQuantity }, include);
      } else {
        throw new Error("Item quantity can't be more than the stock");
      }
    } catch (error) {
      throw error;
    }
  }

  async incrementQuantity(id: string, include?: string) {
    const orderItem = await this.get(id);
    return this.updateQuantity(id, orderItem.quantity + 1, include);
  }

  async decrementQuantity(id: string, include?: string) {
    const orderItem = await this.get(id);
    return this.updateQuantity(id, orderItem.quantity - 1, include);
  }

  override async delete(id: string): Promise<void> {
    await this.updateQuantity(id, 0);
    await super.delete(id);
  }
}
