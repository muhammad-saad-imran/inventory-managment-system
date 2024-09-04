"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import { formatDate } from "@/utils/datetime";
import { Client } from "@/utils/database/types";
import { ClientRepo } from "@/utils/database/ClientRepo";
import SearchBar from "@/components/dashboard/SearchBar";

const ClientsPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Client[]>([]);

  const router = useRouter();

  const client = new ClientRepo(createSupabaseClient());

  const filterProducts = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchClients = useCallback(async () => {
    try {
      const data = await client.getAll();
      if (data) {
        setData(data);
      }
    } catch (error) {
      alert("Error fetching clients");
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
              onClick={() => router.push(`/dashboard/clients/${item.id}`)}
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
