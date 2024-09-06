import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Client, Order, ORDER_STATUS } from "@/utils/database/types";
import { OrderRepo } from "@/utils/database/OrderRepo";
import { formatDate } from "@/utils/datetime";
import { Select } from "@/elements/inputs";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

type Props = {
  orderData?: Order;
  clientData?: Client;
  setOrderData: (_orderData: Order) => void;
};

const order = new OrderRepo(createSupabaseClient());

const orderStatusOptions = Object.values(ORDER_STATUS).map((status) => ({
  label: status.charAt(0) + status.slice(1).toLowerCase(),
  value: status,
}));

const OrderInfo = ({ orderData, clientData, setOrderData }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(orderData?.status);

  const orderDate = formatDate({
    date: orderData?.order_date,
    outputDate: "MMM DD, YYYY",
  });

  const handleUpdate = async () => {
    try {
      const updatedOrder = await order.update(
        orderData?.id!,
        {
          status: selectedStatus!,
        },
        `*, order_items (*, inventory (*)), clients (*)`
      );
      setOrderData(updatedOrder);
    } catch (error) {
      alert("Error ocurred while updating");
    }
  };

  useEffect(() => {
    setSelectedStatus(orderData?.status);
  }, [orderData]);

  return (
    <div className="flex flex-col gap-3 bg-white w-full p-5 mt-3">
      <div className="flex gap-3">
        <InputField label="Client" value={clientData?.name} disabled />
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
          disabled={orderData?.status === selectedStatus}
          onClick={handleUpdate}
        >
          Update
        </SecondaryButton>
      </div>
    </div>
  );
};

export default OrderInfo;
