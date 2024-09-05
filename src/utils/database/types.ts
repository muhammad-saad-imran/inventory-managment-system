// types.ts

export enum DB_TABLES {
  CLIENTS = "clients",
  INVOICES = "invoices",
  ORDERS = "orders",
  ORDER_ITEMS = "order_items",
  PRODUCTS = "products",
  SUPPLIERS = "suppliers",
  INVENTORY = "inventory",
}

export type Supplier = {
  id: string; // UUID
  name: string; // varchar
  email: string; // email
  phone_number: number; // number
  created_at: string; // timestamp
};

export type Product = {
  id: string; // UUID
  name: string; // varchar
  description: string; // text
  price: number; // decimal
  created_at: string; // timestamp
  suppliers?: Supplier;
};

export type Inventory = {
  id: string; // UUID
  cost: number; // DECIMAL
  supplier_id: string; // UUID, foreign key to suppliers
  product_id: string; // UUID, foreign key to products
  stock_quantity: number; // INTEGER
  reorder_limit: number; // INTEGER
  created_at: string; // TIMESTAMP WITH TIME ZONE
  suppliers?: Supplier;
  products?: Product;
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
