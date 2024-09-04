import React, { useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Client, DB_TABLES, Order } from "@/utils/supabase/types";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { createOrder } from "@/utils/actions/order.actions";
import { formatDate } from "@/utils/datetime";
import { orderSchema } from "@/utils/validations/order.validation";
import { SecondaryButton } from "@/elements/buttons";
import AsyncSelectInput from "@/components/common/AsyncSelectInput";
import InputField from "@/components/common/InputField";

type Option = {
  value: "";
  label: "";
};

const loadOptions = async (input: string) => {
  const supabase = createSupabaseClient();
  const { data: clients } = await supabase
    .from(DB_TABLES.CLIENTS)
    .select()
    .ilike("name", `%${input}%`);

  return clients
    ? clients.map(({ id, name }: Client) => ({
        value: id,
        label: name,
      }))
    : [];
};

const CreateOrderBar = () => {
  const [selectedClient, setSelectedClient] = useState<Option>();

  const { errors, touched, setFieldValue, getFieldAttrs, handleSubmit } =
    useFormikForm({
      initialValues: { client_id: "", order_date: "" },
      validationSchema: orderSchema,
      async onSubmit(values, { setSubmitting }) {
        const order_date = formatDate({
          date: values.order_date,
          outputDate: "",
        });
        const { error } = await createOrder({ ...values, order_date } as Order);
        alert(error);
        setSubmitting(false);
      },
    });

  const selectOptions = {
    loadOptions,
    label: "Client",
    value: selectedClient as any,
    errors: errors["client_id"] as string,
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
