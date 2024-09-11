import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Order, ORDER_STATUS } from "@/utils/database/types";
import {
  decrementOrderItem,
  deleteOrderItem,
  getAllOrderItem,
  getAllOrders,
  getOrder,
  incrementOrderItem,
  updateOrder,
} from "@/store/features/orders/thunk";

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
    builder
      .addCase(getAllOrders.fulfilled, (state, action) => {
        if (action.payload) {
          state.allOrders = action.payload;
        }
      })
      .addMatcher(
        isAnyOf(getOrder.fulfilled, updateOrder.fulfilled),
        (state, action) => {
          if (action.payload) {
            state.order = action.payload;
          }
        }
      )
      .addMatcher(
        isAnyOf(
          getAllOrderItem.fulfilled,
          incrementOrderItem.fulfilled,
          decrementOrderItem.fulfilled,
          deleteOrderItem.fulfilled
        ),
        (state, action) => {
          if (action.payload) state.order.order_items = [...action.payload];
        }
      );
  },
});

export const { setAllOrders, setOrder } = OrderSlice.actions;
export default OrderSlice.reducer;

export const selectOrder = (state: RootState) => state.order.order;
export const selectAllOrders = (state: RootState) => state.order.allOrders;
