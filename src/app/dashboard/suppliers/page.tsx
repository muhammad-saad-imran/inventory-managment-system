"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDate } from "@/utils/datetime";
import supplier from "@/config/suppliers.json";
import SearchBar from "@/components/dashboard/SearchBar";

const SupplierPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const filterProducts = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSuppliers = useCallback(async () => {
    const supabase = createClient();
    const ss = await supabase.from("suppliers").select();

    const { data: suppliers, error } = ss;

    if (error) {
      alert(error.message);
    }

    if (suppliers) {
      setData(suppliers);
    }
  }, []);

  useEffect(() => {
    getSuppliers();
  }, []);

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
        {filterProducts.map((item) => (
          <tr className="text-center hover:bg-black/[0.05] cursor-pointer">
            <td className="py-5">{item.name}</td>
            <td className="py-5">{item.name}</td>
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
