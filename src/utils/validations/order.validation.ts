import { object, string, date, number } from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const orderSchema = object({
  client_id: string()
    .uuid("Select valid Client")
    .required("Client is required"),
  order_date: date()
    .min(today, "Order Date cannot be in the past")
    .required("Order date is required"),
});

export const orderItemSchema = object({
  order_id: string()
    .uuid("Select valid Order")
    .required("Order is required"),

  inventory_id: string()
    .uuid("Select valid Inventory")
    .required("Inventory is required"),

  quantity: number().min(1).required(),

  price: number().positive().required(),
});
