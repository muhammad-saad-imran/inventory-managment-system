"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import { DB_TABLES, Order } from "@/utils/supabase/types";
import { formatDate } from "@/utils/datetime";
import OrderSearchBar from "@/components/order/OrderSearchBar";
import CreateOrderBar from "@/components/order/CreateOrderBar";

const OrderPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Order[]>([]);

  const router = useRouter();

  const filterProducts = data.filter((item) =>
    item.clients?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getOrders = useCallback(async () => {
    const supabase = createSupabaseClient();
    const { data: orders } = await supabase
      .from(DB_TABLES.ORDERS)
      .select(`*, clients (id, name)`)
      .order("order_date", { ascending: false });

    if (orders) setData(orders);
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <div className="flex flex-col gap-3">
      <OrderSearchBar label="Orders" search={search} setSearch={setSearch} />
      <CreateOrderBar />
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
          {filterProducts.map((item: Order) => (
            <tr
              key={item.id}
              className="text-center hover:bg-black/[0.05] cursor-pointer"
              onClick={() => router.push(`/dashboard/orders/${item.id}`)}
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
