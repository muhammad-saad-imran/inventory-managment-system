"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormikValues } from "formik";
import { isEqual } from "lodash";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/LoadingSlice";
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
  const dispatch = useAppDispatch();

  const [initialValues, setInitialValues] = useState<FormikValues>({});

  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        dispatch(startLoading());
        await product.update(id, values as Product);
        router.push("/dashboard/products");
      } catch (error) {
        return alert("Error ocurred while updating product");
      } finally {
        setSubmitting(false);
        dispatch(completeLoading());
      }
    },
  });

  const handleDelete = async () => {
    try {
      dispatch(startLoading());
      await product.delete(id);
      router.push("/dashboard/products");
    } catch (error) {
      dispatch(completeLoading());
      return alert("Error ocurred while deleting product");
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      dispatch(startLoading());
      const productValue = await product.get(id);
      setInitialValues(productValue);
    } catch (error) {
      alert("Error fetching products");
    } finally {
      dispatch(completeLoading());
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
      <form
        className="flex flex-col gap-4 bg-white p-3"
        onSubmit={handleSubmit}
      >
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
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
