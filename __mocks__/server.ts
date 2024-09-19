import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { DB_TABLES } from "@/utils/database/types";
import database from "@/../__mocks__/database.json";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const productsUrl = `${SUPABASE_URL}/rest/v1/${DB_TABLES.PRODUCTS}`;
const productHandlers = [
  http.get(productsUrl, () => HttpResponse.json(database.products)),
  http.post(productsUrl, () => HttpResponse.json(database.products[0])),
  http.patch(productsUrl, () => HttpResponse.json(database.products[0])),
  http.delete(productsUrl, () => HttpResponse.json(database.products[0])),
];

const handlers = [...productHandlers];

const server = setupWorker(...handlers);

export default server;
