import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Order, ORDER_STATUS } from "@/utils/database/types";

interface OrderState {
  order: Order;
  allOrders: Order[];
}

const initialState = {
  order: {
    id: "",
    client_id: "",
    order_date: "",
    status: ORDER_STATUS.PROCESSING,
    created_at: "",
    clients: undefined,
    order_items: [],
  },
  allOrders: [],
} satisfies OrderState as OrderState;

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<Order>) {
      return {
        ...state,
        order: {
          ...action.payload,
        },
      };
    },
    setAllOrders(state, action: PayloadAction<Order[]>) {
      return {
        ...state,
        allOrders: [...action.payload],
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

export const { setAllOrders, setOrder } = OrderSlice.actions;
export default OrderSlice.reducer;

export const selectInventory = (state: RootState) => state.inventory.inventory;
export const selectAllInventories = (state: RootState) =>
  state.inventory.allInventories;
