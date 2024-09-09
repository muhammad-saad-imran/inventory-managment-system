"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/LoadingSlice";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Order } from "@/utils/database/types";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { formatDate } from "@/utils/datetime";
import OrderSearchBar from "@/components/order/OrderSearchBar";
import CreateOrderBar from "@/components/order/CreateOrderBar";

const order = new OrderRepo(createSupabaseClient());

const OrderPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Order[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const fetchOrders = useCallback(async (clientName: string) => {
    try {
      dispatch(startLoading());
      const allOrders = await order.getWithClientName(clientName);
      setData(allOrders);
    } catch (error) {
      setData([]);
      alert("Error ocurred while fetching order");
    } finally {
      dispatch(completeLoading());
    }
  }, [dispatch]);

  const debounceFetch = useCallback(debounce(fetchOrders, 1000), [fetchOrders]);

  useEffect(() => {
    debounceFetch(search);
    // Cleanup: cancel the debounced function when dependencies change or on unmount
    return () => debounceFetch.cancel();
  }, [search, debounceFetch]);

  return (
    <div className="flex flex-col gap-3">
      <OrderSearchBar label="Orders" search={search} setSearch={setSearch} />
      <CreateOrderBar refetch={() => fetchOrders(search)} />
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
          {data.map((item) => (
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
