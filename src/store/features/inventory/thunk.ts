import { createSupabaseClient } from "@/utils/supabase/client";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { Inventory } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";
import { customThunkCreator } from "@/store/utils";

const FETCH_ALL_INVENTORY = "inventory/getAll";
const FETCH_INVENTORY_BY_ID = "inventory/get";
const CREATE_INVENTORY = "inventory/create";
const UPDATE_INVENTORY = "inventory/update";
const DELETE_INVENTORY = "inventory/delete";

const inventory = new InventoryRepo(createSupabaseClient());

/**
 * Async thunk for Inventory CRUD,
 * `getAllInventory`, `getInventory` & `updateInventory` update redux state after they are fulfilled
 */

export const getAllInventory = customThunkCreator<string, Inventory[]>(
  FETCH_ALL_INVENTORY,
  "Error ocuured fetching inventory",
  async (productName: string) => {
    const allInventoryData = await inventory.getWithProductName(productName);
    return allInventoryData.map((data) => ({
      ...data,
      // Change date to format accepted by input element
      supply_date: formatDate({
        date: data.supply_date,
        outputDate: "YYYY-MM-DD",
      }),
    }));
  }
);

export const getInventory = customThunkCreator<string, Inventory>(
  FETCH_INVENTORY_BY_ID,
  "Error ocuured fetching inventory",
  async (inventoryId: string) => {
    const inventoryData = await inventory.get(
      inventoryId,
      "*, suppliers (*), products (*)"
    );
    // Change date to format accepted by input element
    const supply_date = formatDate({
      date: inventoryData.supply_date,
      outputDate: "YYYY-MM-DD",
    });
    return { ...inventoryData, supply_date };
  }
);

export const createInventory = customThunkCreator<Inventory, Inventory>(
  CREATE_INVENTORY,
  "Error ocuured creating inventory",
  async (newInventory: Inventory) => {
    // Change date to UTC format
    const supply_date = formatDate({
      date: newInventory.supply_date,
      outputDate: "",
    });
    const { products, suppliers, ...values } = newInventory;

    const inventoryData = await inventory.create(
      {
        ...values,
        supply_date,
      },
      "*, suppliers (*), products (*)"
    );

    return {
      ...inventoryData,
      // Change date to format accepted by input element
      supply_date: formatDate({
        date: inventoryData.supply_date,
        outputDate: "YYYY-MM-DD",
      }),
    };
  }
);

export const updateInventory = customThunkCreator<Inventory, Inventory>(
  UPDATE_INVENTORY,
  "Error ocuured updating inventory",
  async (inventoryValues: Inventory) => {
    // Change date to UTC format
    const supply_date = formatDate({
      date: inventoryValues.supply_date,
      outputDate: "",
    });

    // removed joined products & suppliers values
    // only update inventory columns
    const { products, suppliers, ...values } = inventoryValues;

    const inventoryData = await inventory.update(
      inventoryValues.id,
      {
        ...values,
        supply_date,
      },
      "*, suppliers (*), products (*)"
    );

    return {
      ...inventoryData,
      // Change date to format accepted by input element
      supply_date: formatDate({
        date: inventoryData.supply_date,
        outputDate: "YYYY-MM-DD",
      }),
    };
  }
);

export const deleteInventory = customThunkCreator<string, void>(
  DELETE_INVENTORY,
  "Error ocuured deleting inventory",
  async (id: string) => {
    await inventory.delete(id);
  }
);
