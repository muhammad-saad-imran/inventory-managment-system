import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Inventory, Product, Supplier } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";
import {
  getAllInventory,
  getInventory,
  updateInventory,
} from "@/store/features/inventory/thunk";
import { getAllProducts } from "@/store/features/products/thunk";

interface InventoryState {
  inventory: Inventory;
  allInventories: Inventory[];
  selectedProduct: Product & { label: string; value: string };
  selectedSupplier: Supplier & { label: string; value: string };
}

const initialState = {
  inventory: {
    id: "",
    cost: 0,
    supplier_id: "",
    product_id: "",
    stock_quantity: 0,
    reorder_limit: 0,
    supply_date: "",
    created_at: "",
    suppliers: undefined,
    products: undefined,
  },
  selectedProduct: {
    label: "",
    value: "",
    id: "",
    name: "",
    description: "",
    created_at: "",
  },
  selectedSupplier: {
    label: "",
    value: "",
    id: "",
    name: "",
    email: "",
    phone_number: 0,
    created_at: "",
  },
  allInventories: [],
} satisfies InventoryState as InventoryState;

const handleFulfilledInventory = (
  state: InventoryState,
  payload: Inventory | undefined
) => {
  if (payload) {
    const { products, suppliers } = payload;
    state.inventory = payload;
    state.selectedProduct = {
      label: products?.name!,
      value: products?.id!,
      ...products!,
    };
    state.selectedSupplier = {
      label: suppliers?.name!,
      value: suppliers?.id!,
      ...suppliers!,
    };
  }
};

const InventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventory(state, action: PayloadAction<Inventory>) {
      return {
        ...state,
        inventory: {
          ...action.payload,
        },
      };
    },
    setAllInventories(state, action: PayloadAction<Inventory[]>) {
      return {
        ...state,
        allInventories: [...action.payload],
      };
    },
    setSelectedProduct(
      state,
      action: PayloadAction<Product & { label: string; value: string }>
    ) {
      return {
        ...state,
        selectedProduct: { ...action.payload },
      };
    },
    setSelectedSupplier(
      state,
      action: PayloadAction<Supplier & { label: string; value: string }>
    ) {
      return {
        ...state,
        selectedSupplier: { ...action.payload },
      };
    },
    resetSelectedValues(state) {
      state.selectedProduct = {
        label: "",
        value: "",
        id: "",
        name: "",
        description: "",
        created_at: "",
      };
      state.selectedSupplier = {
        label: "",
        value: "",
        id: "",
        name: "",
        email: "",
        phone_number: 0,
        created_at: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllInventory.fulfilled, (state, action) => {
        if (action.payload) {
          state.allInventories = action.payload;
        }
      })
      .addCase(getInventory.fulfilled, (state, action) =>
        handleFulfilledInventory(state, action.payload)
      )
      .addCase(updateInventory.fulfilled, (state, action) =>
        handleFulfilledInventory(state, action.payload)
      );
  },
});

export const {
  setAllInventories,
  setInventory,
  setSelectedProduct,
  setSelectedSupplier,
  resetSelectedValues,
} = InventorySlice.actions;
export default InventorySlice.reducer;

export const selectInventory = (state: RootState) => state.inventory.inventory;

export const selectAllInventories = (state: RootState) =>
  state.inventory.allInventories;

export const selectSelectedProduct = (state: RootState) =>
  state.inventory.selectedProduct;

export const selectSelectedSupplier = (state: RootState) =>
  state.inventory.selectedSupplier;
