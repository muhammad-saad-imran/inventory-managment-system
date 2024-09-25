import React, { InputHTMLAttributes } from "react";
import { usePathname, useRouter } from "next/navigation";
import { InputBase } from "@/elements/inputs";
import { SecondaryButton } from "@/elements/buttons";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  search: string;
  setSearch: any;
};

const SearchBar = ({ label, search, setSearch, ...inputAttrs }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div>
      <p className="text-3xl text-center">{label}</p>
      <div className="flex gap-8 w-full p-5 mt-3 rounded bg-white shadow">
        <InputBase
          placeholder="Search"
          className="border-0 text-lg"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          {...inputAttrs}
        />
        <SecondaryButton onClick={() => router.push(pathname + "/create")}>
          <p className="text-xl">+</p>
        </SecondaryButton>
      </div>
    </div>
  );
};

export default SearchBar;
