import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Inventory } from "@/utils/database/types";

interface InventoryState {
  inventory: Inventory;
  allInventories: Inventory[];
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
  allInventories: [],
} satisfies InventoryState as InventoryState;

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
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(getAllProducts.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.allProducts = action.payload;
    //     }
    //   })
    //   .addCase(getProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   })
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   });
  },
});

export const { setAllInventories, setInventory } = InventorySlice.actions;
export default InventorySlice.reducer;

export const selectInventory = (state: RootState) => state.inventory.inventory;
export const selectAllInventories = (state: RootState) =>
  state.inventory.allInventories;
