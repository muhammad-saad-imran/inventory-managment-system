"use client";

import React, { useState } from "react";
import { formatDate, formatPrice } from "@/utils/datetime";
import products from "@/config/products.json";
import SearchBar from "@/components/dashboard/SearchBar";

const InvoicePage = () => {
  const [search, setSearch] = useState("");
  const filterProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <SearchBar label="Invoices" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <tr>
          <th className="py-5">Name</th>
          <th className="py-5">Description</th>
          <th className="py-5">Price</th>
          <th className="py-5">Created At</th>
        </tr>
        {filterProducts.map((item) => (
          <tr className="text-center hover:bg-black/[0.05] cursor-pointer">
            <td className="py-5">{item.name}</td>
            <td className="py-5">{item.description}</td>
            <td className="py-5">{formatPrice(item.selling_price)}</td>
            <td className="py-5">
              {formatDate({ date: item.created_at, outputDate: "MMM D, YYYY" })}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default InvoicePage;
