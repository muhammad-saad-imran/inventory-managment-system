"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllInventories } from "@/store/features/inventory";
import { getAllInventory } from "@/store/features/inventory/thunk";
import { formatPrice } from "@/utils/datetime";
import SearchBar from "@/components/dashboard/SearchBar";

const InventoryPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");

  const allInventory = useAppSelector(selectAllInventories)

  const debouncedFetch = useCallback(
    debounce((input: string) => dispatch(getAllInventory(input)), 1000),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(search);
    return () => debouncedFetch.cancel();
  }, [debouncedFetch, search]);

  return (
    <div>
      <SearchBar label="Inventory" search={search} setSearch={setSearch} />
      <table className="w-full bg-white mt-3 text-center rounded shadow">
        <thead>
          <tr>
            <th className="py-5">Product</th>
            <th className="py-5">Supplier</th>
            <th className="py-5">cost</th>
            <th className="py-5">stock</th>
          </tr>
        </thead>
        <tbody>
          {allInventory.map((item) => (
            <tr
              key={item.id}
              data-testid="inventory-row"
              className="hover:bg-black/[0.05] cursor-pointer"
              onClick={() => router.push(`/dashboard/inventory/${item.id}`)}
            >
              <td className="py-5">{item.products?.name}</td>
              <td className="py-5 uppercase text-sm">{item.suppliers?.name}</td>
              <td className="py-5 text-sm">{formatPrice(item.cost)}</td>
              <td className="py-5 text-sm">{item.stock_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
