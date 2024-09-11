import { createAsyncThunk } from "@reduxjs/toolkit";
import { completeLoading, startLoading } from "@/store/features/loading";
import { createSupabaseClient } from "@/utils/supabase/client";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { Inventory } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";

const FETCH_ALL_INVENTORY = "inventory/getAll";
const FETCH_INVENTORY_BY_ID = "inventory/get";
const CREATE_INVENTORY = "inventory/create";
const UPDATE_INVENTORY = "inventory/update";
const DELETE_INVENTORY = "inventory/delete";

const inventory = new InventoryRepo(createSupabaseClient());

export const getAllInventory = createAsyncThunk(
  FETCH_ALL_INVENTORY,
  async (productName: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const allInventoryData = await inventory.getWithProductName(productName);
      dispatch(completeLoading());
      return allInventoryData.map((data) => ({
        ...data,
        supply_date: formatDate({
          date: data.supply_date,
          outputDate: "YYYY-MM-DD",
        }),
      }));
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching inventory");
      rejectWithValue(error);
    }
  }
);

export const getInventory = createAsyncThunk(
  FETCH_INVENTORY_BY_ID,
  async (inventoryId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const inventoryData = await inventory.get(
        inventoryId,
        "*, suppliers (*), products (*)"
      );
      const supply_date = formatDate({
        date: inventoryData.supply_date,
        outputDate: "YYYY-MM-DD",
      });
      dispatch(completeLoading());
      return { ...inventoryData, supply_date };
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching inventory");
      rejectWithValue(error);
    }
  }
);

export const createInventory = createAsyncThunk(
  CREATE_INVENTORY,
  async (newInventory: Inventory, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
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
      dispatch(completeLoading());
      return {
        ...inventoryData,
        supply_date: formatDate({
          date: inventoryData.supply_date,
          outputDate: "YYYY-MM-DD",
        }),
      };
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while creating inventory");
      rejectWithValue(error);
    }
  }
);

export const updateInventory = createAsyncThunk(
  UPDATE_INVENTORY,
  async (inventoryValues: Inventory, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const supply_date = formatDate({
        date: inventoryValues.supply_date,
        outputDate: "",
      });
      const { products, suppliers, ...values } = inventoryValues;
      const inventoryData = await inventory.update(
        inventoryValues.id,
        {
          ...values,
          supply_date,
        },
        "*, suppliers (*), products (*)"
      );
      dispatch(completeLoading());
      return {
        ...inventoryData,
        supply_date: formatDate({
          date: inventoryData.supply_date,
          outputDate: "YYYY-MM-DD",
        }),
      };
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while updating inventory");
      rejectWithValue(error);
    }
  }
);

export const deleteInventory = createAsyncThunk(
  DELETE_INVENTORY,
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      await inventory.delete(id);
      dispatch(completeLoading());
      return;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while deleting inventory");
      rejectWithValue(error);
    }
  }
);
