import { createSupabaseClient } from "@/utils/supabase/client";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { Order, OrderItem } from "@/utils/database/types";
import { OrderItemService } from "@/utils/services/OrderItemService";
import {
  deleteThunkCreator,
  getAllThunkCreator,
  getThunkCreator,
  mutationThunkCreator,
} from "@/store/utils";
import { formatDate } from "@/utils/datetime";
import { AppDispatch } from "@/store";

const FETCH_ALL_ORDERS = "order/getAll";
const FETCH_ORDER_BY_ID = "order/get";
const CREATE_ORDER = "order/create";
const UPDATE_ORDER = "order/update";

const FETCH_ORDER_ITEM = "orderItem/get";
const CREATE_ORDER_ITEM = "orderItem/create";
const INCREMENT_ORDER_ITEM = "orderItem/decrement";
const DECREMENT_ORDER_ITEM = "orderItem/delete";
const DELETE_ORDER_ITEM = "orderItem/increment";

const order = new OrderRepo(createSupabaseClient());
const orderItemService = new OrderItemService(createSupabaseClient());

export const getAllOrders = getAllThunkCreator<Order>(
  FETCH_ALL_ORDERS,
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

export const getOrder = getThunkCreator<Order>(
  FETCH_ORDER_BY_ID,
  async (id: string) => {
    const orderData = await order.get(
      id,
      `*, order_items (*, inventory (*, products (*))), clients (*)`
    );
    return {
      ...orderData,
      order_date: formatDate({
        date: orderData.order_date,
        outputDate: "YYYY-MM-DDD",
      }),
    };
  }
);

export const createOrder = mutationThunkCreator<Order>(
  CREATE_ORDER,
  async (newOrder: Order) => {
    const order_date = formatDate({
      date: newOrder.order_date,
      outputDate: "",
    });
    return await order.create(
      { ...newOrder, order_date },
      `*, order_items (*, inventory (*, products (*))), clients (*)`
    );
  }
);

export const createAndFetchOrders = async (
  search: string,
  newOrder: Order,
  dispatch: AppDispatch
) => {
  await dispatch(createOrder(newOrder))
    .unwrap()
    .then(() => dispatch(getAllOrders(search)));
};

export const updateOrder = mutationThunkCreator<Order>(
  UPDATE_ORDER,
  async (newOrder: Order) => {
    const order_date = formatDate({
      date: newOrder.order_date,
      outputDate: "",
    });
    return await order.update(
      newOrder.id,
      { ...newOrder, order_date },
      `*, order_items (*, inventory (*, products (*))), clients (*)`
    );
  }
);

/**
 * Async thunk for orderItems,
 * after thunk execution, orderItems are set using extraReducers in createSlice
 * no need to set state in component
 */

export const getAllOrderItem = getAllThunkCreator<OrderItem>(
  FETCH_ORDER_ITEM,
  async (orderId?: string) => {
    return orderItemService.getAll(orderId, `*, inventory (*, products (*))`);
  }
);

export const createOrderItem = mutationThunkCreator<OrderItem>(
  CREATE_ORDER_ITEM,
  async (newItem: OrderItem) => {
    return orderItemService.create(newItem);
  }
);

export const createAndFetchOrderItems = async (
  orderId: string,
  newItem: OrderItem,
  dispatch: AppDispatch
) => {
  await dispatch(createOrderItem(newItem))
    .unwrap()
    .then(() => dispatch(getAllOrderItem(orderId)).unwrap());
};

export const incrementOrderItem = getAllThunkCreator<OrderItem>(
  INCREMENT_ORDER_ITEM,
  async (id: string) => {
    const orderItemData = await orderItemService.incrementQuantity(id);
    return orderItemService.getAll(
      orderItemData.order_id,
      `*, inventory (*, products (*))`
    );
  }
);

export const decrementOrderItem = getAllThunkCreator<OrderItem>(
  DECREMENT_ORDER_ITEM,
  async (id: string) => {
    const orderItemData = await orderItemService.decrementQuantity(id);
    return orderItemService.getAll(
      orderItemData.order_id,
      `*, inventory (*, products (*))`
    );
  }
);

export const deleteOrderItem = getAllThunkCreator(
  DELETE_ORDER_ITEM,
  async (id: string) => {
    const orderItemData = await orderItemService.get(id);
    await orderItemService.delete(id);
    return orderItemService.getAll(
      orderItemData.order_id,
      `*, inventory (*, products (*))`
    );
  }
);
