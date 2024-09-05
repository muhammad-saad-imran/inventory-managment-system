import { object, string, number } from "yup";

export const productSchema = object({
  name: string().required("Product name is required."),
  description: string().required("Product description is required."),
});
