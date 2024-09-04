"use client";

import React from "react";
import useCreateProduct from "@/utils/hooks/useCreateProduct";
import { Product } from "@/utils/supabase/types";
import { createProduct } from "@/utils/actions/product.actions";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";

const initialValues = {
  name: "",
  description: "",
  cost_price: 0,
  selling_price: 0,
  stock_quantity: 0,
  reorder_limit: 0,
  supplier_id: "",
};

const initialSelectValue = {
  value: "",
  label: "",
};

const CreateProductPage = () => {
  const { handleSubmit, getFieldAttrs, selectOptions } = useCreateProduct({
    initialSelectValue,
    initialValues,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      const { error } = await createProduct(values as Product);
      alert(error);
      setSubmitting(false);
    },
  });

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Product</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
        <AsyncSelectInput {...selectOptions} />
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
