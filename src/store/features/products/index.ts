import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Product } from "@/utils/database/types";
import {
  getAllProducts,
  getProduct,
  updateProduct,
} from "@/store/features/products/thunk";

interface ProductState {
  product: Product;
  allProducts: Product[];
}

const initialState = {
  product: {
    id: "",
    name: "",
    description: "",
    created_at: "",
  },
  allProducts: [],
} satisfies ProductState as ProductState;

const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        if (action.payload) {
          state.allProducts = action.payload;
        }
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.product = action.payload;
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.product = action.payload;
        }
      });
  },
});

export const {} = ProductSlice.actions;
export default ProductSlice.reducer;

export const selectProduct = (state: RootState) => state.product.product;
export const selectAllProducts = (state: RootState) =>
  state.product.allProducts;
