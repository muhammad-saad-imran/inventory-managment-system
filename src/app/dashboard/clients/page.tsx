"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { selectAllClients } from "@/store/features/clients";
import { getAllClient } from "@/store/features/clients/thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const ClientsPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const allClients = useAppSelector(selectAllClients);

  const debouncedGetAllClients = useCallback(
    debounce((search: string) => dispatch(getAllClient(search)), 1000),
    [dispatch]
  );

  useEffect(() => {
    debouncedGetAllClients(search);
  }, [debouncedGetAllClients, search]);

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
          {allClients.map((item) => (
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
