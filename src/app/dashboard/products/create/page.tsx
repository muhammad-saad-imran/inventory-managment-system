"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Product } from "@/utils/database/types";
import { productSchema } from "@/utils/validations/product.validation";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { createSupabaseClient } from "@/utils/supabase/client";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  description: "",
};

const CreateProductPage = () => {
  const router = useRouter();
  const product = new ProductRepo(createSupabaseClient());

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
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
      <form className="flex flex-col gap-4 bg-white p-3" onSubmit={handleSubmit}>
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
        <SecondaryButton className="w-fit" type="submit">
          Create
        </SecondaryButton>
      </form>
    </div>
  );
};

export default CreateProductPage;
