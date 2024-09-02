import { object, string, number } from "yup";

export const productSchema = object({
  name: string()
    .required('Product name is required.'),
  description: string()
    .required('Product description is required.'),
  cost_price: number()
    .required('Cost price is required.')
    .typeError('Cost price must be a number.')
    .min(0.01, 'Cost price must be greater than 0.'),
  selling_price: number()
    .required('Selling price is required.')
    .typeError('Selling price must be a number.')
    .min(0.01, 'Selling price must be greater than 0.'),
  stock_quantity: number()
    .required('Stock quantity is required.')
    .typeError('Stock quantity must be a number.')
    .min(1, 'Stock quantity must be greater than 0.'),
  reorder_limit: number()
    .required('Reorder limit is required.')
    .typeError('Reorder limit must be a number.')
    .min(1, 'Reorder limit must be greater than 0.'),
  supplier_id: string()
    .uuid('Supplier must be a valid.')
    .required('Supplier is required.'),
});

