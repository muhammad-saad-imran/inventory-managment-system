import { useEffect, useState } from "react";
import { Client, Order, ORDER_STATUS } from "@/utils/supabase/types";
import { formatDate } from "@/utils/datetime";
import { Select } from "@/elements/inputs";
import InputField from "@/components/common/InputField";
import { SecondaryButton } from "@/elements/buttons";
import { updateOrder } from "@/utils/actions/order.actions";

type Props = {
  order?: Order;
  client?: Client;
  refetch: () => Promise<void>;
};

const orderStatusOptions = Object.values(ORDER_STATUS).map((status) => ({
  label: status.charAt(0) + status.slice(1).toLowerCase(), // Capitalizes the first letter and converts the rest to lowercase
  value: status,
}));

const OrderInfo = ({ order, client, refetch }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status);

  const orderDate = formatDate({
    date: order?.order_date,
    outputDate: "MMM DD, YYYY",
  });

  const handleUpdate = async () => {
    const { success, error } = await updateOrder({
      ...order,
      status: selectedStatus as ORDER_STATUS,
    } as Order);

    if (!success) alert(error);
    else await refetch();
  };

  useEffect(() => {
    setSelectedStatus(order?.status);
  }, [order]);

  return (
    <div className="flex flex-col gap-3 bg-white w-full p-5 mt-3">
      <div className="flex gap-3">
        <InputField label="Client" value={client?.name} disabled />
        <InputField label="Order date" value={orderDate} disabled />
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full">
          <label htmlFor="order-status">Order Status</label>
          <Select
            id="order-status"
            className="mt-2"
            name="order-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ORDER_STATUS)}
          >
            {orderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <SecondaryButton
          className="h-9 self-end"
          disabled={order?.status === selectedStatus}
          onClick={handleUpdate}
        >
          Update
        </SecondaryButton>
      </div>
    </div>
  );
};

export default OrderInfo;
