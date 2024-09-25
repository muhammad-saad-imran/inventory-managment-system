import React from "react";
import Link from "next/link";
import { signout } from "@/utils/actions/auth.actions";
import { FlexContainer } from "@/elements/containers";
import Image from "next/image";

const tabs = [
  {
    name: "Inventory",
    route: "/dashboard/inventory",
    icon: "/inventory.svg",
  },
  {
    name: "Products",
    route: "/dashboard/products",
    icon: "/products.svg",
  },
  {
    name: "Suppliers",
    route: "/dashboard/suppliers",
    icon: "/supplier.svg",
  },
  {
    name: "Clients",
    route: "/dashboard/clients",
    icon: "/clients.svg",
  },
  {
    name: "Orders",
    route: "/dashboard/orders",
    icon: "/orders.svg",
  },
];

const Sidebar = () => {
  return (
    <form className="w-96 max-w-96 ">
      <FlexContainer
        className="gap-4 p-4 pt-10 bg-white shadow-md shrink-0 grow-0 bg-[1C2434]"
        style={{ backgroundColor: "rgb(28 36 52)" }}
        $flexDirection="column"
        $justifyContent="start"
        $alignItems="start"
      >
        <p className="text-[#8A99AF]">Menu</p>
        {tabs.map((item) => (
          <Link
            className="w-full text-[#DEEEE4] hover:bg-white/15 rounded px-2 flex gap-2"
            href={item.route}
          >
            <Image
              className="text-[#DEEEE4]"
              src={item.icon}
              alt=""
              width={20}
              height={20}
            />
            <div className="p-2">{item.name}</div>
          </Link>
        ))}
        <button
          className="w-full text-[#DEEEE4] hover:bg-white/15 rounded"
          formAction={signout}
        >
          <div className="text-left p-2 flex gap-2">
            <Image
              className="text-[#DEEEE4]"
              src="/signout.svg"
              alt=""
              width={20}
              height={20}
            />
            Signout
          </div>
        </button>
      </FlexContainer>
    </form>
  );
};

export default Sidebar;
