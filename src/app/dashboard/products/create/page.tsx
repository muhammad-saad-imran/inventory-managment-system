"use client";

import React, { useState } from "react";
import { createProduct } from "@/utils/actions/product.actions";
import { Product, Supplier } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/SelectInput";

type Option = {
  value: string;
  label: string;
};

const initialValues = {
  name: "",
  description: "",
  cost_price: 0,
  selling_price: 0,
  stock_quantity: 0,
  reorder_limit: 0,
  supplier_id: "",
};

const CreateProductPage = () => {
  const [selectValue, setSelectValue] = useState<Option>({
    value: "",
    label: "",
  });

  const { handleSubmit, getFieldAttrs, errors, touched, setFieldValue } =
    useFormikForm({
      initialValues,
      validationSchema: productSchema,
      async onSubmit(values, { setSubmitting }) {
        const { error } = await createProduct(values as Product);
        alert(error);
        setSubmitting(false);
      },
    });

  const loadOptions = async (input: string) => {
    const supabase = createClient();
    const { data: suppliers } = await supabase
      .from("suppliers")
      .select()
      .ilike("name", `%${input}%`);

    return suppliers
      ? suppliers.map(({ id, name }: Supplier) => ({
          value: id,
          label: name,
        }))
      : [];
  };

  const selectOptions = {
    loadOptions,
    label: "Supplier",
    value: selectValue as any,
    error: errors["supplier_id"] as string,
    touched: touched["supplier_id"] as boolean,
    onChange(newValue: Option) {
      setFieldValue("supplier_id", newValue.value);
      setSelectValue(newValue);
    },
  };

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Product</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
        <SelectInput {...selectOptions} />
        <div className="w-full flex gap-2">
          <InputField
            {...getFieldAttrs("Cost Price", "cost_price")}
            type="number"
          />
          <InputField
            {...getFieldAttrs("Selling Price", "selling_price")}
            type="number"
          />
        </div>
        <div className="w-full flex gap-2">
          <InputField
            {...getFieldAttrs("Stock", "stock_quantity")}
            type="number"
          />
          <InputField
            {...getFieldAttrs("Reorder Limit", "reorder_limit")}
            type="number"
          />
        </div>
        <SecondaryButton className="w-fit">Create</SecondaryButton>
      </form>
    </div>
  );
};

export default CreateProductPage;
