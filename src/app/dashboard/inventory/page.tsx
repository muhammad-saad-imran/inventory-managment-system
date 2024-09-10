"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/features/loading";
import { createSupabaseClient } from "@/utils/supabase/client";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { Inventory } from "@/utils/database/types";
import { formatPrice } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const inventory = new InventoryRepo(createSupabaseClient());

const InventoryPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [data, setData] = useState<Inventory[]>([]);

  const fetchInventory = useCallback(async (input: string) => {
    try {
      dispatch(startLoading());
      const inventoryData = await inventory.getWithProductName(input);
      setData(inventoryData);
    } catch (error) {
      alert("Error fetching inventory data");
    } finally {
      dispatch(completeLoading());
    }
  }, [dispatch]);

  const debouncedFetch = useCallback(debounce(fetchInventory, 2000), [
    fetchInventory,
  ]);

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [debouncedFetch, search]);

  return (
    <div>
      <SearchBar label="Inventory" search={search} setSearch={setSearch} />
      <table className="w-full bg-white mt-3 text-center">
        <thead>
          <tr>
            <th className="py-5">Product</th>
            <th className="py-5">Supplier</th>
            <th className="py-5">cost</th>
            <th className="py-5">stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-black/[0.05] cursor-pointer"
              onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
            >
              <td className="py-5">{item.products?.name}</td>
              <td className="py-5">{item.suppliers?.name}</td>
              <td className="py-5">{formatPrice(item.cost)}</td>
              <td className="py-5">{item.stock_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
