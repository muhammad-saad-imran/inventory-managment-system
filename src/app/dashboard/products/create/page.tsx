"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch } from "@/store/hooks";
import { createProduct } from "@/store/features/products/thunk";
import { Product } from "@/utils/database/types";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  description: "",
};

const CreateProductPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(createProduct(values as Product))
        .unwrap()
        .then(() => router.push("/dashboard/products"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Product</p>
      <form
        className="flex flex-col gap-4 bg-white p-6 rounded shadow"
        onSubmit={handleSubmit}
      >
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
        <SecondaryButton data-testid="submit-btn" className="w-fit" type="submit">
          Create
        </SecondaryButton>
      </form>
    </div>
  );
};

export default CreateProductPage;
