"use client";

import React, { useState } from "react";
import { formatDate, formatPrice } from "@/utils/datetime";
import { Order } from "@/utils/supabase/types";
import orders from "@/config/orders.json";
import SearchBar from "@/components/dashboard/SearchBar";

const OrderPage = () => {
  const [search, setSearch] = useState("");
  const filterProducts = orders.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <SearchBar label="Orders" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <thead>
          <tr>
            <th className="py-5 w-1/4">ID</th>
            <th className="py-5 w-1/4">Date</th>
            <th className="py-5 w-1/4">Status</th>
            <th className="py-5 w-1/4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filterProducts.map((item: Order) => (
            <tr
              key={item.id}
              className="text-center hover:bg-black/[0.05] cursor-pointer"
            >
              <td className="py-5 w-1/4">{item.id}</td>
              <td className="py-5 w-1/4">
                {formatDate({
                  date: item.order_date,
                  outputDate: "MMM D, YYYY",
                })}
              </td>
              <td className="py-5 w-1/4">{item.status}</td>
              <td className="py-5 w-1/4">{formatPrice(item.total_amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPage;
