"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllProducts } from "@/store/features/products";
import { getAllProducts } from "@/store/features/products/thunk";
import { Product } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const ProductPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const allProducts = useAppSelector(selectAllProducts);

  const deboucedGetAllProducts = useCallback(
    debounce((search) => dispatch(getAllProducts(search)), 1000),
    [dispatch]
  );

  useEffect(() => {
    deboucedGetAllProducts(search);
  }, [search]);

  return (
    <div>
      <SearchBar label="Products" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <tr>
          <th className="py-5">Name</th>
          <th className="py-5">Description</th>
          <th className="py-5">Created At</th>
        </tr>
        {allProducts.map((item: Product) => (
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
