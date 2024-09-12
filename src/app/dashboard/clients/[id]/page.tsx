"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isEqual } from "lodash";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteClient,
  getClient,
  updateClient,
} from "@/store/features/clients/thunk";
import { selectClient } from "@/store/features/clients";
import { Client } from "@/utils/database/types";
import { clientSchema } from "@/utils/validations/client.validation";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

const ClientInfoPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const initialClient = useAppSelector(selectClient);

  const { values, handleSubmit, getFieldAttrs, isSubmitting } = useFormikForm({
    initialValues: initialClient,
    enableReinitialize: true,
    validationSchema: clientSchema,
    async onSubmit(values, { setSubmitting }) {
      await dispatch(updateClient({ id, ...values } as Client))
        .unwrap()
        .finally(() => setSubmitting(false));
    },
  });

  const handleDelete = async () => {
    await dispatch(deleteClient(id))
      .unwrap()
      .then(() => router.push("/dashboard/clients"));
  };

  useEffect(() => {
    dispatch(getClient(id));
  }, [id, dispatch]);

  const disableUpdate = isEqual(initialClient, values) || isSubmitting;

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
