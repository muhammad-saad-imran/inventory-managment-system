import React, { useState } from "react";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch } from "@/store/hooks";
import { createOrder } from "@/store/features/orders/thunk";
import { getAllClient } from "@/store/features/clients/thunk";
import { Client, Order } from "@/utils/database/types";
import { orderSchema } from "@/utils/validations/order.validation";
import { SecondaryButton } from "@/elements/buttons";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";
import InputField from "@/components/common/InputField";

type Props = {
  search: string;
};

type Option = {
  value: "";
  label: "";
};

const CreateOrderBar = ({ search }: Props) => {
  const [selectedClient, setSelectedClient] = useState<Option>();

  const dispatch = useAppDispatch();

  const { errors, touched, setFieldValue, getFieldAttrs, handleSubmit } =
    useFormikForm({
      initialValues: { client_id: "", order_date: "" },
      validationSchema: orderSchema,
      async onSubmit(values, { setSubmitting }) {
        await dispatch(
          createOrder({ order: values as Order, clientName: search })
        )
          .unwrap()
          .finally(() => setSubmitting(false));
      },
    });

  const loadOptions = async (input: string) => {
    try {
      const clients = await dispatch(getAllClient(input)).unwrap();
      return clients
        ? clients.map(({ id, name }: Client) => ({
            value: id,
            label: name,
          }))
        : [];
    } catch (error) {
      return [];
    }
  };

  const selectOptions = {
    loadOptions,
    label: "Client",
    value: selectedClient as any,
    error: errors["client_id"] as string,
    touched: touched["client_id"] as boolean,
    onChange: (newOption: Option) => {
      setSelectedClient(newOption);
      setFieldValue("client_id", newOption.value);
    },
  };

  return (
    <form className="flex gap-4 bg-white w-full p-5" onSubmit={handleSubmit}>
      <AsyncSelectInput {...selectOptions} />
      <InputField type="date" {...getFieldAttrs("Order Date", "order_date")} />
      <SecondaryButton className="h-9 self-end">Create</SecondaryButton>
    </form>
  );
};

export default CreateOrderBar;
