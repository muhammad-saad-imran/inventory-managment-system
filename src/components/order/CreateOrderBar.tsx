import React, { useState } from "react";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/LoadingSlice";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Client, Order } from "@/utils/database/types";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { formatDate } from "@/utils/datetime";
import { orderSchema } from "@/utils/validations/order.validation";
import { SecondaryButton } from "@/elements/buttons";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";
import InputField from "@/components/common/InputField";

type Props = {
  refetch: () => void;
};

type Option = {
  value: "";
  label: "";
};

const client = new ClientRepo(createSupabaseClient());
const order = new OrderRepo(createSupabaseClient());

const loadOptions = async (input: string) => {
  try {
    const clients = await client.getWithName(input);
    return clients.map(({ id, name }: Client) => ({
      value: id,
      label: name,
    }));
  } catch (error) {
    return [];
  }
};

const CreateOrderBar = ({ refetch }: Props) => {
  const [selectedClient, setSelectedClient] = useState<Option>();

  const dispatch = useAppDispatch();

  const { errors, touched, setFieldValue, getFieldAttrs, handleSubmit } =
    useFormikForm({
      initialValues: { client_id: "", order_date: "" },
      validationSchema: orderSchema,
      async onSubmit(values, { setSubmitting }) {
        try {
          const newOrder = {
            ...values,
            order_date: formatDate({
              date: values.order_date,
              outputDate: "",
            }),
          } as Order;

          dispatch(startLoading());
          await order.create(newOrder);
          await refetch();
        } catch (error) {
          dispatch(completeLoading());
          alert("Error occurred while creating order");
        }
        setSubmitting(false);
      },
    });

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
