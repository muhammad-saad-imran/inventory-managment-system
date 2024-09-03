"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormikValues } from "formik";
import { get, isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Supplier } from "@/utils/supabase/types";
import { createSupabaseClient } from "@/utils/supabase/client";
import {
  deleteSupplier,
  updateSupplier,
} from "@/utils/actions/supplier.actions";
import { supplierSchema } from "@/utils/validations/supplier.validtion";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const SupplierInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<FormikValues>({});
  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: supplierSchema,
    async onSubmit(values, { setSubmitting }) {
      const { error } = await updateSupplier(values as Supplier);
      if (error) alert(error);
      else setInitialValues(values);
      setSubmitting(false);
    },
  });

  const handleDelete = async () => {
    const { error } = await deleteSupplier(values.id);
    alert(error);
  };

  const getSupplier = async () => {
    const supabase = createSupabaseClient();
    const { data } = await supabase.from("suppliers").select(`*`).eq("id", id);

    const supplier = get(data, "[0]");

    setInitialValues(supplier);
  };

  useEffect(() => {
    getSupplier();
  }, []);

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

export default SupplierInfoPage;
