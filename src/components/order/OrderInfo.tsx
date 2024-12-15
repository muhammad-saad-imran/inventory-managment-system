import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { Client, Order, ORDER_STATUS } from "@/utils/database/types";
import { updateOrder } from "@/store/features/orders/thunk";
import { formatDate } from "@/utils/datetime";
import { Select } from "@/elements/inputs";
import { SecondaryButton } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

type Props = {
  orderData?: Order;
  clientData?: Client;
};

const orderStatusOptions = Object.values(ORDER_STATUS).map((status) => ({
  label: status.charAt(0) + status.slice(1).toLowerCase(),
  value: status,
}));

const OrderInfo = ({ orderData, clientData }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState(orderData?.status);

  const orderDate = formatDate({
    date: orderData?.order_date,
    outputDate: "MMM DD, YYYY",
  });

  const handleUpdate = async () => {
    await dispatch(
      updateOrder({
        id: orderData?.id!,
        status: selectedStatus!,
      } as Order)
    );
  };

  useEffect(() => {
    setSelectedStatus(orderData?.status);
  }, [orderData]);

  return (
    <div className="flex flex-col gap-3 bg-white w-full p-6 mt-3 rounded shadow">
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
