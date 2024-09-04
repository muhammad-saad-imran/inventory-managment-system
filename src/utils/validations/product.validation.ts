import { object, string, number } from "yup";

export const productSchema = object({
  name: string().required("Product name is required."),
  description: string().required("Product description is required."),
  price: number()
    .required("Cost price is required.")
    .typeError("Cost price must be a number.")
    .min(0.01, "Cost price must be greater than 0."),
});
