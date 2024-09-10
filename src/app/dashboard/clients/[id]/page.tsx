"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormikValues } from "formik";
import { isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/features/loading/LoadingSlice";
import { Client } from "@/utils/database/types";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { clientSchema } from "@/utils/validations/client.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const client = new ClientRepo(createSupabaseClient());

const ClientInfoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const [initialValues, setInitialValues] = useState<FormikValues>({});
  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues,
    enableReinitialize: true,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      try {
        dispatch(startLoading());
        const clientData = await client.update(values.id, values as Client);
        setInitialValues(clientData);
        router.push("/dashboard/clients");
      } catch (error) {
        dispatch(completeLoading());
        alert("Error updating client");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    try {
      dispatch(startLoading());
      await client.delete(values.id);
      router.push("/dashboard/clients");
    } catch (error) {
      dispatch(completeLoading());
      alert("Error deleting client");
    }
  };

  const fetchClient = useCallback(async () => {
    try {
      dispatch(startLoading());
      const clientData = await client.get(id);
      setInitialValues(clientData);
    } catch (error) {
      alert("Error fetching clients");
    } finally {
      dispatch(completeLoading());
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

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
