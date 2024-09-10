import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { completeLoading, startLoading } from "@/store/features/loading";
import { Product } from "@/utils/database/types";

const FETCH_ALL_PRODUCTS = "products/getAll";
const FETCH_PRODUCT_BY_ID = "products/get";
const CREATE_PRODUCT = "products/create";
const UPDATE_PRODUCT = "products/update";
const DELETE_PRODUCT = "products/delete";

const product = new ProductRepo(createSupabaseClient());

export const getAllProducts = createAsyncThunk(
  FETCH_ALL_PRODUCTS,
  async (productName: string, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(startLoading());
      const data = await product.getWithName(productName);
      dispatch(completeLoading());
      return data;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error fetching products");
      rejectWithValue(error);
    }
  }
);

export const getProduct = createAsyncThunk(
  FETCH_PRODUCT_BY_ID,
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const productValue = await product.get(id);
      dispatch(completeLoading());
      return productValue;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error fetching products");
      rejectWithValue(error);
    }
  }
);

export const createProduct = createAsyncThunk(
  CREATE_PRODUCT,
  async (newProduct: Product, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const createdProduct = await product.create(newProduct);
      dispatch(completeLoading());
      return createdProduct;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error ocurred while updating product");
      rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  UPDATE_PRODUCT,
  async (productValues: Product, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const updatedProduct = await product.update(
        productValues.id,
        productValues
      );
      dispatch(completeLoading());
      return updatedProduct;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error ocurred while updating product");
      rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  DELETE_PRODUCT,
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      await product.delete(id);
      dispatch(completeLoading());
      return;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error ocurred while deleting product");
      rejectWithValue(error);
    }
  }
);
