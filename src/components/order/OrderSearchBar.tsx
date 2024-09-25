import React from "react";
import { InputBase } from "@/elements/inputs";

type Props = {
  label: string;
  search: string;
  setSearch: any;
};

const OrderSearchBar = ({ label, search, setSearch }: Props) => {
  return (
    <div>
      <p className="text-3xl text-center">{label}</p>
      <div className="flex gap-8 bg-white w-full p-6 mt-3 rounded shadow">
        <InputBase
          placeholder="Search"
          className="border-0 text-lg border-b"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default OrderSearchBar;
