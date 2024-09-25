"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useInventoryForm from "@/utils/hooks/useInventoryForm";
import { useAppDispatch } from "@/store/hooks";
import { resetSelectedValues } from "@/store/features/inventory";
import { createInventory } from "@/store/features/inventory/thunk";
import { Inventory } from "@/utils/database/types";
import { inventorySchema } from "@/utils/validations/inventory.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/AsyncSelectInput";

const initialValues = {
  supplier_id: "",
  product_id: "",
  cost: 0,
  stock_quantity: 0,
  reorder_limit: 0,
  supply_date: "",
};

const CreateInventoryPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    values,
    selectProductAttrs,
    selectSupplierAttrs,
    handleSubmit,
    getFieldAttrs,
  } = useInventoryForm({
    initialValues,
    validationSchema: inventorySchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(createInventory(values as Inventory))
        .unwrap()
        .then(() => router.push("/dashboard/inventory"))
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    dispatch(resetSelectedValues());
  }, [dispatch]);

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-3xl text-center">Create Inventory</p>
      <div className="flex flex-col gap-3 w-full bg-white mt-3 p-6 shadow rounded">
        <div className="flex gap-4">
          <SelectInput {...selectProductAttrs} />
          <SelectInput {...selectSupplierAttrs} />
        </div>
        <div className="flex gap-4">
          <InputField
            {...getFieldAttrs("Cost", "cost")}
            type="number"
            value={values.cost === 0 ? "" : values.cost}
          />
          <InputField
            {...getFieldAttrs("Supply date", "supply_date")}
            type="date"
          />
        </div>
        <div className="flex gap-4">
          <InputField
            {...getFieldAttrs("Stock", "stock_quantity")}
            type="number"
          />
          <InputField
            {...getFieldAttrs("Reorder limit", "reorder_limit")}
            type="number"
          />
        </div>
        <SecondaryButton className="w-fit" type="submit">
          Create
        </SecondaryButton>
      </div>
    </form>
  );
};

export default CreateInventoryPage;
