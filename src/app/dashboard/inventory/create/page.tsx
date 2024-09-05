"use client";

import { useRouter } from "next/navigation";
import useInventoryForm from "@/utils/hooks/useInventoryForm";
import { createSupabaseClient } from "@/utils/supabase/client";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { Inventory } from "@/utils/database/types";
import { inventorySchema } from "@/utils/validations/inventory.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/SelectInput";

const inventory = new InventoryRepo(createSupabaseClient());

const initialValues = {
  supplier_id: "",
  product_id: "",
  cost: 0,
  stock_quantity: 0,
  reorder_limit: 0,
};

const CreateInventoryPage = () => {
  const router = useRouter();

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
      try {
        await inventory.create(values as Inventory);
        router.push("/dashboard/inventory");
      } catch (error) {
        alert("Error creating new inventory");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-3xl text-center">Create Repository</p>
      <div className="flex flex-col gap-3 w-full bg-white mt-3 p-3">
        <div className="flex gap-4">
          <SelectInput {...selectProductAttrs} />
          <SelectInput {...selectSupplierAttrs} />
        </div>
        <InputField
          {...getFieldAttrs("Cost", "cost")}
          type="number"
          value={values.cost === 0 ? "" : values.cost}
        />
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
