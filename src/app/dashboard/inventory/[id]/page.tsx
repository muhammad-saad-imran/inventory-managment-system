"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useInventoryForm from "@/utils/hooks/useInventoryForm";
import { createSupabaseClient } from "@/utils/supabase/client";
import { InventoryRepo } from "@/utils/database/InventoryRepo";
import { Inventory, Product, Supplier } from "@/utils/database/types";
import { inventorySchema } from "@/utils/validations/inventory.validation";
import { SecondaryButton } from "@/elements/buttons";
import SelectInput from "@/components/common/AsyncSelectInput";
import InputField from "@/components/common/InputField";
import { formatDate } from "@/utils/datetime";

const inventory = new InventoryRepo(createSupabaseClient());

const InventoryInfoPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState({});
  const [initialSelectedProduct, setInitialSelectedProduct] = useState<
    Product & { label: string; value: string }
  >();
  const [initialSelectedSupplier, setInitialSelectedSupplier] = useState<
    Supplier & { label: string; value: string }
  >();

  const {
    values,
    selectProductAttrs,
    selectSupplierAttrs,
    handleSubmit,
    getFieldAttrs,
  } = useInventoryForm({
    initialSelectedProduct,
    initialSelectedSupplier,
    initialValues,
    validationSchema: inventorySchema,
    enableReinitialize: true,
    async onSubmit(values, { setSubmitting }) {
      try {
        const supply_date = formatDate({
          date: values.supply_date,
          outputDate: "",
        });
        await inventory.update(id, { ...values, supply_date } as Inventory);
        router.push("/dashboard/inventory");
      } catch (error) {
        alert("Error creating new inventory");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    try {
      await inventory.delete(id);
      router.push("/dashboard/inventory");
    } catch (error) {
      alert("Error deleting new inventory");
    }
  };

  const fetchInventory = useCallback(async () => {
    try {
      const { suppliers, products, ...inventoryData } = await inventory.get(
        id,
        "*, suppliers (*), products (*)"
      );
      const supply_date = formatDate({
        date: inventoryData.supply_date,
        outputDate: "YYYY-MM-DD",
      });

      setInitialValues({ ...inventoryData, supply_date });
      setInitialSelectedProduct({
        label: products?.name!,
        value: products?.id!,
        ...products!,
      });
      setInitialSelectedSupplier({
        label: suppliers?.name!,
        value: suppliers?.id!,
        ...suppliers!,
      });
    } catch (error) {
      alert("Error occured fetching inventory record");
    }
  }, [id]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-3xl text-center">Create Inventory</p>
      <div className="flex flex-col gap-3 w-full bg-white mt-3 p-3">
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
