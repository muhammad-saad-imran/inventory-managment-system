import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice } from "@/utils/datetime";
import { createSupabaseClient } from "@/utils/supabase/client";
import { DB_TABLES, OrderItem, Product } from "@/utils/supabase/types";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { orderItemSchema } from "@/utils/validations/order.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";
import { get } from "lodash";
import { addProduct } from "@/utils/actions/order.actions";

type Props = {
  refetch: () => void;
};

type Option = Product & { label: string };

const loadOptions = async (input: string) => {
  const supabase = await createSupabaseClient();
  const { data } = await supabase
    .from(DB_TABLES.PRODUCTS)
    .select()
    .ilike("name", `%${input}%`);

  return data
    ? data.map((item: Product) => ({
        label: item.name,
        ...item,
      }))
    : [];
};

const AddProductBar = ({ refetch }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Option | null>(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    getFieldAttrs,
    handleSubmit,
    setFieldValue,
  } = useFormikForm({
    initialValues: { product_id: "", quantity: 0, price: 0 },
    validationSchema: orderItemSchema,
    async onSubmit(values, { setFieldError, setSubmitting, resetForm }) {
      if (values.quantity > get(selectedProduct, "stock_quantity", 0)) {
        setFieldError(
          "quantity",
          `Quantity should be less than stock available`
        );
        return;
      }

      const { success, error } = await addProduct({
        order_id: id,
        ...values,
      } as OrderItem);

      if (success) {
        refetch();
        setSubmitting(false);
        setSelectedProduct(null);
        resetForm();
      } else {
        alert(error);
      }
    },
  });

  const selectAttrs = {
    loadOptions,
    label: "Product",
    value: selectedProduct as any,
    error: errors["product_id"] as string,
    touched: touched["product_id"] as boolean,
    onChange(newOption: Option) {
      setSelectedProduct(newOption);
      if (newOption) setFieldValue("product_id", newOption.id);
    },
  };

  useEffect(() => {
    setFieldValue("price", values?.quantity * selectedProduct?.selling_price!);
  }, [values?.quantity, selectedProduct?.selling_price]);

  return (
    <form className="bg-white w-full p-5 mt-3" onSubmit={handleSubmit}>
      <div className="flex gap-4 w-full">
        <AsyncSelectInput key={selectedProduct?.id} {...selectAttrs} />
        <InputField
          label="Stock"
          value={selectedProduct?.stock_quantity || 0}
          disabled
        />
      </div>
      <div className="flex gap-4 w-full mt-3">
        <InputField {...getFieldAttrs("Quantity", "quantity")} type="number" />
        <InputField
          label="Price"
          value={formatPrice(values.price || 0)}
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
    </form>
  );
};

export default AddProductBar;
