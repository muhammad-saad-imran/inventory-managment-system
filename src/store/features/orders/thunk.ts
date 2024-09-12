import { createSupabaseClient } from "@/utils/supabase/client";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { Order, OrderItem } from "@/utils/database/types";
import { OrderItemService } from "@/utils/services/OrderItemService";
import { customThunkCreator } from "@/store/utils";
import { formatDate } from "@/utils/datetime";

const FETCH_ALL_ORDERS = "order/getAll";
const FETCH_ORDER_BY_ID = "order/get";
const CREATE_ORDER = "order/create";
const UPDATE_ORDER = "order/update";

const CREATE_ORDER_ITEM = "orderItem/create";
const INCREMENT_ORDER_ITEM = "orderItem/decrement";
const DECREMENT_ORDER_ITEM = "orderItem/delete";
const DELETE_ORDER_ITEM = "orderItem/increment";

const order = new OrderRepo(createSupabaseClient());
const orderItemService = new OrderItemService(createSupabaseClient());

/**
 * Async thunk for order CRUD,
 * `getAllOrders`, `getOrder` & `updateOrder` update redux state after they are fulfilled
 */

const includeOrder = `*, order_items (*, inventory (*, products (*))), clients (*)`;

export const getAllOrders = customThunkCreator<string, Order[]>(
  FETCH_ALL_ORDERS,
  "Error ocuured fetching orders",
  async (clientName: string) => {
    const allOrders = await order.getWithClientName(clientName);
    return allOrders.map((item) => ({
      ...item,
      order_date: formatDate({
        date: item.order_date,
        outputDate: "YYYY-MM-DDD",
      }),
    }));
  }
);

export const getOrder = customThunkCreator<string, Order>(
  FETCH_ORDER_BY_ID,
  "Error ocuured fetching orders",
  async (id: string) => {
    const orderData = await order.get(id, includeOrder);
    return {
      ...orderData,
      order_date: formatDate({
        date: orderData.order_date,
        outputDate: "YYYY-MM-DDD",
      }),
    };
  }
);

export const createOrder = customThunkCreator<
  { order: Order; clientName: string },
  Order[]
>(CREATE_ORDER, "Error ocuured creating order", async (input) => {
  const newOrder = input.order;
  await order.create(
    {
      ...newOrder,
      order_date: formatDate({
        date: newOrder.order_date,
        outputDate: "",
      }),
    },
    includeOrder
  );

  const allOrders = await order.getWithClientName(input.clientName);
  return allOrders.map((item) => ({
    ...item,
    order_date: formatDate({
      date: item.order_date,
      outputDate: "YYYY-MM-DDD",
    }),
  }));
});

export const updateOrder = customThunkCreator<Order, Order>(
  UPDATE_ORDER,
  "Error ocuured updating orders",
  async (newOrder: Order) => {
    const order_date = formatDate({
      date: newOrder.order_date,
      outputDate: "",
    });
    return await order.update(
      newOrder.id,
      { ...newOrder, order_date },
      includeOrder
    );
  }
);

/**
 * Async thunk for orderItems,
 * after thunk execution, orderItems are set using extraReducers in createSlice
 * no need to set state in component
 */

const includeOrderItem = `*, inventory (*, products (*))`;

export const createOrderItem = customThunkCreator<OrderItem, OrderItem[]>(
  CREATE_ORDER_ITEM,
  "Error ocuured creating order item",
  async (newItem: OrderItem) => {
    const createdItem = await orderItemService.create(newItem);
    return orderItemService.getAll(createdItem.order_id, includeOrderItem);
  }
);

export const incrementOrderItem = customThunkCreator<string, OrderItem[]>(
  INCREMENT_ORDER_ITEM,
  "Error ocuured incrementing order item quantity",
  async (id: string) => {
    const orderItemData = await orderItemService.incrementQuantity(id);
    return orderItemService.getAll(orderItemData.order_id, includeOrderItem);
  }
);

export const decrementOrderItem = customThunkCreator<string, OrderItem[]>(
  DECREMENT_ORDER_ITEM,
  "Error ocuured decrementing order item quantity",
  async (id: string) => {
    const orderItemData = await orderItemService.decrementQuantity(id);
    return orderItemService.getAll(orderItemData.order_id, includeOrderItem);
  }
);

export const deleteOrderItem = customThunkCreator<string, OrderItem[]>(
  DELETE_ORDER_ITEM,
  "Error ocuured deleting order item",
  async (id: string) => {
    const orderItemData = await orderItemService.get(id);
    await orderItemService.delete(id);
    return orderItemService.getAll(orderItemData.order_id, includeOrderItem);
  }
);
