"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { startLoading } from "@/store/features/loading";
import { selectAllOrders } from "@/store/features/orders";
import { getAllOrders } from "@/store/features/orders/thunk";
import { formatDate } from "@/utils/datetime";
import OrderSearchBar from "@/components/order/OrderSearchBar";
import CreateOrderBar from "@/components/order/CreateOrderBar";

const OrderPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const allOrders = useAppSelector(selectAllOrders);

  const debounceFetch = useCallback(
    debounce((input: string) => dispatch(getAllOrders(input)), 1000),
    [dispatch]
  );

  useEffect(() => {
    debounceFetch(search);
    // Cleanup: cancel the debounced function when dependencies change or on unmount
    return () => debounceFetch.cancel();
  }, [search, debounceFetch]);

  return (
    <div className="flex flex-col gap-3">
      <OrderSearchBar label="Orders" search={search} setSearch={setSearch} />
      <CreateOrderBar search={search} />
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 w-1/4">ID</th>
            <th className="py-5 w-1/4">Client</th>
            <th className="py-5 w-1/4">Date</th>
            <th className="py-5 w-1/4">Status</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((item) => (
            <tr
              key={item.id}
              className="text-center hover:bg-black/[0.05] cursor-pointer"
              onClick={() => {
                dispatch(startLoading());
                router.push(`/dashboard/orders/${item.id}`);
              }}
            >
              <td className="py-5 w-1/4">{item.id}</td>
              <td className="py-5 w-1/4">{item.clients?.name}</td>
              <td className="py-5 w-1/4">
                {formatDate({
                  date: item.order_date,
                  outputDate: "MMM D, YYYY",
                })}
              </td>
              <td className="py-5 w-1/4">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPage;
