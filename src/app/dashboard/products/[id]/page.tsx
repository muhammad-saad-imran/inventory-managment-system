"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormikValues } from "formik";
import { get, isEqual } from "lodash";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Product } from "@/utils/supabase/types";
import useCreateProduct from "@/utils/hooks/useCreateProduct";
import { deleteProduct, updateProduct } from "@/utils/actions/product.actions";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import SelectInput from "@/components/common/SelectInput";

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<FormikValues>({});
  const [initialSelectValue, setInitialSelectValue] = useState({
    value: "",
    label: "",
  });

  const { values, handleSubmit, getFieldAttrs, selectOptions, isSubmitting } =
    useCreateProduct({
      initialSelectValue,
      initialValues,
      enableReinitialize: true,
      validationSchema: productSchema,
      async onSubmit(values, { setSubmitting }) {
        const { error } = await updateProduct(values as Product);
        alert(error);
        setSubmitting(false);
      },
    });

  const handleDelete = async () => {
    const { error } = await deleteProduct(values.id);
    alert(error);
  };

  const getProduct = async () => {
    const supabase = createSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select(`*, suppliers ( id, name )`)
      .eq("id", id);

    const { suppliers, ...product } = get(data, "[0]");

    setInitialValues(product);
    setInitialSelectValue({ value: suppliers?.id, label: suppliers?.name });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const { suppliers, ...product } = initialValues;
  const disableUpdate = isEqual(product, values) || isSubmitting;
  
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
        <div className="flex gap-4">
          <SecondaryButton className="w-fit" disabled={disableUpdate}>
            Update
          </SecondaryButton>
          <SecondaryButton className="w-fit" onClick={handleDelete}>
            Delete
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProductInfoPage;
