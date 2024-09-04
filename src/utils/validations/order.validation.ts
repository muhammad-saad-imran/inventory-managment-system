import { object, string, date, number } from "yup";

export const orderSchema = object({
  client_id: string()
    .uuid("Select valid Client")
    .required("Client is required"),
  order_date: date().required("Order date is required"),
});

export const orderItemSchema = object({
  product_id: string()
    .uuid("Select valid Product")
    .required("Product is required"),
  quantity: number().min(1).required(),
  price: number().positive().required(),
});
