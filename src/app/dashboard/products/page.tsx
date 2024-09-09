"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/LoadingSlice";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { Product } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const product = new ProductRepo(createSupabaseClient());

const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const filterProducts = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const getProducts = useCallback(async () => {
    try {
      dispatch(startLoading());
      const data = await product.getAll();
      if (data) {
        setData(data);
      }
    } catch (error) {
      alert("Error fetching products");
    } finally {
      dispatch(completeLoading());
    }
  }, [dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div>
      <SearchBar label="Products" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <tr>
          <th className="py-5">Name</th>
          <th className="py-5">Description</th>
          <th className="py-5">Created At</th>
        </tr>
        {filterProducts.map((item: Product) => (
          <tr
            key={item.id}
            className="text-center hover:bg-black/[0.05] cursor-pointer"
            onClick={() => router.push(`/dashboard/products/${item.id}`)}
          >
            <td className="py-5">{item.name}</td>
            <td className="py-5">{item.description}</td>
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
