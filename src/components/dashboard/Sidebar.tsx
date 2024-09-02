import React from "react";
import { signout } from "@/utils/actions/auth.actions";
import { Button } from "@/elements/buttons";
import { FlexContainer } from "@/elements/containers";
import Link from "next/link";

const Sidebar = () => {
  return (
    <form className="w-1/5 max-w-96 ">
      <FlexContainer
        className="gap-4 p-4 bg-white shadow-md"
        $flexDirection="column"
        $justifyContent="start"
      >
        My Inventory
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
        <Link className="w-full" href="/dashboard/invoices">
          <Button className="w-full">Invoices</Button>
        </Link>
        <Button className="w-full" formAction={signout}>
          Signout
        </Button>
      </FlexContainer>
    </form>
  );
};

export default Sidebar;
