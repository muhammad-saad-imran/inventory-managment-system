"use client";

import React from "react";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Client } from "@/utils/supabase/types";
import { createClient } from "@/utils/actions/client.actions";
import { clientSchema } from "@/utils/validations/client.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
};

const CreateClientPage = () => {
  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      const { error } = await createClient(values as Client);
      alert(error);
      setSubmitting(false);
    },
  });

  return (
    <div>
      <p className="text-3xl text-center mb-8">Create Client</p>
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

export default CreateClientPage;
