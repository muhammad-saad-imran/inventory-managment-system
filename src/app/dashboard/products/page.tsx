"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDate, formatPrice } from "@/utils/datetime";
import products from "@/config/products.json";
import SearchBar from "@/components/dashboard/SearchBar";

const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);

  const filterProducts = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const getProducts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select();

    if (error) {
      alert(error.message);
    }

    if (data) {
      setData(data);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <SearchBar label="Products" search={search} setSearch={setSearch} />
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

export default ProductPage;
