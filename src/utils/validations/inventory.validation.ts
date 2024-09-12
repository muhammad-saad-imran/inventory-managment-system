import * as Yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const inventorySchema = Yup.object({
  cost: Yup.number()
    .typeError("Cost must be a number")
    .positive("Cost must be a positive number")
    .required("Cost is required"),

  supplier_id: Yup.string()
    .uuid("Invalid Supplier")
    .required("Supplier is required"),

  product_id: Yup.string()
    .uuid("Invalid Product")
    .required("Product is required"),

  stock_quantity: Yup.number()
    .typeError("Stock quantity must be a number")
    .integer("Stock quantity must be an integer")
    .min(0, "Stock quantity must be at least 0")
    .required("Stock quantity is required"),

  reorder_limit: Yup.number()
    .typeError("Reorder limit must be a number")
    .integer("Reorder limit must be an integer")
    .min(0, "Reorder limit must be at least 0")
    .required("Reorder limit is required"),

  supply_date: Yup.date()
    .min(today, "Supply date cannot be in the past")
    .required("Supply date is required"),
});
