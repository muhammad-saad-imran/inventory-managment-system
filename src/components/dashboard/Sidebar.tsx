import React from "react";
import Link from "next/link";
import { signout } from "@/utils/actions/auth.actions";
import { Button } from "@/elements/buttons";
import { FlexContainer } from "@/elements/containers";

const Sidebar = () => {
  return (
    <form className="w-96 max-w-96 ">
      <FlexContainer
        className="gap-4 p-4 bg-white shadow-md shrink-0 grow-0"
        $flexDirection="column"
        $justifyContent="start"
      >
        My Inventory
        <Link className="w-full" href="/dashboard/inventory">
          <Button className="w-full">Inventory</Button>
        </Link>
        <Link className="w-full" href="/dashboard/products">
          <Button className="w-full">Products</Button>
        </Link>
        <Link className="w-full" href="/dashboard/suppliers">
          <Button className="w-full">Suppliers</Button>
        </Link>
        <Link className="w-full" href="/dashboard/clients">
          <Button className="w-full">Clients</Button>
        </Link>
        <Link className="w-full" href="/dashboard/orders">
          <Button className="w-full">Orders</Button>
        </Link>
        <Button className="w-full" formAction={signout}>
          Signout
        </Button>
      </FlexContainer>
    </form>
  );
};

export default Sidebar;
