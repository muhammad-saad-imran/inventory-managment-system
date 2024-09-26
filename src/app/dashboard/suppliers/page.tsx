"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { debounce } from "lodash";
import { getAllSupplier } from "@/store/features/suppliers/thunk";
import { selectAllSuppliers } from "@/store/features/suppliers";
import { Supplier } from "@/utils/database/types";
import { formatDate } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const SupplierPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const allSupplier = useAppSelector(selectAllSuppliers);

  const debouncedGetAllSupplier = useCallback(
    debounce((search: string) => dispatch(getAllSupplier(search)), 1000),
    [dispatch]
  );

  useEffect(() => {
    debouncedGetAllSupplier(search);
  }, [debouncedGetAllSupplier, search]);

  return (
    <div>
      <SearchBar label="Suppliers" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-5">Name</th>
            <th className="py-5">Email</th>
            <th className="py-5">Phone</th>
            <th className="py-5">Created At</th>
          </tr>
        </thead>
        <tbody>
          {allSupplier.map((item: Supplier) => (
            <tr
              key={item.id}
              data-testid="supplier-row"
              className="text-center hover:bg-black/[0.05] cursor-pointer"
              onClick={() => router.push(`/dashboard/suppliers/${item.id}`)}
            >
              <td className="py-5 uppercase text-sm">{item.name}</td>
              <td className="py-5">{item.email}</td>
              <td className="py-5">{item.phone_number}</td>
              <td className="py-5">
                {formatDate({
                  date: item.created_at,
                  outputDate: "MMM D, YYYY",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierPage;
