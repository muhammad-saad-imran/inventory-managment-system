"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSupplier } from "@/store/features/suppliers";
import {
  deleteSupplier,
  getSupplier,
  updateSupplier,
} from "@/store/features/suppliers/thunk";
import { Supplier } from "@/utils/database/types";
import { supplierSchema } from "@/utils/validations/supplier.validtion";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const SupplierInfoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const supplierData = useAppSelector(selectSupplier);

  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues: supplierData,
    enableReinitialize: true,
    validationSchema: supplierSchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(updateSupplier({ id, ...values } as Supplier))
        .unwrap()
        .finally(() => setSubmitting(false));
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteSupplier(id))
      .unwrap()
      .then(() => router.push("/dashboard/suppliers"));
  };

  useEffect(() => {
    dispatch(getSupplier(id));
  }, [dispatch, id]);

  const disableUpdate = isEqual(values, supplierData) || isSubmitting;

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Supplier</p>
      <form className="flex flex-col gap-4 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Email", "email")} type="email" />
        <InputField
          {...getFieldAttrs("Phone Number", "phone_number")}
          type="number"
        />
        <div className="flex gap-4">
          <SecondaryButton
            className="w-fit"
            data-testid="update-btn"
            type="submit"
            disabled={disableUpdate}
          >
            Update
          </SecondaryButton>
          <SecondaryButton
            className="w-fit"
            data-testid="delete-btn"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
};

export default SupplierInfoPage;
