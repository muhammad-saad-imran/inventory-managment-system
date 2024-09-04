"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/utils/database/types";
import { productSchema } from "@/utils/validations/product.validation";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { createSupabaseClient } from "@/utils/supabase/client";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";
import useFormikForm from "@/utils/hooks/useFormikForm";

const initialValues = {
  name: "",
  description: "",
  price: 0,
};

const CreateProductPage = () => {
  const router = useRouter();
  const product = new ProductRepo(createSupabaseClient());

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        console.log("create");
        await product.create(values as Product);
        router.push("/dashboard/products");
      } catch (error) {
        return alert("Error ocurred while updating product");
      }
      setSubmitting(false);
    },
  });

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Product</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-full flex gap-2">
          <InputField {...getFieldAttrs("Name", "name")} />
          <InputField {...getFieldAttrs("Description", "description")} />
        </div>
        <InputField {...getFieldAttrs("Price", "price")} type="number" />
        <SecondaryButton className="w-fit" type="submit">
          Create
        </SecondaryButton>
      </form>
    </div>
  );
};

export default CreateProductPage;
