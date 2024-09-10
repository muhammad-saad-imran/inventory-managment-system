"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/features/loading/LoadingSlice";
import { Supplier } from "@/utils/database/types";
import { createSupabaseClient } from "@/utils/supabase/client";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { formatDate } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const supplier = new SupplierRepo(createSupabaseClient());

const SupplierPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const filterProducts = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSuppliers = useCallback(async () => {
    try {
      dispatch(startLoading());
      const supplierData = await supplier.getAll();
      setData(supplierData);
    } catch (error) {
      alert("Error while fetching suppliers");
    } finally {
      dispatch(completeLoading());
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return (
    <div>
      <SearchBar label="Suppliers" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <tr>
          <th className="py-5">Name</th>
          <th className="py-5">Email</th>
          <th className="py-5">Phone</th>
          <th className="py-5">Created At</th>
        </tr>
        {filterProducts.map((item: Supplier) => (
          <tr
            key={item.id}
            className="text-center hover:bg-black/[0.05] cursor-pointer"
            onClick={() => router.push(`/dashboard/suppliers/${item.id}`)}
          >
            <td className="py-5">{item.name}</td>
            <td className="py-5">{item.email}</td>
            <td className="py-5">{item.phone_number}</td>
            <td className="py-5">
              {formatDate({ date: item.created_at, outputDate: "MMM D, YYYY" })}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default SupplierPage;
