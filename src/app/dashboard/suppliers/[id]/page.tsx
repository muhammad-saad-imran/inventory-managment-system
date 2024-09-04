"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormikValues } from "formik";
import { get, isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Supplier } from "@/utils/database/types";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { supplierSchema } from "@/utils/validations/supplier.validtion";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const supplier = new SupplierRepo(createSupabaseClient());

const SupplierInfoPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<FormikValues>({});
  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: supplierSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        const supplierData = await supplier.update(id, values as Supplier);
        setInitialValues(supplierData);
        router.push("/dashboard/suppliers");
      } catch (error) {
        alert("Error while updating supplier");
      }
      setSubmitting(false);
    },
  });

  const handleDelete = async () => {
    try {
      await supplier.delete(id);
      router.push("/dashboard/suppliers");
    } catch (error) {
      alert("Error while deleting supplier");
    }
  };

  const fetchSupplier = useCallback(async () => {
    try {
      const supplierData = await supplier.get(id);
      setInitialValues(supplierData);
    } catch (error) {
      alert("Error while fetching supplier");
    }
  }, [id]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const disableUpdate = isEqual(values, initialValues) || isSubmitting;

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Supplier</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputField {...getFieldAttrs("Name", "name")} />
        <InputField {...getFieldAttrs("Email", "email")} type="email" />
        <InputField
          {...getFieldAttrs("Phone Number", "phone_number")}
          type="number"
        />
        <div className="flex gap-4">
          <SecondaryButton
            className="w-fit"
            type="submit"
            disabled={disableUpdate}
          >
            Update
          </SecondaryButton>
          <SecondaryButton
            className="w-fit"
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
