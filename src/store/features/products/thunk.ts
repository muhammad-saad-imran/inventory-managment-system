import { createSupabaseClient } from "@/utils/supabase/client";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { Product } from "@/utils/database/types";
import { customThunkCreator } from "@/store/utils";

const FETCH_ALL_PRODUCTS = "products/getAll";
const FETCH_PRODUCT_BY_ID = "products/get";
const CREATE_PRODUCT = "products/create";
const UPDATE_PRODUCT = "products/update";
const DELETE_PRODUCT = "products/delete";

const product = new ProductRepo(createSupabaseClient());

export const getAllProducts = customThunkCreator<string, Product[]>(
  FETCH_ALL_PRODUCTS,
  "Error ocuured fetching products",
  async (productName: string) => {
    const data = await product.getWithName(productName);
    return data;
  }
);

export const getProduct = customThunkCreator<string, Product>(
  FETCH_PRODUCT_BY_ID,
  "Error ocuured fetching products",
  async (id: string) => {
    const productValue = await product.get(id);
    return productValue;
  }
);

export const createProduct = customThunkCreator<Product, Product>(
  CREATE_PRODUCT,
  "Error ocuured creating products",
  async (newProduct: Product) => {
    const createdProduct = await product.create(newProduct);
    return createdProduct;
  }
);

export const updateProduct = customThunkCreator<Product, Product>(
  UPDATE_PRODUCT,
  "Error ocuured updating products",
  async (productValues: Product) => {
    const updatedProduct = await product.update(
      productValues.id,
      productValues
    );
    return updatedProduct;
  }
);

export const deleteProduct = customThunkCreator<string, void>(
  DELETE_PRODUCT,
  "Error ocuured deleting products",
  async (id: string) => {
    await product.delete(id);
  }
);
