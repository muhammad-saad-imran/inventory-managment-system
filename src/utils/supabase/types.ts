// types.ts

export enum DB_TABLES {
  CLIENTS = "clients",
  INVOICES = "invoices",
  ORDERS = "orders",
  ORDER_ITEMS = "order_items",
  PRODUCTS = "products",
  SUPPLIERS = "suppliers",
}

export type Supplier = {
  id: string; // UUID
  name: string; // varchar
  email: string; // email
  phone_number: number; // number
  created_at: string; // timestamp
};

export type Product = {
  id?: string; // UUID
  name: string; // varchar
  description: string; // text
  cost_price: number; // decimal
  selling_price: number; // decimal
  stock_quantity: number; // number
  reorder_limit: number; // number
  supplier_id?: string; // UUID (foreign key from suppliers)
  created_at?: string; // timestamp
};

export type Client = {
  id: string; // UUID
  name: string; // varchar
  email: string; // email
  phone_number: number; // number
  created_at: string; // timestamp
};

export type Order = {
  id: string; // UUID
  client_id: string; // UUID (foreign key from clients)
  order_date: string; // timestamp
  status: string; // varchar
  total_amount: number; // decimal
  created_at: string; // timestamp
};

export type OrderItem = {
  id: string; // UUID
  order_id: string; // UUID (foreign key from orders)
  product_id: string; // UUID (foreign key from products)
  quantity: number; // integer
  price: number; // decimal
  created_at: string; // timestamp
};

export type Invoice = {
  id: string; // UUID
  order_id: string; // UUID (foreign key from orders)
  invoice_date: string; // timestamp
  due_date: string; // timestamp
  amount: number; // decimal
  status: string; // varchar
  created_at: string; // timestamp
};
