"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { reduce } from "lodash";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Client, DB_TABLES, Order, OrderItem } from "@/utils/supabase/types";
import { formatPrice } from "@/utils/datetime";
import { SecondaryButton } from "@/elements/buttons";
import AddProductBar from "@/components/order/AddProductBar";
import OrderInfo from "@/components/order/OrderInfo";

const OrderInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order>();
  const [client, setClient] = useState<Client>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const fetchOrder = useCallback(async () => {
    const supabase = createSupabaseClient();
    const {
      data: { clients, order_items, ...order },
    } = await supabase
      .from(DB_TABLES.ORDERS)
      .select(`*, order_items (*, products (*)), clients (*)`)
      .eq("id", id)
      .limit(1)
      .single();

    setOrder(order);
    setClient(clients);
    setOrderItems(order_items);
  }, [id]);

  // const handleDelete = async (id: string) => {
  //   const { success, error } = await deleteOrderItem(id);

  //   if (success) {
  //     fetchOrder();
  //   } else {
  //     alert(error);
  //   }
  // };

  const totalPrice = reduce(orderItems, (total, item) => total + item.price, 0);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div>
      <p className="text-3xl text-center">Order</p>
      <OrderInfo client={client} order={order} refetch={fetchOrder} />
      <AddProductBar refetch={fetchOrder} />
      <table className="w-full bg-white mt-3 p-3 text-center">
        <thead>
          <tr>
            <th className="py-5 w-1/3">Product</th>
            <th className="py-5 w-1/3">Quantity</th>
            <th className="py-5 w-1/3">Price</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <tr key={item.id} className="border-t border-b">
              <td className="py-5 w-1/3">
                <div className="flex justify-center px-3">
                  <img className="cursor-pointer" src="/cross.svg" alt="" />
                  <p className="mx-auto">{item.products?.name}</p>
                </div>
              </td>
              <td className="py-5 w-1/3">
                <div className="flex gap-2 justify-center items-center">
                  {item.quantity}
                  <SecondaryButton>+</SecondaryButton>
                  <SecondaryButton>-</SecondaryButton>
                </div>
              </td>
              <td className="py-5 w-1/3">{formatPrice(item.price)}</td>
            </tr>
          ))}
          <tr className="border-t border-b">
            <td className="py-5 w-1/3"></td>
            <td className="py-5 w-1/3"></td>
            <td className="py-5 w-1/3 text-lg">
              Total <span className="text-xl">{formatPrice(totalPrice)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderInfoPage;
