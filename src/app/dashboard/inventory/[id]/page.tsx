"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useInventoryForm from "@/utils/hooks/useInventoryForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectInventory } from "@/store/features/inventory";
import {
  deleteInventory,
  getInventory,
  updateInventory,
} from "@/store/features/inventory/thunk";
import { Inventory } from "@/utils/database/types";
import { inventorySchema } from "@/utils/validations/inventory.validation";
import { SecondaryButton } from "@/elements/buttons";
import SelectInput from "@/components/common/AsyncSelectInput";
import InputField from "@/components/common/InputField";

const InventoryInfoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const inventoryData = useAppSelector(selectInventory);

  const {
    values,
    selectProductAttrs,
    selectSupplierAttrs,
    handleSubmit,
    getFieldAttrs,
  } = useInventoryForm({
    initialValues: inventoryData,
    validationSchema: inventorySchema,
    enableReinitialize: true,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(updateInventory({ id, ...values } as Inventory)).finally(
        () => setSubmitting(false)
      );
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteInventory(id))
      .unwrap()
      .then(() => router.push("/dashboard/inventory"));
  };

  useEffect(() => {
    dispatch(getInventory(id));
  }, [id, dispatch]);

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
        <div className="flex gap-4">
          <SecondaryButton className="w-fit" type="submit">
            Update
          </SecondaryButton>
          <SecondaryButton
            className="w-fit"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </SecondaryButton>
        </div>
      </div>
    </form>
  );
};

export default InventoryInfoPage;
