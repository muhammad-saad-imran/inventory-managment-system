"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { reduce } from "lodash";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Order } from "@/utils/database/types";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { formatPrice } from "@/utils/datetime";
import { SecondaryButton } from "@/elements/buttons";
import AddProductBar from "@/components/order/AddProductBar";
import OrderInfo from "@/components/order/OrderInfo";

const order = new OrderRepo(createSupabaseClient());

const OrderInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [orderData, setOrderData] = useState<Order>();

  const fetchOrder = useCallback(async () => {
    try {
      const fetchedOrder = await order.get(
        id,
        `*, order_items (*, inventory (*, products (*))), clients (*)`
      );
      setOrderData(fetchedOrder);
    } catch (error) {
      alert("Error ocurred fetching order");
    }
  }, [id]);

  const clientData = orderData?.clients;
  const orderItemsData = orderData?.order_items;

  const totalPrice = reduce(
    orderItemsData,
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div>
      <p className="text-3xl text-center">Order</p>
      <OrderInfo
        clientData={clientData}
        orderData={orderData}
        setOrderData={setOrderData}
      />
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
          {orderItemsData?.map((item) => (
            <tr key={item.id} className="border-t border-b">
              <td className="py-5 w-1/3">
                <div className="flex justify-center px-3">
                  <img className="cursor-pointer" src="/cross.svg" alt="" />
                  <p className="mx-auto">{item.inventory?.products?.name}</p>
                </div>
              </td>
              <td className="py-5 w-1/3">
                <div className="flex gap-2 justify-center items-center">
                  {item.quantity}
                  <SecondaryButton>+</SecondaryButton>
                  <SecondaryButton>-</SecondaryButton>
                </div>
              </td>
              <td className="py-5 w-1/3">
                {formatPrice(item.price * item.quantity)}
              </td>
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
