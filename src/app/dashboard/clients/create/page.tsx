"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Client } from "@/utils/database/types";
import { createClient } from "@/store/features/clients/thunk";
import { clientSchema } from "@/utils/validations/client.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const initialValues = {
  name: "",
  email: "",
  phone_number: "",
};

const CreateClientPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { handleSubmit, getFieldAttrs } = useFormikForm({
    initialValues,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(createClient(values as Client))
        .unwrap()
        .then(() => router.push("/dashboard/clients"))
        .finally(() => setSubmitting(false));
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
