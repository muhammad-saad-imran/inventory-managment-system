CREATE TABLE "clients" (
  "id" UUID PRIMARY KEY,
  "name" varchar,
  "email" email,
  "phone_number" number,
  "created_at" timestamp
);

CREATE TABLE "products" (
  "id" UUID PRIMARY KEY,
  "name" varchar,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "suppliers" (
  "id" UUID PRIMARY KEY,
  "name" varchar,
  "email" email,
  "phone_number" number,
  "created_at" timestamp
);

CREATE TABLE "inventory" (
  "id" UUID PRIMARY KEY,
  "cost" decimal,
  "supplier_id" UUID,
  "product_id" UUID,
  "stock_quantity" integer,
  "reorder_limit" integer,
  "supply_date" timestamp,
  "created_at" timestamp
);

CREATE TABLE "orders" (
  "id" UUID PRIMARY KEY,
  "client_id" UUID,
  "order_date" timestamp,
  "status" varchar,
  "created_at" timestamp
);

CREATE TABLE "order_items" (
  "id" UUID PRIMARY KEY,
  "order_id" UUID,
  "inventory_id" UUID,
  "quantity" integer,
  "price" decimal,
  "created_at" timestamp
);

ALTER TABLE "inventory" ADD FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id");

ALTER TABLE "inventory" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("inventory_id") REFERENCES "inventory" ("id");
