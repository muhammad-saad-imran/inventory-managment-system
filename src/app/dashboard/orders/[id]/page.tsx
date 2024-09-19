"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { reduce } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOrder } from "@/store/features/orders";
import {
  decrementOrderItem,
  deleteOrderItem,
  getOrder,
  incrementOrderItem,
} from "@/store/features/orders/thunk";
import { formatPrice } from "@/utils/datetime";
import { SecondaryButton } from "@/elements/buttons";
import AddProductBar from "@/components/order/AddProductBar";
import OrderInfo from "@/components/order/OrderInfo";

const OrderInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const orderData = useAppSelector(selectOrder);

  const handleIncrement = async (id: string) => {
    await dispatch(incrementOrderItem(id)).unwrap();
  };

  const handleDecrement = async (id: string) => {
    await dispatch(decrementOrderItem(id)).unwrap();
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteOrderItem(id)).unwrap();
  };

  const clientData = orderData?.clients;
  const orderItemsData = orderData?.order_items;

  const totalPrice = reduce(
    orderItemsData,
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  return (
    <div>
      <p className="text-3xl text-center">Order</p>
      <OrderInfo clientData={clientData} orderData={orderData} />
      <AddProductBar />
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
                    data-testid="delete-btn"
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
