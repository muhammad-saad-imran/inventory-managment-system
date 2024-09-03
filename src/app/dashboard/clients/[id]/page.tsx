"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormikValues } from "formik";
import { get, isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { Client, DB_TABLES } from "@/utils/supabase/types";
import { createSupabaseClient } from "@/utils/supabase/client";
import { clientSchema } from "@/utils/validations/client.validation";
import { deleteClient, updateClient } from "@/utils/actions/client.actions";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const ClientInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<FormikValues>({});
  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      const { error } = await updateClient(values as Client);
      if (error) alert(error);
      else setInitialValues(values);
      setSubmitting(false);
    },
  });

  const handleDelete = async () => {
    const { error } = await deleteClient(values.id);
    alert(error);
  };

  const getClient = useCallback(async () => {
    const supabase = createSupabaseClient();
    const { data } = await supabase
      .from(DB_TABLES.CLIENTS)
      .select()
      .eq("id", id);

    const client = get(data, "[0]");

    setInitialValues(client);
  }, [id]);

  useEffect(() => {
    getClient();
  }, [getClient]);

  const disableUpdate = isEqual(initialValues, values) || isSubmitting;

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

export default ClientInfoPage;
