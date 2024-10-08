import { useState } from "react";
import { useParams } from "next/navigation";
import { round, get } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch } from "@/store/hooks";
import { createOrderItem } from "@/store/features/orders/thunk";
import { getAllInventory } from "@/store/features/inventory/thunk";
import { Inventory, OrderItem } from "@/utils/database/types";
import { orderItemSchema } from "@/utils/validations/order.validation";
import { formatDate, formatPrice } from "@/utils/datetime";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";

const AddProductBar = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [cost, setCost] = useState(0);
  const [selectedInventory, setSelectedInventory] = useState<
    (Inventory & { label: string }) | null
  >(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    getFieldAttrs,
    handleSubmit,
    setFieldValue,
  } = useFormikForm({
    initialValues: { order_id: id, inventory_id: "", quantity: 0, price: 0 },
    validationSchema: orderItemSchema,
    async onSubmit(values, { setFieldError, setSubmitting, resetForm }) {
      if (values.quantity > get(selectedInventory, "stock_quantity", 0)) {
        setFieldError(
          "quantity",
          `Quantity should be less than stock available`
        );
        return;
      }

      await dispatch(createOrderItem(values as OrderItem))
        .unwrap()
        .then(() => {
          setCost(0);
          setSelectedInventory(null);
          resetForm();
        })
        .finally(() => setSubmitting(false));
    },
  });

  const loadProducts = async (input: string) => {
    try {
      const data = await dispatch(getAllInventory(input)).unwrap();
      return data
        ? data.map((item) => ({
            // format label as - `product (supplier) - supply-date`
            label: `${item.products?.name} (${
              item.suppliers?.name
            }) - ${formatDate({
              date: item.supply_date,
              outputDate: "DD MMM, YYYY",
            })}`,

            value: item.id,
            ...item,
          }))
        : [];
    } catch (error) {
      return [];
    }
  };

  const selectAttrs = {
    label: "Inventory",
    value: selectedInventory as any,
    error: errors["product_id"] as string,
    touched: touched["product_id"] as boolean,
    loadOptions: loadProducts,
    onChange(newOption: any) {
      setSelectedInventory(newOption);
      setFieldValue("inventory_id", newOption.id);
      setCost(newOption.cost);
    },
  };

  return (
    <form className="bg-white w-full p-5 mt-3" onSubmit={handleSubmit}>
      <div className="flex gap-4 w-full">
        <AsyncSelectInput key={selectedInventory?.id} {...selectAttrs} />
        <InputField
          label="Stock"
          value={selectedInventory?.stock_quantity || 0}
          disabled
        />
      </div>
      <div className="flex gap-4 w-full mt-3">
        <InputField label="Cost" value={formatPrice(cost || 0)} disabled />
        <InputField
          {...getFieldAttrs("Selling Price", "price")}
          step="0.01"
          onChange={(e) =>
            setFieldValue("price", round(parseFloat(e.target.value), 2))
          }
          type="number"
        />
      </div>
      <div className="flex gap-4 w-full mt-3">
        <InputField {...getFieldAttrs("Quantity", "quantity")} type="number" />
        <div className="w-full flex gap-4">
          <InputField
            label="Total Price"
            value={formatPrice(values.price * values.quantity || 0)}
            disabled
          />
          <SecondaryButton
            className="h-9 self-end"
            type="submit"
            disabled={isSubmitting}
          >
            Add
          </SecondaryButton>
        </div>
      </div>
    </form>
  );
};

export default AddProductBar;
