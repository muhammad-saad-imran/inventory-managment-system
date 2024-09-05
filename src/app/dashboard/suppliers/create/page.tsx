"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Supplier } from "@/utils/database/types";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { createSupabaseClient } from "@/utils/supabase/client";
import { supplierSchema } from "@/utils/validations/supplier.validtion";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
};

const CreateSupplierPage = () => {
  const router = useRouter();
  const supplier = new SupplierRepo(createSupabaseClient());

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: supplierSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        const supplierData = await supplier.create(values as Supplier);
        router.push("/dashboard/suppliers");
      } catch (error) {
        alert("Error while creating supplier");
      }
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
