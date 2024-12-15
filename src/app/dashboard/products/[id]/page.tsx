"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormikValues } from "formik";
import { isEqual } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectProduct } from "@/store/features/products";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/store/features/products/thunk";
import { Product } from "@/utils/database/types";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { productSchema } from "@/utils/validations/product.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const productValue = useAppSelector(selectProduct);

  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues: productValue,
    enableReinitialize: true,
    validationSchema: productSchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(updateProduct({ id, ...values } as Product))
        .unwrap()
        .finally(() => setSubmitting(false));
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteProduct(id))
      .unwrap()
      .then(() => router.push("/dashboard/products"));
  };

  useEffect(() => {
    dispatch(getProduct(id));
  }, [id, dispatch]);

  const disableUpdate = isEqual(productValue, values) || isSubmitting;

  return (
    <div>
      <p className="text-3xl text-center mb-8">Product</p>
      <form
        className="flex flex-col gap-4 bg-white p-6 rounded shadow"
        onSubmit={handleSubmit}
      >
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Description", "description")} />
        <div className="flex gap-4">
          <SecondaryButton
            className="w-fit"
            disabled={disableUpdate}
            data-testid="update-btn"
            type="submit"
          >
            Update
          </SecondaryButton>
          <SecondaryButton
            className="w-fit"
            onClick={handleDelete}
            data-testid="delete-btn"
            type="button"
          >
            Delete
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProductInfoPage;
