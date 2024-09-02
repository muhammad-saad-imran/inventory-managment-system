"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/utils/datetime";
import { createClient } from "@/utils/supabase/client";
import SearchBar from "@/components/dashboard/SearchBar";

const ClientsPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);

  const filterProducts = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getClients = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("clients").select();

    if (error) {
      alert(error.message);
    }

    if (data) {
      setData(data);
    }
  }, []);

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div>
      <SearchBar label="Clients" search={search} setSearch={setSearch} />
      <table className="w-full mt-3 bg-white">
        <thead>
          <tr>
            <th className="py-5">Name</th>
            <th className="py-5">Email</th>
            <th className="py-5">Phone</th>
            <th className="py-5">Created At</th>
          </tr>
        </thead>
        <tbody>
          {filterProducts.map((item) => (
            <tr
              key={item.id}
              className="text-center hover:bg-black/[0.05] cursor-pointer"
            >
              <td className="py-5">{item.name}</td>
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

export default ClientsPage;
