"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { reduce } from "lodash";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/features/loading";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Order } from "@/utils/database/types";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { OrderItemService } from "@/utils/services/OrderItemService";
import { formatPrice } from "@/utils/datetime";
import { SecondaryButton } from "@/elements/buttons";
import AddProductBar from "@/components/order/AddProductBar";
import OrderInfo from "@/components/order/OrderInfo";

const order = new OrderRepo(createSupabaseClient());
const orderItemService = new OrderItemService(createSupabaseClient());

const OrderInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [orderData, setOrderData] = useState<Order>();

  const fetchOrder = useCallback(async () => {
    try {
      dispatch(startLoading());
      const fetchedOrder = await order.get(
        id,
        `*, order_items (*, inventory (*, products (*))), clients (*)`
      );
      setOrderData(fetchedOrder);
    } catch (error) {
      alert("Error ocurred fetching order");
    } finally {
      dispatch(completeLoading());
    }
  }, [id, dispatch]);

  const handleIncrement = async (id: string) => {
    try {
      dispatch(startLoading());
      await orderItemService.incrementQuantity(id);
      await fetchOrder();
    } catch (error) {
      dispatch(completeLoading());
      alert("Error occured while incrementing order item quantity");
    }
  };

  const handleDecrement = async (id: string) => {
    try {
      dispatch(startLoading());
      await orderItemService.decrementQuantity(id);
      await fetchOrder();
    } catch (error) {
      dispatch(completeLoading());
      alert("Error occured while decrementing order item quantity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(startLoading());
      await orderItemService.delete(id);
      await fetchOrder();
    } catch (error) {
      dispatch(completeLoading());
      alert("Error occured while deleting order item");
    }
  };

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
                  <Image
                    className="cursor-pointer"
                    src="/cross.svg"
                    alt=""
                    width={20}
                    height={20}
                    onClick={() => handleDelete(item.id)}
                  />
                  <p className="mx-auto">{item.inventory?.products?.name}</p>
                </div>
              </td>
              <td className="py-5 w-1/3">
                <div className="flex gap-2 justify-center items-center">
                  {item.quantity}
                  <SecondaryButton onClick={() => handleIncrement(item.id)}>
                    +
                  </SecondaryButton>
                  <SecondaryButton onClick={() => handleDecrement(item.id)}>
                    -
                  </SecondaryButton>
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
