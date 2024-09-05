"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { Client } from "@/utils/database/types";
import { clientSchema } from "@/utils/validations/client.validation";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
};

const CreateClientPage = () => {
  const router = useRouter();
  const client = new ClientRepo(createSupabaseClient());

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        await client.create(values as Client);
        router.push("/dashboard/clients");
      } catch (error) {
        alert("Error updating client");
      }
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
