"use client";

import React from "react";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { createSupplier } from "@/utils/actions/supplier.actions";
import { Supplier } from "@/utils/supabase/types";
import { supplierSchema } from "@/utils/validations/supplier.validtion";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
};

const CreateSupplierPage = () => {
  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: supplierSchema,
    async onSubmit(values, { setSubmitting }) {
      const { error } = await createSupplier(values as Supplier);
      alert(error);
      setSubmitting(false);
    },
  });

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
        <SecondaryButton className="w-fit">Create</SecondaryButton>
      </form>
    </div>
  );
};

export default CreateSupplierPage;
