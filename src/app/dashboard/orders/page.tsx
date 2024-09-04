"use client";

import React, { useState } from "react";
import { formatDate, formatPrice } from "@/utils/datetime";
import { Order } from "@/utils/database/types";
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
        <tr>
          <th className="py-5">ID</th>
          <th className="py-5">Date</th>
          <th className="py-5">Status</th>
          <th className="py-5">Amount</th>
        </tr>
        {filterProducts.map((item: Order) => (
          <tr
            key={item.id}
            className="text-center hover:bg-black/[0.05] cursor-pointer"
          >
            <td className="py-5">{item.id}</td>
            <td className="py-5">
              {formatDate({ date: item.order_date, outputDate: "MMM D, YYYY" })}
            </td>
            <td className="py-5">{item.status}</td>
            <td className="py-5">{formatPrice(item.total_amount)}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default OrderPage;
