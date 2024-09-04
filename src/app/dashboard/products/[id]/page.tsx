"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormikValues } from "formik";
import { isEqual } from "lodash";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Product } from "@/utils/database/types";
import { ProductRepo } from "@/utils/database/ProductRepo";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const product = new ProductRepo(createSupabaseClient());

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<FormikValues>({});

  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        await product.update(id, values as Product);
        router.push("/dashboard/products");
      } catch (error) {
        return alert("Error ocurred while updating product");
      }
      setSubmitting(false);
    },
  });

  const handleDelete = async () => {
    try {
      await product.delete(id);
      router.push("/dashboard/products");
    } catch (error) {
      return alert("Error ocurred while deleting product");
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      const productValue = await product.get(id);
      setInitialValues(productValue);
    } catch (error) {
      alert("Error fetching products");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const { suppliers, ...initialProduct } = initialValues;
  const disableUpdate = isEqual(initialProduct, values) || isSubmitting;

  return (
    <div>
      <p className="text-3xl text-center mb-8">Product</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-full flex gap-2">
          <InputField {...getFieldAttrs("Name", "name")} />
          <InputField {...getFieldAttrs("Description", "description")} />
        </div>
        <InputField {...getFieldAttrs("Price", "price")} type="number" />
        <div className="flex gap-4">
          <SecondaryButton
            className="w-fit"
            disabled={disableUpdate}
            type="submit"
          >
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
